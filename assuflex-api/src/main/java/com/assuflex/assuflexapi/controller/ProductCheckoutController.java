package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.model.Transaction;
import com.assuflex.assuflexapi.model.Users;
import com.assuflex.assuflexapi.DTO.StripeResponce;
import com.assuflex.assuflexapi.DTO.productRequest;
import com.assuflex.assuflexapi.repository.TransactionRepository;
import com.assuflex.assuflexapi.repository.UserRepository;
import com.assuflex.assuflexapi.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class ProductCheckoutController {
    private final StripeService stripeService;
    private final UserRepository userRepo;
    private final TransactionRepository txRepo;

    @PostMapping("/checkout")
    public ResponseEntity<StripeResponce> checkout(
            @RequestBody productRequest preq,
            @RequestParam Integer QuoteId,
            Authentication authentication
    ) throws StripeException {

        Users user = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Session session = stripeService.createSession(preq);

        Transaction tx = Transaction.builder()
                .user(user)
                .Nom("test")
                .sessionId(session.getId())
                .amount(preq.getAmount())
                .currency(preq.getCurrency())
                .status(Transaction.Status.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        txRepo.save(tx);

        StripeResponce resp = StripeResponce.builder()
                .status("pending")
                .message("checkout session created")
                .sessionId(session.getId())
                .sessionUrl(session.getUrl())
                .build();

        return ResponseEntity.ok(resp);
    }
}
