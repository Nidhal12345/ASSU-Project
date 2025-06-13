package com.assuflex.assuflexapi.repository;

import com.assuflex.assuflexapi.model.Document;
import com.assuflex.assuflexapi.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByQuote(Quote quote);
}
