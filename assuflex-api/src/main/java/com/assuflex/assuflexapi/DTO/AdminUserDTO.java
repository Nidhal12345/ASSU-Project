package com.assuflex.assuflexapi.DTO;

import lombok.*;

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
    private String statut;
}