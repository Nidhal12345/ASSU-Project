package com.assuflex.assuflexapi.repository;

import com.assuflex.assuflexapi.model.Contract;
import com.assuflex.assuflexapi.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Integer> {

    boolean getContractsByClient(Users client);

    List<Contract> findByClient(Users client);

    boolean existsByClient(Users client);

    Optional<Contract> findByContractNumber(String contractNumber);
}
