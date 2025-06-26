package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.PaiementDTO;
import com.assuflex.assuflexapi.DTO.clientPaymentDTO;
import com.assuflex.assuflexapi.model.Transaction;
import com.assuflex.assuflexapi.model.Users;
import com.assuflex.assuflexapi.repository.TransactionRepository;
import com.assuflex.assuflexapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final UserRepository userRepository;
    private final ContractService contractService;
    private final TransactionRepository transactionRepository;

    public List<PaiementDTO> getAllPayments() {
        return transactionRepository.findAll().stream()
                .map(this::mapToPaiementDTO)
                .toList();
    }

    private PaiementDTO mapToPaiementDTO(Transaction transaction) {
        if (transaction == null) return null;

        Users user = Optional.ofNullable(transaction.getUser()).orElse(new Users());

        return PaiementDTO.builder()
                .id(String.valueOf(transaction.getId()))
                .client(Optional.of(user.getName()+ " " + user.getLastName()).orElse("Inconnu"))
                .clientId(Optional.ofNullable(transaction.getUser().getId()).orElse(0))
                .date(Optional.ofNullable(transaction.getCreatedAt())
                        .map(d -> d.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                        .orElse("N/A"))
                .montant(Optional.ofNullable(transaction.getAmount()).orElse(0L) / 100.0)
                .methode(Optional.of("Carte bancaire").orElse("Carte bancaire"))
                .statut(mapStatusToFrench(transaction.getStatus()))
                .build();
    }

    private String mapStatusToFrench(Transaction.Status status) {
        if (status == null) return "inconnu";

        return switch (status) {
            case PENDING -> "en_attente";
            case SUCCEEDED -> "payé";
            case FAILED -> "échoué";
        };
}

    public List<clientPaymentDTO> getPaymentsForCurrentUser(Authentication authentication) {
        String email = authentication.getName();

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Aucun utilisateur trouvé pour l’email « " + email + " »")
                );

        List<Transaction> transactions = transactionRepository.findByUserId(user.getId());

        return transactions.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private clientPaymentDTO toDto(Transaction tx) {
        double amountInEuros = tx.getAmount() / 100.0;

        return clientPaymentDTO.builder()
                .amount(String.valueOf(amountInEuros))
                .method("STRIPE")
                .contractId(tx.getQuote().getContract().getContractNumber())
                .status(mapStatusToFrench(tx.getStatus()))
                .date(tx.getCreatedAt())
                .id(String.valueOf(tx.getId()))
                .build();
    }

    private String getContractIdSafely(Transaction tx) {
        try {
            if (tx.getUser() != null &&
                    tx.getUser().getContract() != null &&
                    tx.getUser().getContract().getContractNumber() != null) {
                return tx.getUser().getContract().getContractNumber();
            }
        } catch (Exception e) {
        }
        return "pending";
    }

    public ResponseEntity<String> saveTransaction(String sessionId,String subscriptionId) {
        Optional<Transaction> optionalTransaction = transactionRepository.findBySessionId(sessionId);
        System.out.println("optionalTransaction: " + optionalTransaction);

        if (optionalTransaction.isEmpty()) {
            return ResponseEntity.badRequest().body("Transaction not found.");
        }

        Transaction transaction = optionalTransaction.get();

        if (transaction.getStatus() == Transaction.Status.SUCCEEDED) {
            return ResponseEntity.ok("Payment already marked as successful.");
        }

        transaction.setStatus(Transaction.Status.SUCCEEDED);

        transaction.setSubscriptionId(subscriptionId);

        transaction.getQuote().setStripeURL(null);

        transactionRepository.save(transaction);

        contractService.generateContractFromTransaction(transaction,subscriptionId);

        return ResponseEntity.ok("Payment successful. Contract generated.");

    }

    public void saveTransactionInvoice(String subscriptionId, String customerId, long amountPaid) {

        Transaction tx = transactionRepository.findBySubscriptionId(subscriptionId);

        Users userSub = tx.getUser();

        Transaction newTransaction = Transaction.builder()
                .quote(tx.getQuote())
                .Nom(tx.getNom())
                .status(Transaction.Status.SUCCEEDED)
                .currency(tx.getCurrency())
                .amount(tx.getAmount())
                .build();

    }
}
