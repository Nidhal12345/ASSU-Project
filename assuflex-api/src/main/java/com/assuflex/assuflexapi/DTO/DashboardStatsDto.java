package com.assuflex.assuflexapi.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private long totalQuotes;
    private long totalClients;
    private long totalTransactions;
    private long totalContracts;
    private long totalRevenue;
    private List<Quote> quotes;
    private List<transaction> transactions;
    private List<MoisDevisDTO> moisDevisDTOS;



    @Data
    @AllArgsConstructor
    @Builder
    public static class Quote {
        private String username;
        private Integer quoteId;
        private String status;
    }

    @Data
    @AllArgsConstructor
    @Builder
    public static class transaction {
        private String client;
        private String date;
        private String amount;
        private String Status;
    }
}



