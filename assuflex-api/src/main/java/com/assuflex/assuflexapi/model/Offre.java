package com.assuflex.assuflexapi.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "offre")
public class Offre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String assureur;

    private double tarifJeune;

    private double tarifAdulte; 

    private double tarifSenior;

    private double tarifFamille;
}

