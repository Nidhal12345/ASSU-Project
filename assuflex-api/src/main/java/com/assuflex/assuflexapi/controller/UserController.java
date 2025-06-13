package com.assuflex.assuflexapi.controller;


import com.assuflex.assuflexapi.DTO.AdminUserDTO;
import com.assuflex.assuflexapi.DTO.ChangePasswordRequest;
import com.assuflex.assuflexapi.DTO.ClientProfileDTO;
import com.assuflex.assuflexapi.DTO.UserUpdateDataDTO;
import com.assuflex.assuflexapi.model.Users;
import com.assuflex.assuflexapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id, Authentication auth) {
        userService.deleteUser(id,auth);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserDTO> getUserById(@PathVariable Integer id) {
        AdminUserDTO userDTO = userService.getUserById(id);
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<Users> updateUser(
            @PathVariable Integer id,
            @RequestBody UserUpdateDataDTO updateDTO
    ) {
        Users updatedUser = userService.updateUser(id, updateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        userService.changePassword(request, userDetails.getUsername());

        return ResponseEntity.ok(Map.of("message", "Mot de passe mis à jour avec succès"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ClientProfileDTO> getProfile() {
        return ResponseEntity.ok(userService.getClientProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody ClientProfileDTO profileDTO) {
        userService.updateClientProfile(profileDTO);
         return ResponseEntity.status(201).body("Profile updated");
    }

    @GetMapping
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUser());
    }
}
