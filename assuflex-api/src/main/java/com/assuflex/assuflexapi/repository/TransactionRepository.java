package com.assuflex.assuflexapi.repository;

import com.assuflex.assuflexapi.DTO.DashboardStatsDto;
import com.assuflex.assuflexapi.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findBySessionId(String sessionId);

    List<Transaction> findByUserId(Integer userId);

    Transaction findBySubscriptionId(String subscriptionId);

    long countByStatus(Transaction.Status status);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = com.assuflex.assuflexapi.model.Transaction.Status.SUCCEEDED")
    Long getTotalRevenue();

    List<Transaction> findTop5ByOrderByCreatedAtDesc();
}
