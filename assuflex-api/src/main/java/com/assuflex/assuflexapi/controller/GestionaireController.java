package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.DTO.ValidationDetaillsDTO;
import com.assuflex.assuflexapi.DTO.validationDTO;
import com.assuflex.assuflexapi.model.Quote;
import com.assuflex.assuflexapi.repository.QuoteRepository;
import com.assuflex.assuflexapi.service.QuoteService;
import com.stripe.exception.StripeException;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
public class GestionaireController {

    private final QuoteService quoteService;

    private final QuoteRepository quoteRepository;

    @PutMapping("/demande/{quoteid}/valider")
    public ResponseEntity<Boolean> accept (@PathVariable long quoteid
                        ) throws MessagingException, StripeException {
        quoteService.acceptQuote(quoteid);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(true);
    }

    @PutMapping("/demande/{quoteid}/reject")
    public ResponseEntity<Boolean> reject(@PathVariable Long quoteid) throws MessagingException {
        quoteService.rejectQuote(quoteid);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(true);
    }

    @GetMapping()
    public ResponseEntity<List<validationDTO>> getAllQuotes() {
        return ResponseEntity.ok(quoteService.getAllQuotes());
    }

    @GetMapping("/demande/{id}")
    public ResponseEntity<ValidationDetaillsDTO> getValidationDetails(@PathVariable Integer id) {
        Quote quote = quoteRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Quote not found"));
        ValidationDetaillsDTO dto = quoteService.mapToValidationDetailsDTO(quote);

        return ResponseEntity.ok(dto);
    }
}