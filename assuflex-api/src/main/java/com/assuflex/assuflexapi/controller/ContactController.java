package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.DTO.ContactFormRequest;
import com.assuflex.assuflexapi.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping("/send")
    public ResponseEntity<String> sendContactEmail(@RequestBody ContactFormRequest contactForm) {
        try {
            contactService.sendContactEmail(contactForm);
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }
}