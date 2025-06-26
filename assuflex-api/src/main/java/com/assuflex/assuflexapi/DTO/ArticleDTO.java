package com.assuflex.assuflexapi.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleDTO {

    private Long id;

    @NotBlank(message = "La catégorie est obligatoire")
    private String categorie;

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @NotBlank(message = "Le contenu est obligatoire")
    private String contenu;

    private String status;

    private LocalDateTime datePublication;
}
