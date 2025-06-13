package com.assuflex.assuflexapi.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuoteDTO {
    private Integer id;
    private LocalDate date;
    private String type;
    private Double amount;
    private String status;
    private String pdfLink;
    private String subscriptionLink;
    private Boolean requiresFileUpload;

    private String client;

    private String email;
    private String phoneNumber;
    private String coverageOption;
    private LocalDate startDate;
}