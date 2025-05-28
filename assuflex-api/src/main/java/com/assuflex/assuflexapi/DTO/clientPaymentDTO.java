package com.assuflex.assuflexapi.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class clientPaymentDTO {
    private String id;

    private LocalDateTime date;

    private String amount;

    private String status;

    private String method;

    private String contractId;
}
