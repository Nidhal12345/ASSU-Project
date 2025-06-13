package com.assuflex.assuflexapi.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClientProfileDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String postalCode;
    private String city;
}

