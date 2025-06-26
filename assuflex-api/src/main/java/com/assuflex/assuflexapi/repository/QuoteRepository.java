package com.assuflex.assuflexapi.repository;

import com.assuflex.assuflexapi.DTO.DashboardStatsDto;
import com.assuflex.assuflexapi.model.Quote;
import com.assuflex.assuflexapi.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, Long> {
    boolean existsByUserId(Integer userId);
    List<Quote> getQuoteByUser(Users user);

    List<Quote> findAllByStatusIsNot(String status);
    List<Quote> getQuoteByStatus(String status);

    long count();
    @Query("SELECT COUNT(DISTINCT q.user.id) FROM Quote q")
    long countDistinctUsers();

    @Query("SELECT FUNCTION('TO_CHAR', q.createdAt, 'Mon'), COUNT(q) " +
            "FROM Quote q " +
            "GROUP BY FUNCTION('TO_CHAR', q.createdAt, 'Mon'), EXTRACT(MONTH FROM q.createdAt) " +
            "ORDER BY EXTRACT(MONTH FROM q.createdAt)")
    List<Object[]> countQuotesPerMonth();

    List<Quote> findAllByUser_Id(Integer userId);

    List<Quote> findTop5ByOrderByCreatedAtDesc();
}
