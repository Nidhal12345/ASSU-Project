package com.assuflex.assuflexapi.utils;
import com.assuflex.assuflexapi.service.RoleService;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class RoleInitializer {

    private final RoleService roleService;

    @PostConstruct
    public void initRoles() {
        roleService.createRoleIfNotExists("ROLE_CLIENT");
        roleService.createRoleIfNotExists("ROLE_GESTIONNAIRE");
        roleService.createRoleIfNotExists("ROLE_ADMIN");

    }
}
