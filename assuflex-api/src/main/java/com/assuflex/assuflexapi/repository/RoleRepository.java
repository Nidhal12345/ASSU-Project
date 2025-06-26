package com.assuflex.assuflexapi.repository;

import com.assuflex.assuflexapi.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByRoleName(String role);
}
