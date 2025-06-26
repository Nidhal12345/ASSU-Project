package com.assuflex.assuflexapi.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ContactFormRequest {
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime callbackDateTime;

    private String email;
    private String fullName;
    private String message;
    private String phoneNumber;
    private boolean rgpd;
    private String subject;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime submittedAt;
}
