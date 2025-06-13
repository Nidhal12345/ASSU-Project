package com.assuflex.assuflexapi.repository;

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

    List<Quote> findAllByUser_Id(Integer userId);
}
