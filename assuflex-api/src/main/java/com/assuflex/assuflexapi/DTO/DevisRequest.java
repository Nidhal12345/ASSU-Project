package com.assuflex.assuflexapi.DTO;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class DevisRequest {
    private int age;
    private boolean isTNS;
    private boolean besoinOptique;
    private boolean teleconsultation;
    private boolean hospitalisationSeule;
    private boolean assistanceDomicile;
    private boolean urgence;
}
