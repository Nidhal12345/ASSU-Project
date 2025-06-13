package com.assuflex.assuflexapi.DTO;

import com.assuflex.assuflexapi.model.*;
import lombok.*;
import java.time.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SinistreResponseDTO {
    private Long id;
    private Sinistre.ClaimType claimType;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private String contractNumber;
    private String description;
    private LocalDate incidentDate;
    private Sinistre.ClaimStatus status;
    private LocalDateTime createdAt;
}
