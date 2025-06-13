// com/assuflex/assuflexapi/payment/TransactionRepository.java
package com.assuflex.assuflexapi.repository;

import com.assuflex.assuflexapi.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findBySessionId(String sessionId);

    List<Transaction> findByUserId(Integer userId);
}
