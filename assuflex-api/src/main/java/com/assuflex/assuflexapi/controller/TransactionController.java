package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.DTO.PaiementDTO;
import com.assuflex.assuflexapi.DTO.clientPaymentDTO;
import com.assuflex.assuflexapi.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/v1/transactions")
@RestController
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<PaiementDTO>> getAllPayments() {
        List<PaiementDTO> paiements = transactionService.getAllPayments();
        return ResponseEntity.ok(paiements);
    }

    @GetMapping("/me")
    public ResponseEntity<List<clientPaymentDTO>> getMyPayments(Authentication authentication) {
        List<clientPaymentDTO> paiements = transactionService.getPaymentsForCurrentUser(authentication);
        return ResponseEntity.ok(paiements);
    }


}
