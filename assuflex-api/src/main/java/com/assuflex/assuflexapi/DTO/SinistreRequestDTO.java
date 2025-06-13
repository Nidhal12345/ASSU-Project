package com.assuflex.assuflexapi.DTO;

import com.assuflex.assuflexapi.model.Sinistre;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SinistreRequestDTO {
    @NotNull private Sinistre.ClaimType claimType;
    @NotBlank private String contactName;
    @Email   @NotBlank private String contactEmail;
    @Size(min = 8, max = 20) @NotBlank private String contactPhone;
    @NotBlank private String contractNumber;
    @NotBlank private String description;
    @PastOrPresent @NotNull private LocalDate incidentDate;
}
