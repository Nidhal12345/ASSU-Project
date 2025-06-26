package com.assuflex.assuflexapi.DTO;

import lombok.Builder;
import lombok.Data;

@Data
public class DevisResponse {
    private String assureur;
    private String offreNom;
    private double tarif;
    private String message;
}
