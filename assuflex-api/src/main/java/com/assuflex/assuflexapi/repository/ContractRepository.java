package com.assuflex.assuflexapi.repository;

import com.assuflex.assuflexapi.model.Contract;
import com.assuflex.assuflexapi.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Integer> {

    boolean getContractsByClient(Users client);

    List<Contract> findByClient(Users client);

    boolean existsByClient(Users client);

    long countByStatut(Contract.StatutContrat statut);

    Optional<Contract> findByContractNumber(String contractNumber);

    @Query("SELECT c FROM Contract c WHERE c.client.id = :userId OR c.OriginalClientId = :userId")
    List<Contract> findByUserIdOrOriginalClientId(@Param("userId") Integer userId);

}
