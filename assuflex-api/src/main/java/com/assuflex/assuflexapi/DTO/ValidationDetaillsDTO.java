package com.assuflex.assuflexapi.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ValidationDetaillsDTO {
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDate birthDate;
    private String postalCode;
    private String profession;

    // Quote Info
    private Integer quoteId;
    private String status;
    private String coverageOption;
    private LocalDate startDate;
    private LocalDate createdAt;

    // Document Info
    private List<DocumentInfo> setDocuments;

    // Getters and Setters
    @Data
    @Builder
    public static class DocumentInfo {
        private String fileName;
        private LocalDateTime uploadDate;
        private String fileNameServer;
        private boolean validated;
    }
}