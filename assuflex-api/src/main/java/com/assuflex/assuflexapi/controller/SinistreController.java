package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.DTO.*;
import com.assuflex.assuflexapi.service.SinistreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/claims")
@RequiredArgsConstructor
public class SinistreController {

    private final SinistreService service;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<SinistreResponseDTO> create(@Valid @RequestBody SinistreRequestDTO dto) {
        SinistreResponseDTO saved = service.create(dto);
        return ResponseEntity.created(URI.create("/api/v1/claims/" + saved.getId())).body(saved);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<SinistreClientViewDTO>> myClaims(Authentication auth) {

        return ResponseEntity.ok(service.getMine(auth));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT','GESTIONNAIRE')")
    public ResponseEntity<SinistreResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }


    @GetMapping
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<List<SinistreGestViewDTO>> list() {
        System.out.println("hello");
        return ResponseEntity.ok(service.getAll());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<SinistreResponseDTO> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody ChangeStatusDTO dto) {
        System.out.println(dto.getStatus());
        return ResponseEntity.ok(service.changeStatus(id, dto.getStatus()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<SinistreResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody SinistreRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }
}
