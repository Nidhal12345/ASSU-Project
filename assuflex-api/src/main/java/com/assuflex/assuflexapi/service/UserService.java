package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.DTO.UsersDTO;
import com.assuflex.assuflexapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<UsersDTO> getAllUsers() {
        return userRepository.findAllByRole_Id(1)
                .stream()
                .map(r -> UsersDTO.builder()
                        .id(r.getId())
                        .email(r.getEmail())
                        .nom(r.getFirstName())
                        .prenom(r.getLastName())
                        .telephone(r.getPhoneNumber())
                        .contrats(3)
                        .dateInscription(r.getCreatedDate())
                        .build()
                )
                .toList();
    }
}
