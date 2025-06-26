package com.assuflex.assuflexapi.DTO;

import com.assuflex.assuflexapi.model.Sinistre;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeStatusDTO {
    @NotNull
    private Sinistre.ClaimStatus status;
}
