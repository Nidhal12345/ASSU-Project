package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.SinistreClientViewDTO;
import com.assuflex.assuflexapi.DTO.SinistreGestViewDTO;
import com.assuflex.assuflexapi.DTO.SinistreRequestDTO;
import com.assuflex.assuflexapi.DTO.SinistreResponseDTO;
import com.assuflex.assuflexapi.model.*;
import com.assuflex.assuflexapi.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SinistreService {

    private final SinistreRepository repo;
    private final ContractRepository contractRepo;
    private final UserRepository userRepository;

    @Transactional
    public SinistreResponseDTO create(SinistreRequestDTO dto) {
        Contract c = contractRepo.findByContractNumber(dto.getContractNumber())
                .orElseThrow(() -> new EntityNotFoundException("Contrat introuvable"));
        Sinistre s = Sinistre.builder()
                .claimType(dto.getClaimType())
                .contactName(dto.getContactName())
                .contactEmail(dto.getContactEmail())
                .contactPhone(dto.getContactPhone())
                .contract(c)
                .description(dto.getDescription())
                .incidentDate(dto.getIncidentDate())
                .status(Sinistre.ClaimStatus.SUBMITTED)
                .build();
        return toResp(repo.save(s));
    }

    @Transactional(readOnly = true)
    public List<SinistreClientViewDTO> getMine(Authentication authentication) {
       Optional<Users> clientId = userRepository.findByEmail(authentication.getName());

        return repo.findByContract_Client_Id(Long.valueOf(clientId.get().getId())).stream().map(this::toClient).toList();
    }

    @Transactional(readOnly = true)
    public List<SinistreGestViewDTO> getAll() {
        return repo.findAll().stream().map(this::toGest).toList();
    }

    @Transactional(readOnly = true)
    public SinistreResponseDTO getById(Long id) { return toResp(find(id)); }

    @Transactional
    public SinistreResponseDTO update(Long id, SinistreRequestDTO dto) {
        Sinistre s = find(id);
        Contract c = contractRepo.findByContractNumber(dto.getContractNumber())
                .orElseThrow(() -> new EntityNotFoundException("Contrat introuvable"));
        s.setClaimType(dto.getClaimType());
        s.setContactName(dto.getContactName());
        s.setContactEmail(dto.getContactEmail());
        s.setContactPhone(dto.getContactPhone());
        s.setDescription(dto.getDescription());
        s.setIncidentDate(dto.getIncidentDate());
        s.setContract(c);
        return toResp(repo.save(s));
    }


    @Transactional
    public void delete(Long id) { repo.delete(find(id)); }

    @Transactional
    public SinistreResponseDTO changeStatus(Long id, Sinistre.ClaimStatus st) {
        Sinistre s = find(id);
        s.setStatus(st);
        return toResp(repo.save(s));
    }

    private Sinistre find(Long id) {
        return repo.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Sinistre " + id + " introuvable"));
    }

    private SinistreResponseDTO toResp(Sinistre s) {
        return SinistreResponseDTO.builder()
                .id(s.getId())
                .claimType(s.getClaimType())
                .contactName(s.getContactName())
                .contactEmail(s.getContactEmail())
                .contactPhone(s.getContactPhone())
                .contractNumber(s.getContract().getContractNumber())
                .description(s.getDescription())
                .incidentDate(s.getIncidentDate())
                .status(s.getStatus())
                .createdAt(s.getCreatedAt())
                .build();
    }
    private SinistreClientViewDTO toClient(Sinistre s) {
        return SinistreClientViewDTO.builder()
                .id(s.getId())
                .incidentDate(s.getIncidentDate())
                .claimType(s.getClaimType())
                .contractNumber(s.getContract().getContractNumber())
                .status(s.getStatus())
                .createdAt(s.getCreatedAt())
                .build();
    }
    private SinistreGestViewDTO toGest(Sinistre s) {
        return SinistreGestViewDTO.builder()
                .id(s.getId())
                .contractNumber(s.getContract().getContractNumber())
                .incidentDate(s.getIncidentDate())
                .claimType(s.getClaimType())
                .contactName(s.getContactName())
                .contactEmail(s.getContactEmail())
                .status(s.getStatus())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
