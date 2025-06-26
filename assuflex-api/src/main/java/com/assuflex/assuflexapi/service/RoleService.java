package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.SignupRequest;
import com.assuflex.assuflexapi.model.Role;
import com.assuflex.assuflexapi.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    private final AuthService authService;

    public void createRoleIfNotExists(String roleName) {
        Role role = roleRepository.findByRoleName(roleName);
        if (role != null) {
            return;
        }
        Role newRole = new Role();
        newRole.setRoleName(roleName);

        roleRepository.save(newRole);
    }
}
