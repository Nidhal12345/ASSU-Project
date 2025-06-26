package com.assuflex.assuflexapi.DTO;

import com.assuflex.assuflexapi.model.Sinistre;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SinistreGestViewDTO {
    private Long id;
    private String contractNumber;
    private LocalDate incidentDate;
    private Sinistre.ClaimType claimType;
    private String contactName;
    private String contactEmail;
    private Sinistre.ClaimStatus status;
    private LocalDateTime createdAt;
}
