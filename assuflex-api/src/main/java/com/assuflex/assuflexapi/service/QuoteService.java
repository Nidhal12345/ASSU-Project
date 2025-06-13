package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.*;
import com.assuflex.assuflexapi.model.*;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
@Slf4j
public class QuoteService {

    private final StripeService stripeService;

    private final FileStorageService fileStorageService;

    private final QuoteRepository quoteRepository;

    private final TransactionRepository txRepo;

    private final UserRepository userRepository;

    private final EmailService emailService;

    public List<Quote> getQuotes(Integer id) {
        if(id == null) {
            return null;
        }
       Optional<Users> user = userRepository.findById(id);
       return quoteRepository.getQuoteByUser(user.get());
    }

    @Transactional
    public Integer createQuote(Integer userId, @Valid QuoteRequest dto, MultipartFile[] files) {
        Users user = findUser(userId);
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

    private void updateUserDetails(Users user, QuoteRequest dto) {
        if (!isValidPostalCode(dto.getPostalCode())) {
            throw new IllegalArgumentException("Invalid postal code: " + dto.getPostalCode());
        }
        user.setPostalCode(dto.getPostalCode());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setBirthDate(dto.getBirthDate());
        user.setPhoneNumber(dto.getPhoneNumber());
    }

    private Quote buildQuote(QuoteRequest dto, Users user) {
        int childrenCount = Optional.ofNullable(dto.getChildrenInfo())
                .map(List::size)
                .orElse(0);
        return Quote.builder()
                .coverageOption(dto.getCoverageOption())
                .status("en_attente")
                .startDate(dto.getStartDate())
                .regularCare(dto.getRegularCare())
                .hospitalization(dto.getHospitalization())
                .dental(dto.getDental())
                .optical(dto.getOptical())
                .civility(dto.getCivility())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .birthDate(dto.getBirthDate())
                .profession(dto.getProfession())
                .regime(dto.getRegime())
                .postalCode(dto.getPostalCode())
                .phoneNumber(dto.getPhoneNumber())
                .email(dto.getEmail())
                .spouseFirstName(dto.getSpouseFirstName())
                .spouseLastName(dto.getSpouseLastName())
                .spouseBirthDate(dto.getSpouseBirthDate())
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

            Offre offre = quote.getOffre();

            productRequest productRequest = com.assuflex.assuflexapi.DTO.productRequest.builder()
                    .name("Contrat santé - ")
                    .amount(5000L)
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
                .createdAt(LocalDateTime.now())
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
                    .ClientName(clientName)
                    .status(quote.getStatus())
                    .CreateDate(quote.getCreatedAt())
                    .phoneNumber(quote.getPhoneNumber())
                    .DocumentNumber(3)
                    .build();

            response.add(dto);
        }
        return response;
    }

    public ValidationDetaillsDTO mapToValidationDetailsDTO(Quote quote) {
        Users user = quote.getUser();
        System.out.println(user.getId());
        return ValidationDetaillsDTO.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .birthDate(user.getBirthDate())
                .postalCode(user.getPostalCode())
                .profession(user.getProfession())
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
                        .type("Optional")
                        .amount(444.0)
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

}
