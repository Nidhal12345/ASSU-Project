package com.assuflex.assuflexapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "sinistre")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sinistre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ClaimType claimType;

    /* Coordonnées du déclarant */
    @Column(nullable = false, length = 150)  private String contactName;
    @Column(nullable = false, length = 150)  private String contactEmail;
    @Column(nullable = false, length = 20)   private String contactPhone;

    /* Contrat concerné */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    /* Description longue */
    @Lob @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate incidentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ClaimStatus status = ClaimStatus.SUBMITTED;

    /* Audit */
    @Column(nullable = false) private LocalDateTime createdAt;
    @Column(nullable = false) private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = updatedAt = LocalDateTime.now();
        if (status == null) status = ClaimStatus.SUBMITTED;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }


    @Getter
    public enum ClaimType {
        DENTAIRE,
        OPTIQUE,
        HOSPITALISATION,
        SOINS,
        PHARMACIE
    }

    @Getter
    public enum ClaimStatus {
        SUBMITTED,
        IN_PROGRESS,
        RESOLVED,
        REJECTED
    }
}