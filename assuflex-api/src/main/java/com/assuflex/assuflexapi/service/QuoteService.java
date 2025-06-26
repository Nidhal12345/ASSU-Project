package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.*;
import com.assuflex.assuflexapi.model.*;
import com.assuflex.assuflexapi.repository.OffreRepository;
import com.assuflex.assuflexapi.repository.TransactionRepository;
import com.assuflex.assuflexapi.utils.EmailService;
import com.assuflex.assuflexapi.utils.FileStorageService;
import com.assuflex.assuflexapi.repository.QuoteRepository;
import com.assuflex.assuflexapi.repository.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@AllArgsConstructor
@Service
@Slf4j
public class QuoteService {

    private static final double FAMILY_THIRD_CHILD_DISCOUNT = 0.5;
    private static final int SENIOR_AGE_THRESHOLD = 60;
    private static final int YOUNG_ADULT_MAX_AGE = 30;
    private static final int ADULT_MIN_AGE = 31;
    private static final int ADULT_MAX_AGE = 59;
    private static final int CHILD_MAX_AGE = 10;
    private static final int TEEN_MAX_AGE = 17;

    private static final double CHILD_TARIFF = 15.0;
    private static final double TEEN_TARIFF = 18.0;
    private static final double ADULT_TARIFF = 45.0;

    private static final double[] COVERAGE_THRESHOLDS = {0, 33.33, 66.66, 100};
    private static final double[] COVERAGE_COSTS = {1.0, 2.0, 3.0, 4.0, 5.0};

    private final StripeService stripeService;

    private final FileStorageService fileStorageService;

    private final QuoteRepository quoteRepository;

    private final TransactionRepository txRepo;

    private final OffreRepository offreRepository;

    private final UserRepository userRepository;

    private final EmailService emailService;

    @Transactional
    public Integer createQuote(Integer userId, @Valid devisDTO dto, MultipartFile[] files) {
        Users user = findUser(userId);
        if(!user.getRole().getRoleName().equals("ROLE_CLIENT")){
            throw new RuntimeException("you are not a client");
        }
        updateUserDetails(user, dto);
        Quote quote = buildQuote(dto, user);
        addChildrenToQuote(quote, dto.getChildrenInfo());
        Quote quoteNew = quoteRepository.save(quote);
        fileStorageService.saveFiles(files, quote.getId());

        return quoteNew.getId();
    }

    private Users findUser(Integer userId) {
        log.info("Finding user with ID: {}", userId);
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("gggg"));
    }

    private void updateUserDetails(Users user, devisDTO dto) {
        if (!isValidPostalCode(dto.getPostalCode())) {
            throw new IllegalArgumentException("Invalid postal code: " + dto.getPostalCode());
        }
        user.setPostalCode(dto.getPostalCode());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setBirthDate(LocalDate.from(dto.getBirthDate()));
        user.setPhoneNumber(dto.getPhoneNumber());
    }

    private Quote buildQuote(devisDTO dto, Users user) {
        int childrenCount = Optional.ofNullable(dto.getChildrenInfo())
                .map(List::size)
                .orElse(0);
        return Quote.builder()
                .coverageOption(dto.getCoverageOption())
                .status("en_attente")
                .startDate(LocalDate.from(dto.getStartDate()))
                .regularCare(String.valueOf(dto.getRegularCare()))
                .hospitalization(String.valueOf(dto.getHospitalization()))
                .dental(String.valueOf(dto.getDental()))
                .optical(String.valueOf(dto.getOptical()))
                .civility(dto.getCivility())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .birthDate(LocalDate.from(dto.getBirthDate()))
                .profession(dto.getProfession())
                .regime(dto.getRegime())
                .postalCode(dto.getPostalCode())
                .phoneNumber(dto.getPhoneNumber())
                .email(dto.getEmail())
                .offreName(dto.getOfferName())
                .spouseFirstName(dto.getSpouseFirstName())
                .spouseLastName(dto.getSpouseLastName())
                .spouseBirthDate(dto.getSpouseBirthDate())
                .annualPrice(dto.getAnnualPrice())
                .price(dto.getMonthlyPrice())
                .user(user)
                .build();
    }

    private void addChildrenToQuote(Quote quote, List<ChildInfo> childrenInfo) {
        if (childrenInfo != null && !childrenInfo.isEmpty()) {
            List<Child> children = childrenInfo.stream()
                    .filter(this::isValidChildInfo)
                    .map(ci -> {
                        Child c = new Child();
                        c.setFirstName(ci.getFirstName());
                        c.setLastName(ci.getLastName());
                        c.setBirthDate(ci.getBirthDate());
                        c.setQuote(quote);
                        return c;
                    })
                    .collect(Collectors.toList());
            quote.setChildren(children);
        }
    }

    private boolean isValidPostalCode(String postalCode) {
        return postalCode != null && postalCode.matches("\\d{5}");
    }

    private boolean isValidChildInfo(ChildInfo childInfo) {
        return childInfo.getFirstName() != null && !childInfo.getFirstName().isEmpty()
                && childInfo.getLastName() != null && !childInfo.getLastName().isEmpty()
                && childInfo.getBirthDate() != null;
    }

    @Transactional
    public void acceptQuote(Long quoteid) throws MessagingException, StripeException {
        Quote quote = quoteRepository.findById(quoteid)
                .orElseThrow(() -> new RuntimeException("Devis non trouvé"));

        if(!"en_attente".equals(quote.getStatus())){
            throw new RuntimeException("you cant make this");
        }
            quote.setStatus("accepted");

            Users user = quote.getUser();


        if (user.getContract() != null && user.getContract().getContractNumber() != null && !user.getContract().getContractNumber().isEmpty()) {
            System.out.println("This user has a contract");
        }
            
        long amountInCents = Math.round(quote.getPrice() * 100);

        productRequest productRequest = com.assuflex.assuflexapi.DTO.productRequest.builder()
                    .name("ASSUFLEX- "+quote.getOffreName())
                    .amount(amountInCents)
                .userId(user.getId())
                .currency("EUR")
                    .quantity(1L)
                    .build();

            Session session = stripeService.createSession(productRequest);
            quote.setStripeURL(session.getUrl());
            quoteRepository.save(quote);

        Transaction tx = Transaction.builder()
                .user(user)
                .Nom("test")
                .sessionId(session.getId())
                .amount(productRequest.getAmount())
                .currency(productRequest.getCurrency())
                .status(Transaction.Status.PENDING)
                .updatedAt(LocalDateTime.now())
                .quote(quote)
                .build();
        txRepo.save(tx);



            emailService.sendPlanAcceptedEmail(user, session.getUrl());
    }

    @Transactional
    public void rejectQuote(Long quoteid) throws MessagingException {
        Quote quote = quoteRepository.findById(quoteid)
                .orElseThrow(() -> new RuntimeException("Devis non trouvé"));
        if(!"en_attente".equals(quote.getStatus())){
            throw  new RuntimeException("tu n'a pas rejectee 2 fois");
        }
        quote.setStatus("rejected");
        quoteRepository.save(quote);

        Users user = quote.getUser();

        emailService.sendPlanRejectedEmail(user);
    }

    @Transactional
    public List<validationDTO> getAllQuotes() {
        List<Quote> quotes = quoteRepository.getQuoteByStatus("en_attente");
        List<validationDTO> response = new ArrayList<>();


        for (Quote quote : quotes) {
            Users user = quote.getUser();

            Integer clientId = null;
            String clientName = null;

            if (user != null) {
                clientId = user.getId();
                clientName = user.getName();
            }

            validationDTO dto = validationDTO.builder()
                    .id(quote.getId())
                    .ClientId(clientId)
                    .ClientName(quote.getFirstName() + quote.getLastName())
                    .status(quote.getStatus())
                    .CreateDate(quote.getCreatedAt())
                    .phoneNumber(quote.getPhoneNumber())
                    .DocumentNumber(3)
                    .build();
            System.out.println(dto.toString());
            response.add(dto);
        }
        return response;
    }


    public List<QuoteDTO> getAll() {
        List<Quote> quotes = quoteRepository.findAll();
        return quotes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }



    private QuoteDTO convertToDTO(Quote quote) {
        return QuoteDTO.builder()
                .id(quote.getId())
                .client(quote.getFirstName() + " " + quote.getLastName())
                .date(quote.getCreatedAt())
                .amount(quote.getAnnualPrice() != null ? quote.getAnnualPrice() : 0.0)
                .status(mapStatus(quote.getStatus()))
                .email(quote.getEmail())
                .phoneNumber(quote.getPhoneNumber())
                .coverageOption(quote.getCoverageOption())
                .startDate(quote.getStartDate())
                .build();
    }

    private String mapStatus(String status) {
        if (status == null) return "en_attente";

        switch (status.toLowerCase()) {
            case "validated":
            case "accepté":
            case "accepted":
                return "accepté";
            case "rejected":
            case "refusé":
            case "refused":
                return "refusé";
            case "pending":
            case "en_attente":
            default:
                return "en_attente";
        }
    }



    public ValidationDetaillsDTO getValidationDetails(Integer id) {
        Quote quote = quoteRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        return mapToValidationDetailsDTO(quote);
    }

    public ValidationDetaillsDTO mapToValidationDetailsDTO(Quote quote) {

        return ValidationDetaillsDTO.builder()
                .firstName(quote.getFirstName())
                .lastName(quote.getLastName())
                .email(quote.getEmail())
                .phoneNumber(quote.getPhoneNumber())
                .birthDate(quote.getBirthDate())
                .postalCode(quote.getPostalCode())
                .profession(quote.getProfession())
                .quoteId(quote.getId())
                .status(quote.getStatus())
                .coverageOption(quote.getCoverageOption())
                .startDate(quote.getStartDate())
                .createdAt(quote.getCreatedAt())
                .setDocuments(quote.getDocuments().stream()
                        .map(doc -> ValidationDetaillsDTO.DocumentInfo.builder()
                                .fileName(doc.getFileName())
                                .uploadDate(doc.getUploadDate())
                                .fileNameServer(doc.getFileNewName())
                                .validated(doc.isValidated())
                                .build())
                        .toList())
                .build();
    }

    public List<QuoteDTO> getAllQuotesForClient(Authentication authentication) throws IllegalAccessException {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalAccessException("User not authenticated");
        }
        Optional<Users> user = userRepository.findByEmail(authentication.getName());

       List<Quote> quotes = quoteRepository.findAllByUser_Id(user.get().getId());

        return quotes.stream()
                .map(q -> QuoteDTO.builder()
                        .date(q.getStartDate())
                        .type(q.getOffreName())
                        .amount(q.getPrice())
                        .requiresFileUpload(true)
                        .pdfLink("google.com")
                        .subscriptionLink(q.getStripeURL())
                        .id(q.getId())
                        .status(q.getStatus())
                .build()
        ).toList();
    }

    @Transactional
    public void deleteQuoteById(Long quoteId) {
        if (!quoteRepository.existsById(quoteId)) {
            throw new EntityNotFoundException("Aucune quote trouvée avec l’id " + quoteId);
        }
        quoteRepository.deleteById(quoteId);
    }


    public InsuranceOffersResponse simulerDevis(QuoteRequest request) {
        final boolean isFamily = hasFamily(request);
        final int userAge = calculateAge(request.getBirthDate());
        final double guaranteesCost = calculateGuaranteesCost(request);
        final FamilyTariffs familyTariffs = calculateFamilyTariffs(request, isFamily);
        final InsuranceOffersResponse.CoverageDetail coverage = createCoverageDetail(request);

        List<Offre> offres = offreRepository.findAll();
        List<InsuranceOffersResponse.InsuranceOffer> result = offres.parallelStream()
                .map(offre -> createInsuranceOffer(offre, request, userAge, guaranteesCost, familyTariffs, coverage))
                .collect(Collectors.toList());

        return new InsuranceOffersResponse(result);
    }

    private boolean hasFamily(QuoteRequest request) {
        return request.getSpouseBirthDate() != null ||
                (request.getChildrenInfo() != null && !request.getChildrenInfo().isEmpty());
    }

    private InsuranceOffersResponse.InsuranceOffer createInsuranceOffer(
            Offre offre, QuoteRequest request, int userAge, double guaranteesCost,
            FamilyTariffs familyTariffs, InsuranceOffersResponse.CoverageDetail coverage) {

        UserProfile profile = determineUserProfile(userAge, request.getProfession());

        double totalTariff = calculateBaseTariff(userAge, request.getProfession(), offre)
                + guaranteesCost
                + familyTariffs.getTotalCost();

        String profileBasedName = generateProfileBasedOfferName(offre.getNom(), profile);

        return new InsuranceOffersResponse.InsuranceOffer(
                offre.getId().toString(),
                profileBasedName,
                offre.getAssureur(),
                totalTariff,
                coverage,
                generateOfferFeatures(offre, profile)
        );
    }

    private String generateProfileBasedOfferName(String baseName, UserProfile profile) {
        return switch (profile) {
            case YOUNG_ADULT -> baseName + " - Jeune Actif";
            case ADULT -> baseName + " - Adulte Actif";
            case SENIOR -> baseName + " - Senior";
            case INVALID -> baseName + " - Standard";
        };
    }

    private FamilyTariffs calculateFamilyTariffs(QuoteRequest request, boolean isFamily) {
        if (!isFamily) {
            return new FamilyTariffs(0.0, 0.0);
        }

        double spouseCost = calculateSpouseCost(request);
        double childrenCost = calculateChildrenCost(request);

        return new FamilyTariffs(spouseCost, childrenCost);
    }

    private double calculateSpouseCost(QuoteRequest request) {
        if (request.getSpouseBirthDate() == null) {
            return 0.0;
        }
        int spouseAge = calculateAge(request.getSpouseBirthDate());
        return getAgeBasedTariff(spouseAge);
    }

    private double calculateChildrenCost(QuoteRequest request) {
        if (request.getChildrenInfo() == null || request.getChildrenInfo().isEmpty()) {
            return 0.0;
        }

        return IntStream.range(0, request.getChildrenInfo().size())
                .mapToDouble(i -> {
                    ChildInfo child = request.getChildrenInfo().get(i);
                    int childAge = calculateAge(child.getBirthDate());
                    double childTariff = getAgeBasedTariff(childAge);

                    return i >= 2 ? childTariff * FAMILY_THIRD_CHILD_DISCOUNT : childTariff;
                })
                .sum();
    }

    private double calculateBaseTariff(int age, String profession, Offre offre) {
        UserProfile profile = determineUserProfile(age, profession);

        return switch (profile) {
            case SENIOR -> offre.getTarifSenior();
            case YOUNG_ADULT -> offre.getTarifJeune();
            case ADULT -> offre.getTarifAdulte();
            case INVALID -> throw new IllegalArgumentException("Invalid profile: age < 18 or invalid status");
        };
    }

    private UserProfile determineUserProfile(int age, String profession) {
        if (age < 18) {
            return UserProfile.INVALID;
        }

        String normalizedProfession = Optional.ofNullable(profession)
                .map(String::toLowerCase)
                .map(String::trim)
                .orElse("");

        if (age >= SENIOR_AGE_THRESHOLD || "retraité".equals(normalizedProfession)) {
            return UserProfile.SENIOR;
        }

        if (age >= 18 && age <= YOUNG_ADULT_MAX_AGE) {
            return UserProfile.YOUNG_ADULT;
        }

        if (age >= ADULT_MIN_AGE && age <= ADULT_MAX_AGE) {
            return UserProfile.ADULT;
        }

        return UserProfile.INVALID;
    }

    private double getAgeBasedTariff(int age) {
        if (age <= CHILD_MAX_AGE) return CHILD_TARIFF;
        if (age <= TEEN_MAX_AGE) return TEEN_TARIFF;
        return ADULT_TARIFF;
    }

    private double calculateGuaranteesCost(QuoteRequest request) {
        return Stream.of(
                        request.getHospitalization(),
                        request.getDental(),
                        request.getOptical(),
                        request.getRegularCare()
                )
                .filter(Objects::nonNull)
                .mapToDouble(coverage -> {
                    try {
                        return computeGuaranteeCost(Double.parseDouble(coverage));
                    } catch (NumberFormatException e) {
                        System.err.println("Invalid coverage percentage: " + coverage);
                        return 0.0;
                    }
                })
                .sum();
    }

    private double computeGuaranteeCost(double percentage) {
        int index = Arrays.binarySearch(COVERAGE_THRESHOLDS, percentage);
        if (index < 0) {
            index = -index - 2;
        }
        return COVERAGE_COSTS[Math.max(0, Math.min(index + 1, COVERAGE_COSTS.length - 1))];
    }

    private InsuranceOffersResponse.CoverageDetail createCoverageDetail(QuoteRequest request) {
        return new InsuranceOffersResponse.CoverageDetail(
                parseDouble(request.getRegularCare()),
                parseDouble(request.getDental()),
                parseDouble(request.getOptical()),
                parseDouble(request.getHospitalization())
        );
    }

    private double parseDouble(String value) {
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            System.err.println("Invalid number format: " + value);
            return 0.0;
        }
    }

    private List<String> generateOfferFeatures(Offre offre, UserProfile profile) {
        List<String> features = new ArrayList<>();

        switch (profile) {
            case YOUNG_ADULT -> {
                features.add("Tarif jeune avantageux");
                features.add("Formule adaptée aux 18-30 ans");
                if (offre.getTarifJeune() < 50) {
                    features.add("Prix très attractif");
                }
            }
            case ADULT -> {
                features.add("Couverture complète adulte");
                features.add("Formule équilibrée 31-59 ans");
                if (offre.getTarifAdulte() < 70) {
                    features.add("Tarif compétitif");
                }
            }
            case SENIOR -> {
                features.add("Protection senior renforcée");
                features.add("Formule 60 ans et plus");
                if (offre.getTarifSenior() < 80) {
                    features.add("Tarif préférentiel senior");
                }
            }
            case INVALID -> {
                features.add("Offre standard");
            }
        }

        features.addAll(List.of("Tiers payant inclus", "Gestion en ligne"));

        return features;
    }

    private int calculateAge(LocalDate birthDate) {
        return Period.between(birthDate, LocalDate.now()).getYears();
    }

    public void changeDate(long quoteid,LocalDate date) {
        Optional<Quote> quote = quoteRepository.findById(quoteid);

        if(!quote.get().getStatus().equals("en_attente")){
            return;
        }

        quote.get().setStartDate(date);
        quoteRepository.save(quote.get());

    }

    private enum UserProfile {
        SENIOR, YOUNG_ADULT, ADULT, INVALID
    }

    private static class FamilyTariffs {
        private final double spouseCost;
        private final double childrenCost;

        public FamilyTariffs(double spouseCost, double childrenCost) {
            this.spouseCost = spouseCost;
            this.childrenCost = childrenCost;
        }

        public double getTotalCost() {
            return spouseCost + childrenCost;
        }
    }
}
