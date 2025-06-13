package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.AuthenticationRequest;
import com.assuflex.assuflexapi.DTO.SignupRequest;
import com.assuflex.assuflexapi.DTO.SignupResponse;
import com.assuflex.assuflexapi.model.Role;
import com.assuflex.assuflexapi.repository.RoleRepository;
import com.assuflex.assuflexapi.utils.EmailService;
import com.assuflex.assuflexapi.security.jwtService;
import com.assuflex.assuflexapi.repository.UserRepository;
import com.assuflex.assuflexapi.model.Users;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder bcrybt;

    private final EmailService emailService;

    private final RoleRepository roleRepository;

    private final AuthenticationManager authenticationManager;

    public final jwtService jwtService;

    public SignupResponse authenticate(AuthenticationRequest authenticationRequest) throws MessagingException {

        var auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword()));

        var claims = new HashMap<String, Object>();

        var user = (Users) auth.getPrincipal();

        user.getAuthorities().forEach(authority -> System.out.println("Authority: " + authority.getAuthority()));
        claims.put("fullName", user.getFullName());

        var jwtToken = jwtService.generateToken(claims, user);

        String role = user.getAuthorities().stream().map(GrantedAuthority::getAuthority).findFirst().orElse(" ");

        emailService.sendValidationEmail(user);
        return SignupResponse
                .builder()
                .email(user.getEmail())
                .token(jwtToken)
                .fullName(user.getFullName())
                .role(role)
                .build();
    }

    public Users register(SignupRequest signupRequest) {

        if (userRepository.existsByEmail(signupRequest.getEmail())) {

            throw new IllegalArgumentException("Email déjà utilisé");
        }

        Role role = roleRepository.findByRoleName(signupRequest.getRole());

        Users user = new Users();

        user.setRole(role);

        user.setPassword(bcrybt.encode(signupRequest.getPassword()));

        user.setUsername(signupRequest.getUsername());

        user.setEmail(signupRequest.getEmail());

        return userRepository.save(user);
    }


}
