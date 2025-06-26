package com.assuflex.assuflexapi.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SignupRequest {
    private String email;
    private String username;
    private String password;
    private String role;
}
