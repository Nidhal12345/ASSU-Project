package com.assuflex.assuflexapi.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class productRequest {
    private Long amount;
    private String currency;
    private String name;
    private Long quantity;
    private Long QuoteId;
    private Integer offreId;
}
