package com.assuflex.assuflexapi.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SignupResponse {
    private String token;
    private String email;
    private String role;
    private String fullName;
}
