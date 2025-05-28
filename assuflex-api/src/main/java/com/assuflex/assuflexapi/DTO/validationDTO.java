package com.assuflex.assuflexapi.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class validationDTO {
    private Integer id;
    private String ClientName;
    private Integer ClientId;
    private LocalDate CreateDate;
    private String status;
    private String phoneNumber;
    private Integer  DocumentNumber;
}
