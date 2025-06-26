package com.assuflex.assuflexapi.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationRequest {
    @NotEmpty(message = "email cant be null")
    @NotBlank(message = "email cant be null")
    @Email(message = "please provide a valid email")
    private String email;
    @NotEmpty(message = "password cant be null")
    @NotBlank(message = "password cant be null")
    @Size(min = 8,message = "please enter a 8 char password")
    private String password;
}
