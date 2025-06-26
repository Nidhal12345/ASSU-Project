package com.assuflex.assuflexapi.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String Nom;

    @Column(nullable = false, unique = true)
    private String sessionId;

    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false, length = 3)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private String subscriptionId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum Status { PENDING, SUCCEEDED, FAILED }

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "quote_id")
    private Quote quote;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
