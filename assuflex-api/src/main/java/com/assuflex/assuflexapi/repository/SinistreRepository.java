package com.assuflex.assuflexapi.repository;

import com.assuflex.assuflexapi.model.Sinistre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SinistreRepository extends JpaRepository<Sinistre, Long> {

    List<Sinistre> findByContract_Client_Id(Long clientId);
}
