package com.assuflex.assuflexapi.service;

import com.assuflex.assuflexapi.model.Offre;
import com.assuflex.assuflexapi.repository.OffreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OffreService {

    private final OffreRepository offreRepository;

    public void AddOffre(Offre offre){
        if(offreRepository.existsOffreById(offre.getId())){
            return;
        }

        offreRepository.save(offre);
    }

    public long countOffres() {
        return offreRepository.count();
    }

}
