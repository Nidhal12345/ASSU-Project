package com.assuflex.assuflexapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "quote")
public class Quote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String civility;

    private String firstName;

    private String lastName;

    private LocalDate birthDate;

    private String profession;

    private String regime;

    private String postalCode;

    private String phoneNumber;

    private String email;

    private String coverageOption;

    private LocalDate startDate;

    private String regularCare;

    private String hospitalization;

    private String dental;

    private Double price;

    private String optical;

    private String offreName;

    private Double annualPrice;

    private String status;

    private String spouseFirstName;

    private String spouseLastName;

    private LocalDate spouseBirthDate;

    @Column(length = 1024)
    private String stripeURL;

    @OneToMany(mappedBy = "quote", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Document> documents;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Child> children;

    @OneToOne(mappedBy = "quote")
    private Contract contract;

    @ManyToOne
    private Users user;

    @ManyToOne
    private Offre offre;

    @CreatedDate
    private LocalDate createdAt;
}
