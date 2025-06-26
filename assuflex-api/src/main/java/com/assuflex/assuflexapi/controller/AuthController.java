package com.assuflex.assuflexapi.controller;
import com.assuflex.assuflexapi.DTO.AuthenticationRequest;
import com.assuflex.assuflexapi.DTO.EmailRequest;
import com.assuflex.assuflexapi.DTO.SignupRequest;
import com.assuflex.assuflexapi.DTO.SignupResponse;
import com.assuflex.assuflexapi.model.Token;
import com.assuflex.assuflexapi.repository.TokenRepository;
import com.assuflex.assuflexapi.repository.UserRepository;
import com.assuflex.assuflexapi.service.AuthService;
import com.assuflex.assuflexapi.model.Users;
import com.assuflex.assuflexapi.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final PasswordEncoder bcrybt;

    private final UserRepository userRepository;

    private final UserService userService;

    private final TokenRepository tokenRepository;


    @PostMapping("/login")
    public ResponseEntity<SignupResponse> authenticate(
            @RequestBody @Valid AuthenticationRequest authenticationRequest
    ) throws MessagingException {
        return ResponseEntity.ok(authService.authenticate(authenticationRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<?> signup(@RequestBody SignupRequest user) {
        try {
            Users newUser = authService.register(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody EmailRequest email) throws MessagingException {
        userService.generateAndSendEmailRestToken(email.getEmail());
        return ResponseEntity.ok("Password reset link sent to your email!");
    }

    @GetMapping("/reset-password")
    public ResponseEntity<String> verifyToken(@RequestParam String token) {
        Token resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        System.out.println(token);

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token expired");
        }

        return ResponseEntity.ok("Token verified. Display password reset form.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Token resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token expired");
        }

        System.out.println(newPassword);

        Users user = resetToken.getUser();
        user.setPassword(bcrybt.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
        return null;
    }
}
