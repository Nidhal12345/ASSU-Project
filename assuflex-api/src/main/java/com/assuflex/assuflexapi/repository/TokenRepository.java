package com.assuflex.assuflexapi.repository;

import com.assuflex.assuflexapi.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token,Long> {

    Optional<Token> findByToken(String token);
}

