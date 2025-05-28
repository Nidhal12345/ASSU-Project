package com.assuflex.assuflexapi.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class QuoteRequest {
    /**
     * The coverage option for the quote (e.g., "Basic", "Premium").
     */
    @NotNull(message = "Coverage option is required")
    @Size(min = 1, max = 50, message = "Coverage option must be between 1 and 50 characters")
    private String coverageOption;

    /**
     * The start date of the quote coverage.
     */
    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    /**
     * Cost or coverage amount for regular care.
     */
    @NotNull(message = "Regular care is required")
    @PositiveOrZero(message = "Regular care must be zero or positive")
    private String regularCare;

    /**
     * Cost or coverage amount for hospitalization.
     */
    @NotNull(message = "Hospitalization is required")
    @PositiveOrZero(message = "Hospitalization must be zero or positive")
    private String hospitalization;

    /**
     * Cost or coverage amount for dental care.
     */
    @NotNull(message = "Dental is required")
    @PositiveOrZero(message = "Dental must be zero or positive")
    private String dental;

    /**
     * Cost or coverage amount for optical care.
     */
    @NotNull(message = "Optical is required")
    @PositiveOrZero(message = "Optical must be zero or positive")
    private String optical;

    /**
     * Civility of the requester (e.g., "Mr", "Mrs").
     */
    @NotNull(message = "Civility is required")
    @Size(min = 1, max = 10, message = "Civility must be between 1 and 10 characters")
    private String civility;

    /**
     * First name of the requester.
     */
    @NotNull(message = "First name is required")
    @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters")
    private String firstName;

    /**
     * Last name of the requester.
     */
    @NotNull(message = "Last name is required")
    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    private String lastName;
    @NotNull(message = "Birth date is required")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    /**
     * Profession of the requester.
     */
    @Size(max = 100, message = "Profession must not exceed 100 characters")
    private String profession;

    /**
     * Social security regime (e.g., "General", "Agricultural").
     */
    @NotNull(message = "Regime is required")
    @Size(min = 1, max = 50, message = "Regime must be between 1 and 50 characters")
    private String regime;

    /**
     * Postal code of the requester.
     */
    @NotNull(message = "Postal code is required")
    @Pattern(regexp = "\\d{5}", message = "Postal code must be a 5-digit number")
    private String postalCode;

    /**
     * Phone number of the requester.
     */
    @NotNull(message = "Phone number is required")
    @Pattern(regexp = "\\+?\\d{10,15}", message = "Phone number must be a valid format (10-15 digits, optional +)")
    private String phoneNumber;

    /**
     * Email address of the requester.
     */
    @NotNull(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    /**
     * First name of the spouse (optional).
     */
    @Size(max = 50, message = "Spouse first name must not exceed 50 characters")
    private String spouseFirstName;

    /**
     * Last name of the spouse (optional).
     */
    @Size(max = 50, message = "Spouse last name must not exceed 50 characters")
    private String spouseLastName;

    /**
     * Birth date of the spouse (optional).
     */
    @Past(message = "Spouse birth date must be in the past")
    private LocalDate spouseBirthDate;

    /**
     * List of children information (optional).
     */
    private List<ChildInfo> childrenInfo;
}
