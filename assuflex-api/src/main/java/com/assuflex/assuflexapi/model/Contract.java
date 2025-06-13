package com.assuflex.assuflexapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contract")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String contractNumber;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    private String subscriptionId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToOne
    @JoinColumn(name = "client_id", unique = true)
    private Users client;

    @OneToOne
    @JoinColumn(name = "quote_id", unique = true)
    private Quote quote;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "document_id", unique = true)
    private Document document;

    @Enumerated(EnumType.STRING)
    private StatutContrat statut;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    private boolean clotureRequested;

    private LocalDate clotureRequestedAt;

    private LocalDate clotureApprovedAt;

    @PreUpdate
    public void preUpdate() {
        clotureRequested = false;
        updatedAt = LocalDateTime.now();
    }

    public enum StatutContrat {
        EN_COURS,
        CLOTURE
    }
}
