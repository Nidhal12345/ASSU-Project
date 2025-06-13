package com.assuflex.assuflexapi.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.security.Principal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class Users implements UserDetails, Principal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false, unique = true)
    private String email;
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String phoneNumber;
    private String postalCode;
    private LocalDate birthDate;
    private String profession;

    //--todo zidhom fi final version nullable = false, updatable = false
    @CreatedDate
    @Column(name = "created_date")
    private LocalDate createdDate;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Token restToken;

//    @Column(nullable = false)
//    private String statut; // exemple : actif, inactif, suspendu


    @LastModifiedDate
    @Column(name = "modified_date")
    private LocalDate modifiedDate;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE,
            orphanRemoval = true)
    private List<Quote> quotes = new ArrayList<>();

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    private List<Transaction> transactions = new ArrayList<>();

    @OneToOne(mappedBy = "client",
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    private Contract contract;

    @Override
    public String getName() {
        return this.username;
    }
    @Override
    public String getUsername() {
        return this.email;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.getRoleName()));
    }

    public String getFullName() {
        return username;
    }
}