package com.assuflex.assuflexapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String roleName;

    @JsonIgnore
    @OneToMany(mappedBy = "role")
    private List<Users> users;

    public List<Users> getUser() {
        return users;
    }

    public void setUser(List<Users> users) {
        this.users = users;
    }
}
