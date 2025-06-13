package com.assuflex.assuflexapi.controller;
import com.assuflex.assuflexapi.DTO.AuthenticationRequest;
import com.assuflex.assuflexapi.DTO.SignupRequest;
import com.assuflex.assuflexapi.DTO.SignupResponse;
import com.assuflex.assuflexapi.service.AuthService;
import com.assuflex.assuflexapi.model.Users;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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


}
