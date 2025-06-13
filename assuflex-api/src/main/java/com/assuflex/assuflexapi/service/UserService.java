package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.*;
import com.assuflex.assuflexapi.model.Role;
import com.assuflex.assuflexapi.model.Token;
import com.assuflex.assuflexapi.model.Users;
import com.assuflex.assuflexapi.repository.RoleRepository;
import com.assuflex.assuflexapi.repository.TokenRepository;
import com.assuflex.assuflexapi.repository.UserRepository;
import com.assuflex.assuflexapi.utils.EmailService;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public List<UsersDTO> getAllUsers() {
        return userRepository.findAllByRole_Id(1)
                .stream()
                .map(r -> UsersDTO.builder()
                        .id(r.getId())
                        .email(r.getEmail())
                        .nom(r.getFirstName())
                        .prenom(r.getLastName())
                        .telephone(r.getPhoneNumber())
                        .contrats(3)
                        .dateInscription(r.getCreatedDate())
                        .build()
                )
                .toList();
    }

    @Transactional
    public void deleteUser(Integer userId, Authentication authentication) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable : " + userId));

        userRepository.delete(user);
    }


    public void generateAndSendEmailRestToken(String email) throws MessagingException {

        Optional<Users> userByEmail = userRepository.findByEmail(email);

        if(userByEmail.isPresent()){
            String generatedToken = generateActivationCode();
            var token = Token.builder()
                    .token(generatedToken)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusMinutes(15))
                    .user(userByEmail.get())
                    .build();
            tokenRepository.save(token);

            emailService.sendPasswordResetEmail(userByEmail.get(),token.getToken());
        }
    }


    private String generateActivationCode() {
        return UUID.randomUUID().toString();
    }

    public AdminUserDTO getUserById(Integer id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + id));

        return AdminUserDTO.builder()
                .id(user.getId())
                .nom(user.getLastName())
                .prenom(user.getFirstName())
                .email(user.getEmail())
                .telephone(user.getPhoneNumber())
                .role(user.getRole().getRoleName())
                .statut("actif")
                .build();
    }

    public ClientProfileDTO getClientProfile() {
        String email = getAuthenticatedEmail();
        Users client = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        return ClientProfileDTO.builder()
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .email(client.getEmail())
                .phone(client.getPhoneNumber())
                .address("rue de france")
                .postalCode(client.getPostalCode())
                .city("paris")
                .build();
    }

    public void changePassword(ChangePasswordRequest request, String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        if (!bCryptPasswordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mot de passe actuel incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Le nouveau mot de passe et la confirmation ne correspondent pas");
        }

        user.setPassword(bCryptPasswordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }


    public void updateClientProfile(ClientProfileDTO profileData) {
        String email = getAuthenticatedEmail();
        Users client = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        if (isProvided(profileData.getFirstName())) client.setFirstName(profileData.getFirstName());
        if (isProvided(profileData.getLastName())) client.setLastName(profileData.getLastName());
        if (isProvided(profileData.getPhone())) client.setPhoneNumber(profileData.getPhone());
        if (isProvided(profileData.getPostalCode())) client.setPostalCode(profileData.getPostalCode());

        userRepository.save(client);
    }

    private String getAuthenticatedEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    private boolean isProvided(String value) {
        return value != null && !value.isBlank();
    }

    public Users updateUser(Integer id, UserUpdateDataDTO dto) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + id));

        if (dto.getNom() != null) {
            user.setLastName(dto.getNom());
        }

        if (dto.getPrenom() != null) {
            user.setFirstName(dto.getPrenom());
        }

        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }

        if (dto.getTelephone() != null) {
            user.setPhoneNumber(dto.getTelephone());
        }

        if (dto.getRole() != null) {
            Role role = roleRepository.findByRoleName(dto.getRole());
            if (role == null) {
                throw new RuntimeException("Rôle non trouvé : " + dto.getRole());
            }
            user.setRole(role);
        }

        if (dto.getStatut() != null) {
        }

        return userRepository.save(user);
    }

    public List<AdminUserDTO> getAllUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return List.of();
        }
        String currentUsername = auth.getName();

        Users currentUser = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("Utilisateur courant introuvable : " + currentUsername));

        Integer currentUserId = currentUser.getId();

        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .map(user -> AdminUserDTO.builder()
                        .id(user.getId())
                        .nom(user.getLastName())
                        .prenom(user.getFirstName())
                        .email(user.getEmail())
                        .telephone(user.getPhoneNumber())
                        .role(user.getRole().getRoleName())
                        .statut("actif")
                        .build()
                )
                .toList();
    }

    public List<Users> getUsersByRoleId(Integer roleId) {
        return userRepository.findAllByRole_Id(roleId);
    }
}
