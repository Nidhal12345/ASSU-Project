package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.PaiementDTO;
import com.assuflex.assuflexapi.DTO.clientPaymentDTO;
import com.assuflex.assuflexapi.model.Transaction;
import com.assuflex.assuflexapi.model.Users;
import com.assuflex.assuflexapi.repository.TransactionRepository;
import com.assuflex.assuflexapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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
                .client(Optional.ofNullable(user.getName()).orElse("Inconnu"))
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
        return clientPaymentDTO.builder()
                .amount(String.valueOf(tx.getAmount()))
                .method("stripe")
                .contractId("contract111")
                .status(mapStatusToFrench(tx.getStatus()))
                .date(tx.getCreatedAt())
                .id(String.valueOf(tx.getId()))
                .build();
    }
}
