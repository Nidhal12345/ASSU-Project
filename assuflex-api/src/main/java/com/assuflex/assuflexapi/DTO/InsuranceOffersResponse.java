package com.assuflex.assuflexapi.DTO;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InsuranceOffersResponse {
    private List<InsuranceOffer> offers;

    @Data
    @AllArgsConstructor
    @Builder
    @NoArgsConstructor
    public static class InsuranceOffer {
        private String id;
        private String name;
        private String assureurName;
        private Double price;
        private CoverageDetail coverage;
        private List<String> features;
    }

    @Data
    @AllArgsConstructor
    @Builder
    @NoArgsConstructor
    public static class CoverageDetail {
        private Double soinsCourants;
        private Double dentaire;
        private Double optique;
        private Double hospitalisation;
    }
}