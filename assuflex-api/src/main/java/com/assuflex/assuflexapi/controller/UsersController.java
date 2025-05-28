package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.DTO.UsersDTO;
import com.assuflex.assuflexapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UsersController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UsersDTO>> getAllUsers(Authentication auth) {
        return ResponseEntity.ok(userService.getAllUsers());
    }

}
