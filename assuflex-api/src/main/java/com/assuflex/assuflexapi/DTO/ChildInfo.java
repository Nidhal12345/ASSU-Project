package com.assuflex.assuflexapi.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ChildInfo {

    @NotNull(message = "Child first name is required")
    @Size(min = 1, max = 50, message = "Child first name must be between 1 and 50 characters")
    private String firstName;

    @NotNull(message = "Child last name is required")
    @Size(min = 1, max = 50, message = "Child last name must be between 1 and 50 characters")
    private String lastName;

    @NotNull(message = "Child birth date is required")
    @Past(message = "Child birth date must be in the past")
    private LocalDate birthDate;
}
