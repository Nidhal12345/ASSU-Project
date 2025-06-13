package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.ContractDTO;
import com.assuflex.assuflexapi.DTO.ContractResponse;
import com.assuflex.assuflexapi.model.*;
import com.assuflex.assuflexapi.repository.ContractRepository;
import com.assuflex.assuflexapi.repository.UserRepository;
import com.assuflex.assuflexapi.utils.FileStorageService;
import com.assuflex.assuflexapi.utils.PdfGenerationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;

    private final PdfGenerationService pdfGenerationService;

    private final FileStorageService fileStorageService;

    private final UserRepository userRepository;

    @Transactional
    public void generateContractFromTransaction(Transaction transaction, String subscriptionId) {

            Quote quote = transaction.getQuote();

            Users user = transaction.getUser();

        if (contractRepository.existsByClient(user)) {
            throw new RuntimeException("You already have a contract");
        }

            Contract contract = Contract.builder()
                    .contractNumber("CONT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .startDate(LocalDate.now())
                    .quote(quote)
                    .subscriptionId(subscriptionId)
                    .endDate(LocalDate.now().plusYears(1))
                    .statut(Contract.StatutContrat.EN_COURS)
                    .client(user)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

        contractRepository.save(contract);

        ContractDTO contractDTO = ContractDTO.builder()
                    .contractName("ASSUFLEX ASSURANCE SANTE"+" "+quote.getOffreName())
                    .email(user.getEmail())
                    .id(contract.getId())
                    .annualPrice(quote.getAnnualPrice())
                    .birthDate(quote.getBirthDate())
                    .childInfo(quote.getChildren())
                    .civility(quote.getCivility())
                    .price(quote.getPrice())
                    .dental(quote.getDental())
                    .firstName(quote.getFirstName())
                    .lastName(quote.getLastName())
                    .phoneNumber(quote.getPhoneNumber())
                    .regularCare(quote.getRegularCare())
                    .spouseBirthDate(quote.getSpouseBirthDate())
                    .spouseFirstName(quote.getSpouseFirstName())
                    .spouseLastName(quote.getSpouseLastName())
                    .hospitalization(quote.getHospitalization())
                    .endDate(contract.getEndDate())
                    .startDate(contract.getStartDate())
                    .build();

           byte[] pdfContract = pdfGenerationService.generatePdfFromHtml("contract-template",contractDTO);
           Map<String,String> arrayPath = fileStorageService.savePdfFile(pdfContract,contract.getId(),"contract.pdf");

        Document document = Document.builder()
                .fileUrl(arrayPath.get("storedPath"))
                .fileNewName(arrayPath.get("newFileName"))
                .fileName(arrayPath.get("originalFileName"))
                .contract(contract)
                .build();

             contract.setDocument(document);
            contractRepository.save(contract);
    }

    public List<ContractResponse> getAllContractsForUser(Authentication authentication) throws IllegalAccessException {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalAccessException("User not authenticated");
        }
        Users user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Utilisateur introuvable pour l’ID "));

        List<Contract> contracts = contractRepository.findByClient(user);

        return contracts.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ContractResponse mapToDTO(Contract contract) {
        String start = contract.getStartDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
        String end   = (contract.getEndDate() != null)
                ? contract.getEndDate().format(DateTimeFormatter.ISO_LOCAL_DATE)
                : "";

        ContractResponse dto = new ContractResponse();
        dto.setId(contract.getContractNumber());
        dto.setType(contract.getQuote().getOffreName());
        dto.setStartDate(start);
        dto.setEndDate(end);
        dto.setClotureRequested(contract.isClotureRequested());
        dto.setClientName(contract.getClient().getFullName());
        dto.setStatus(contract.getStatut().name());
        dto.setPrice(String.valueOf(contract.getQuote().getPrice()));
        dto.setCoverage(
                "Consultations 250%, Hospitalisation 400%, Dentaire 300%, Optique 200%"
        );
        dto.setDocuments(contract.getId()+"/"+contract.getDocument().getFileNewName());

        return dto;
    }

    public List<ContractResponse> getAllContracts() {
        List<Contract> contracts = contractRepository.findAll();

        return contracts.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
