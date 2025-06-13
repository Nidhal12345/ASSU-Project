package com.assuflex.assuflexapi.DTO;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String role;
    private String token;
}
