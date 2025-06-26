package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.model.Transaction;
import com.assuflex.assuflexapi.repository.TransactionRepository;
import com.assuflex.assuflexapi.service.TransactionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.Invoice;
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

                    txService.saveTransaction(session.getId(), subscriptionId);
                    System.out.println("✅ Transaction saved and contract closed.");
                }
            } else if ("invoice.paid".equals(event.getType())) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(payload);

                String type = root.path("type").asText();

                JsonNode invoice = root.path("data").path("object");

                JsonNode lines = invoice.path("lines").path("data");
                if (lines.isArray() && !lines.isEmpty()) {
                    JsonNode line = lines.get(0);

                    JsonNode subscriptionNode = line.path("parent")
                            .path("subscription_item_details")
                            .path("subscription");

                    String subscriptionId = subscriptionNode.asText();
                    String customerId = invoice.path("customer").asText();
                    String hostedInvoiceUrl = invoice.path("hosted_invoice_url").asText();
                    long amountPaid = invoice.path("amount_paid").asLong();

                    System.out.println("Subscription ID: " + subscriptionId);
                    System.out.println("Customer ID: " + customerId);
                    System.out.println("Amount Paid: " + amountPaid);
                    System.out.println(payload);

                    txService.saveTransactionInvoice(subscriptionId,customerId,amountPaid);

                }
            }

            return ResponseEntity.ok("");
        } catch (JsonProcessingException | SignatureVerificationException e) {
            throw new RuntimeException(e);
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
