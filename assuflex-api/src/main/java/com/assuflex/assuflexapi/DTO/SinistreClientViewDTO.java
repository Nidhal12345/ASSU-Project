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
public class SinistreClientViewDTO {
    private Long id;
    private LocalDate incidentDate;
    private Sinistre.ClaimType claimType;
    private String contractNumber;
    private Sinistre.ClaimStatus status;
    private LocalDateTime createdAt;
}

