package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.model.Transaction;
import com.assuflex.assuflexapi.repository.TransactionRepository;
import com.assuflex.assuflexapi.service.TransactionService;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/stripe/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final TransactionRepository txRepo;

    private final TransactionService txService;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;


    @PostMapping
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload,
                                                    @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);

            if ("checkout.session.completed".equals(event.getType())) {
                EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
                if (dataObjectDeserializer.getObject().isPresent()) {
                    Session session = (Session) dataObjectDeserializer.getObject().get();

                    String userId = session.getMetadata().get("userId");
                    String subscriptionId = session.getSubscription();

                    System.out.println(userId);
                    System.out.println(subscriptionId);

                    txService.saveTransaction(session.getId(),subscriptionId);
                    System.out.println("✅ Transaction saved and contract closed.");
                }
            }else if("invoice.paid".equals(event.getType())){
                System.out.println("hello");
                System.out.println(payload);
            }

            return ResponseEntity.ok("");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("⚠️ Webhook error: " + e.getMessage());
        }
    }

    @GetMapping("/success")
    public ResponseEntity<String> paymentSuccess(@RequestParam("session_id") String sessionId) {
     return ResponseEntity.ok("you are okay hold on");
    }
    @GetMapping("/payment-cancel")
    public ResponseEntity<String> paymentCancel(@RequestParam("session_id") String sessionId) {
        Optional<Transaction> t = txRepo.findBySessionId(sessionId);

        if(t.get().getStatus().equals(Transaction.Status.SUCCEEDED)) {
            return ResponseEntity.ok().body("payment successful");
        }
        t.get().setStatus(Transaction.Status.FAILED);
        t.get().getQuote().setStripeURL(null);
        txRepo.save(t.get());

        return ResponseEntity.ok("OK");
    }

//    @PostMapping("/webhook")
//    public ResponseEntity<String> handleStripeWebhook(
//            @RequestBody String payload,
//            @RequestHeader("Stripe-Signature") String sigHeader
//    ) {
//        Event event;
//        try {
//            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
//        } catch (SignatureVerificationException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
//        }
//
//        if ("checkout.session.completed".equals(event.getType())) {
//
//            Session session = (Session)event.getDataObjectDeserializer().getObject().get();
//            String userId  = session.getMetadata().get("userId");
//            System.out.println(userId);
//
//            txRepo.findBySessionId(session.getId()).ifPresent(tx -> {
//                tx.setStatus(Transaction.Status.SUCCEEDED);
//                tx.setUpdatedAt(LocalDateTime.now());
//                txRepo.save(tx);
//            });
//        }
//        else if ("checkout.session.async_payment_failed".equals(event.getType())) {
//            Session session = (Session) event
//                    .getDataObjectDeserializer()
//                    .getObject().orElseThrow();
//
//            txRepo.findBySessionId(session.getId()).ifPresent(tx -> {
//                tx.setStatus(Transaction.Status.FAILED);
//                tx.setUpdatedAt(LocalDateTime.now());
//                txRepo.save(tx);
//            });
//        }
//
//        return ResponseEntity.ok("");
//    }
}
