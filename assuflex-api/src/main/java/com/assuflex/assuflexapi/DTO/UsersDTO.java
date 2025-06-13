package com.assuflex.assuflexapi.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
public class UsersDTO {
    private int id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private LocalDate dateInscription;
    private Integer contrats;
}
