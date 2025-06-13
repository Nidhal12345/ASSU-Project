package com.assuflex.assuflexapi.DTO;

import com.assuflex.assuflexapi.model.Child;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class ContractDTO {
    private int id;
    private String contractName;
    private Double annualPrice;
    private Double price;
    private LocalDate startDate;
    private String regularCare;
    private String hospitalization;
    private String dental;
    private String civility;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private LocalDate endDate;
    private String phoneNumber;
    private String email;
    private String spouseFirstName;
    private String spouseLastName;
    private LocalDate spouseBirthDate;
    private List<Child> childInfo;
}
