package com.assuflex.assuflexapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "article")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String categorie;

    @Column(nullable = false, length = 200)
    private String titre;

    @Lob
    @Column(nullable = false)
    private String contenu;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private String status;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
