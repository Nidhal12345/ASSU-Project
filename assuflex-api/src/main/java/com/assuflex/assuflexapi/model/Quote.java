package com.assuflex.assuflexapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "quote")
public class Quote {
    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Integer id;

    private String coverageOption;
    private LocalDate startDate;

    private String regularCare;
    private String hospitalization;
    private String dental;
    private String optical;

    private String status;

    private String civility;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String profession;
    private String regime;
    private String postalCode;
    private String phoneNumber;
    private String email;

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

    @ManyToOne
    private Users user;

    @ManyToOne
    private Offre offre;

    private LocalDate createdAt = LocalDate.now();
}
