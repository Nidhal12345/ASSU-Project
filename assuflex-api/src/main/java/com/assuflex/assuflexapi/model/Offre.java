package com.assuflex.assuflexapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

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
    private Integer id;

    private String assureur;

    private String profil;

    private String nom;

    private Boolean isFamily;

    private Double tarifBase;

    private Double coefSoins;

    private Double coefHospitalisation;

    private Double coefOptique;

    private Double coefDentaire;

    private Double tarifParEnfant;

    private Double tarifConjoint;

    private Boolean disponibleSenior;

    private Boolean disponibleTNS;

    private Boolean publie;

    private Integer remboursementOptique;
    private Integer remboursementDentaire;
    private Integer remboursementHospitalisation;
    private Integer remboursementSoins;

    @ElementCollection(targetClass = RegimeSecuriteSociale.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "offre_regimes", joinColumns = @JoinColumn(name = "offre_id"))
    @Column(name = "regime")
    private Set<RegimeSecuriteSociale> regimesCompatibles;

    @ElementCollection(targetClass = StatutProfessionnel.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "offre_statuts", joinColumns = @JoinColumn(name = "offre_id"))
    @Column(name = "statut")
    private Set<StatutProfessionnel> statutsCompatibles;
    @OneToMany(mappedBy = "offre")
    private List<Quote> quotes;

    public enum ProfilClient {
        JEUNE_ACTIF, ADULTE_ACTIF, SENIOR, FAMILLE
    }

    public enum CategorieOffre {
        TNS, FAMILLE, ETUDIANT, SENIOR, TOUT_PUBLIC
    }

    public enum RegimeSecuriteSociale {
        GENERAL, TNS, MSA, ALSACE_MOSELLE, CSS
    }

    public enum StatutProfessionnel {
        SALARIE, INDEPENDANT, ETUDIANT, RETRAITE, SANS_EMPLOI
    }
}

