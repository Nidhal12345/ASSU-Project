package com.assuflex.assuflexapi.DTO;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class devisDTO {
    private Double annualPrice;

    private String assureurName;

    private LocalDateTime birthDate;

    private Integer childrenCount;

    private List<ChildInfo> childrenInfo;

    private String civility;

    private String coverageOption;

    private Double dental;

    private String email;

    private String firstName;

    private Double hospitalization;

    private String lastName;

    private Double monthlyPrice;

    private String offerId;

    private String offerName;

    private Double optical;

    private String phoneNumber;

    private String postalCode;

    private String profession;

    private String regime;

    private Double regularCare;

    private String spouseFirstName;

    private String spouseLastName;

    private LocalDate spouseBirthDate;

    private LocalDateTime startDate;
}
