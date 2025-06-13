package com.assuflex.assuflexapi.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDataDTO {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String role;
    private String statut;
}
