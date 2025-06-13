package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.model.Transaction;
import com.assuflex.assuflexapi.repository.TransactionRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    private final TransactionRepository txRepo;

    @GetMapping("/success")
    public ResponseEntity<String> paymentSuccess(@RequestParam("session_id") String sessionId) {
        System.out.println("Session ID reçu = " + sessionId);
        Optional<Transaction> t = txRepo.findBySessionId(sessionId);
        if(t.get().getStatus().equals(Transaction.Status.SUCCEEDED)) {
            return ResponseEntity.ok().body("Webhook successful");
        }
        t.get().setStatus(Transaction.Status.SUCCEEDED);
        t.get().getQuote().setStripeURL(null);
        txRepo.save(t.get());

        return ResponseEntity.ok("OK");
    }

    @GetMapping("/payment-cancel")
    public ResponseEntity<String> paymentCancel(@RequestParam("session_id") String sessionId) {
        System.out.println("Session ID reçu = " + sessionId);
        Optional<Transaction> t = txRepo.findBySessionId(sessionId);
        if(t.get().getStatus().equals(Transaction.Status.SUCCEEDED)) {
            return ResponseEntity.ok().body("Webhook successful");
        }
        t.get().setStatus(Transaction.Status.SUCCEEDED);
        t.get().getQuote().setStripeURL(null);
        txRepo.save(t.get());

        return ResponseEntity.ok("OK");
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        if ("checkout.session.completed".equals(event.getType())) {

            Session session = (Session)event.getDataObjectDeserializer().getObject().get();
            String userId  = session.getMetadata().get("userId");
            System.out.println(userId);

            txRepo.findBySessionId(session.getId()).ifPresent(tx -> {
                tx.setStatus(Transaction.Status.SUCCEEDED);
                tx.setUpdatedAt(LocalDateTime.now());
                txRepo.save(tx);
            });
        }
        else if ("checkout.session.async_payment_failed".equals(event.getType())) {
            Session session = (Session) event
                    .getDataObjectDeserializer()
                    .getObject().orElseThrow();

            txRepo.findBySessionId(session.getId()).ifPresent(tx -> {
                tx.setStatus(Transaction.Status.FAILED);
                tx.setUpdatedAt(LocalDateTime.now());
                txRepo.save(tx);
            });
        }

        return ResponseEntity.ok("");
    }
}
