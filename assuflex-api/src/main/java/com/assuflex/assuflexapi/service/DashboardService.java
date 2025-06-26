package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.DashboardStatsDto;
import com.assuflex.assuflexapi.DTO.MoisDevisDTO;
import com.assuflex.assuflexapi.model.Contract;
import com.assuflex.assuflexapi.model.Quote;
import com.assuflex.assuflexapi.model.Transaction;
import com.assuflex.assuflexapi.repository.ContractRepository;
import com.assuflex.assuflexapi.repository.QuoteRepository;
import com.assuflex.assuflexapi.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final QuoteRepository quoteRepository;
    private final TransactionRepository transactionRepository;
    private final ContractRepository contractRepository;

    public DashboardStatsDto getDashboardData() {
        long totalQuotes = quoteRepository.count();
        long totalClients = quoteRepository.countDistinctUsers();
        long totalTransactions = transactionRepository.countByStatus(Transaction.Status.SUCCEEDED);
        long totalContracts = contractRepository.countByStatut(Contract.StatutContrat.EN_COURS);

        Long totalRevenue = Optional.ofNullable(transactionRepository.getTotalRevenue()).orElse(0L);

        List<MoisDevisDTO> stat = quoteRepository.countQuotesPerMonth().stream()
                .map(obj -> new MoisDevisDTO((String) obj[0], ((Long) obj[1]).intValue()))
                .toList();

        List<Quote> quotes = quoteRepository.findTop5ByOrderByCreatedAtDesc();

        List<DashboardStatsDto.Quote> quoteDTOs = quotes.stream()
                .map(q -> DashboardStatsDto.Quote.builder()
                        .username(q.getFirstName() + " " + q.getLastName())
                        .quoteId(q.getId())
                        .status(q.getStatus())
                        .build())
                .toList();

        List<Transaction> transactions = transactionRepository.findTop5ByOrderByCreatedAtDesc();

        List<DashboardStatsDto.transaction> transactionList = transactions.stream()
                .map(t -> DashboardStatsDto.transaction.builder()
                        .amount(String.valueOf(t.getAmount()))
                        .client(t.getUser().getUsernameClient())
                        .date(String.valueOf(t.getCreatedAt()))
                        .Status(t.getStatus().name())
                        .build())
                .toList();

        return DashboardStatsDto.builder()
                .totalClients(totalClients)
                .totalQuotes(totalQuotes)
                .transactions(transactionList)
                .quotes(quoteDTOs)
                .totalContracts(totalContracts)
                .totalTransactions(totalTransactions)
                .totalRevenue(totalRevenue)
                .moisDevisDTOS(stat)
                .build();
    }
}