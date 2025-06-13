package com.assuflex.assuflexapi.repository;

import com.assuflex.assuflexapi.model.Role;
import com.assuflex.assuflexapi.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
    public Optional<Users> findByEmail(String userEmail);

    boolean existsByEmail(String email);

    List<Users> findAllByRole(Role role);

    List<Users> findAllByRole_Id(Integer roleId);
}
