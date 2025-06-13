package com.assuflex.assuflexapi.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContractResponse {

    private String id;

    private String type;

    private String startDate;

    private String endDate;

    private String status;

    private  boolean clotureRequested;

    private String price;

    private String coverage;

    private String documents;

    private String clientName;
}
