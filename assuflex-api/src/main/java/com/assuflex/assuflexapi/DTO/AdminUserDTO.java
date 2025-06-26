package com.assuflex.assuflexapi.DTO;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserDTO {
    private Integer id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String role;
    private LocalDate creationDate;
    private String statut;
}