package com.assuflex.assuflexapi.repository;

import com.assuflex.assuflexapi.model.Offre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OffreRepository extends JpaRepository<Offre, Long> {
    List<Offre> findByAssureur(String assureur);

    boolean existsOffreById(Long id);
}
