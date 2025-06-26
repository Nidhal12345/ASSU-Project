package com.assuflex.assuflexapi.utils;

import com.assuflex.assuflexapi.DTO.SignupRequest;
import com.assuflex.assuflexapi.model.Offre;
import com.assuflex.assuflexapi.repository.UserRepository;
import com.assuflex.assuflexapi.service.AuthService;
import com.assuflex.assuflexapi.service.OffreService;
import com.assuflex.assuflexapi.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;


@Component
@AllArgsConstructor
public class OffreInitializer {

    private final OffreService offreService;

    @PostConstruct
    public void initOffres() {
                if (offreService.countOffres() == 0) {
            Map<Long, Offre> offreMap = new HashMap<>();

            offreMap.put(1L, Offre.builder()
                    .nom("Eco")
                    .assureur("APRIL")
                    .tarifJeune(24.32)
                    .tarifAdulte(47.82)
                    .tarifSenior(83.4)
                    .tarifFamille(71.08)
                    .build());

            offreMap.put(2L, Offre.builder()
                    .nom("Premium")
                    .assureur("Malakoff Humanis")
                    .tarifJeune(34.01)
                    .tarifAdulte(58.92)
                    .tarifSenior(121.81)
                    .tarifFamille(117.22)
                    .build());

            offreMap.put(3L, Offre.builder()
                    .nom("Mid")
                    .assureur("Alptis")
                    .tarifJeune(28.27)
                    .tarifAdulte(38.93)
                    .tarifSenior(95.9)
                    .tarifFamille(48.73)
                    .build());

            offreMap.put(4L, Offre.builder()
                    .nom("Eco")
                    .assureur("AXA")
                    .tarifJeune(25.0)
                    .tarifAdulte(31.0)
                    .tarifSenior(35.0)
                    .tarifFamille(40.0)
                    .build());

            offreMap.values().forEach(offreService::AddOffre);
        }
    }

}
