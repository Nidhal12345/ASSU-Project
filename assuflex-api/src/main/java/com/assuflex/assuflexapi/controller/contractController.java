package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.DTO.ContractResponse;
import com.assuflex.assuflexapi.model.Contract;
import com.assuflex.assuflexapi.model.Users;
import com.assuflex.assuflexapi.repository.ContractRepository;
import com.assuflex.assuflexapi.service.ContractService;
import com.stripe.model.Subscription;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/contracts")
public class contractController {

    private final ContractService contractService;

    private final ContractRepository contractRepository;

    @GetMapping("client")
    public ResponseEntity<List<ContractResponse>> getContractsForUser(Authentication authentication) {
        try {
            List<ContractResponse> dtos = contractService.getAllContractsForUser(authentication);
            return ResponseEntity.ok(dtos);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/{contractId}/demande-cloture")
    public ResponseEntity<String> demanderCloture(@PathVariable String contractId,
                                                  @AuthenticationPrincipal Users currentUser) {
        Contract contract = contractRepository.findByContractNumber(contractId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrat introuvable"));

        if (!contract.getClient().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès refusé.");
        }

        if (contract.getStatut() == Contract.StatutContrat.CLOTURE) {
            return ResponseEntity.badRequest().body("Le contrat est déjà clôturé.");
        }

        if (contract.isClotureRequested()) {
            return ResponseEntity.badRequest().body("Une demande de clôture est déjà en cours.");
        }

        contract.setClotureRequested(true);
        contract.setClotureRequestedAt(LocalDate.now());
        contractRepository.save(contract);

        return ResponseEntity.ok("Demande de clôture envoyée avec succès.");
    }

    @PostMapping("/{contractId}/valider-cloture")
    public ResponseEntity<String> validerCloture(@PathVariable String contractId) {
        Contract contract = contractRepository.findByContractNumber(contractId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrat introuvable"));

        if (!contract.isClotureRequested()) {
            return ResponseEntity.badRequest().body("Aucune demande de clôture en attente.");
        }

        try {
            if (contract.getSubscriptionId() != null) {
                Subscription subscription = Subscription.retrieve(contract.getSubscriptionId());
                subscription.cancel();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur Stripe : " + e.getMessage());
        }

        contract.setStatut(Contract.StatutContrat.CLOTURE);
        contract.setEndDate(LocalDate.now().plusMonths(1));
        contract.setClotureApprovedAt(LocalDate.now());
        contract.setClotureRequested(false); // Réinitialise
        contractRepository.save(contract);

        return ResponseEntity.ok("Contrat clôturé avec succès.");
    }


    @PostMapping("/{contractId}/rejeter-cloture")
    public ResponseEntity<String> rejeterCloture(@PathVariable String contractId) {
        Contract contract = contractRepository.findByContractNumber(contractId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrat introuvable"));

        if (!contract.isClotureRequested()) {
            return ResponseEntity.badRequest().body("Aucune demande de clôture à rejeter.");
        }

        contract.setClotureRequested(false);
        contract.setClotureRequestedAt(null);
        contractRepository.save(contract);

        return ResponseEntity.ok("Demande de clôture rejetée.");
    }

    @GetMapping
    public ResponseEntity<List<ContractResponse>> getContracts() {
            List<ContractResponse> dtos = contractService.getAllContracts();
            return ResponseEntity.ok(dtos);
    }

}
