package com.assuflex.assuflexapi.controller;
import com.assuflex.assuflexapi.DTO.*;
import com.assuflex.assuflexapi.repository.QuoteRepository;
import com.assuflex.assuflexapi.service.QuoteService;
import com.assuflex.assuflexapi.repository.UserRepository;
import com.assuflex.assuflexapi.model.Users;
import com.assuflex.assuflexapi.utils.EmailService;
import com.assuflex.assuflexapi.utils.PdfGenerationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.StripeException;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RequestMapping("/api/v1/quotes")
@RestController
public class QuoteController {

    private final ObjectMapper objectMapper;

    private final EmailService emailService;

    private final PdfGenerationService pdfGenerationService;

    private final UserRepository userRepository;

    private final QuoteRepository quoteRepository;

    private final QuoteService quoteService;


    @PutMapping("/demande/{quoteid}/valider")
    public ResponseEntity<Boolean> accept (@PathVariable long quoteid) throws MessagingException, StripeException {
        quoteService.acceptQuote(quoteid);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(true);
    }

    @PutMapping("/demande/{quoteid}/reject")
    public ResponseEntity<Boolean> reject(@PathVariable Long quoteid) throws MessagingException {
        quoteService.rejectQuote(quoteid);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(true);
    }

    @GetMapping("/validation")
    public ResponseEntity<List<validationDTO>> getValidationsQuotes() {
        return ResponseEntity.ok(quoteService.getAllQuotes());
    }

    @GetMapping()
    public ResponseEntity<List<QuoteDTO>> getAllQuotes() {
        return ResponseEntity.ok(quoteService.getAll());
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateAndSendDevis(@RequestBody devisDTO devisDTO) {
        try {
            System.out.println(devisDTO.toString());
            byte[] pdfBytes = pdfGenerationService.generatePdfFromHtml("devis-template",devisDTO);
            emailService.sendEmailWithAttachment(devisDTO.getEmail(), "Your Devis", "Please find your devis attached.", pdfBytes, "devis.pdf");
            return ResponseEntity.ok("Devis sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending devis: " + e.getMessage());
        }
    }

    @PostMapping("/simuler")
    public ResponseEntity<InsuranceOffersResponse> simuler(@RequestBody QuoteRequest request) throws MessagingException {
        emailService.sendQuoteToTeamHtml(request);
        InsuranceOffersResponse simulation = quoteService.simulerDevis(request);
        return ResponseEntity.ok(simulation);
    }

    @GetMapping("/client")
    public ResponseEntity<List<QuoteDTO>> getAllQuotesForClient(Authentication authentication) throws IllegalAccessException {
        return ResponseEntity.ok(quoteService.getAllQuotesForClient(authentication));
    }

    @GetMapping("/demande/{id}")
    public ValidationDetaillsDTO getValidationDetails(@PathVariable Integer id) {
         return quoteService.getValidationDetails(id);
    }


    //todo-badelha te9bel json
    @PostMapping("/demande-devis")
    public Integer saveQuoted(@RequestPart("quote") String quote, Authentication authentication,@RequestPart(value = "files", required = false) MultipartFile[] files) throws JsonProcessingException{
        Optional<Users> users = userRepository.findByEmail(authentication.getName());
        devisDTO quoteDto = objectMapper.readValue(quote, devisDTO.class);
        System.out.println(quoteDto);
        return quoteService.createQuote(users.get().getId(), quoteDto,files);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuote(@PathVariable("id") Long id) {
        quoteService.deleteQuoteById(id);
        return ResponseEntity.noContent().build();
    }
}
