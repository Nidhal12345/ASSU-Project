package com.assuflex.assuflexapi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotService {

    private final RestTemplate restTemplate;

    private String apiUrl = "https://openrouter.ai/api/v1/chat/completions";

    public ChatbotService() {
        this.restTemplate = new RestTemplate();
    }

    public String askChatbot(String prompt) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth("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");



        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o-mini");  // your model
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", "Tu es ASSU-BOT, un assistant virtuel expert en assurance santé. Ta mission est d’aider les clients à comprendre, choisir et souscrire la meilleure assurance santé adaptée à leurs besoins. Tu réponds toujours en français, de manière claire, professionnelle, empathique et précise. Tu fournis des conseils personnalisés, expliques les garanties, les démarches, les prix et restes toujours poli et disponible. Si une question n’est pas claire, propose une réponse de secours pour guider l’utilisateur. Ne donne jamais de conseils juridiques, mais oriente toujours vers un conseiller humain si besoin."),
                Map.of("role", "user", "content", prompt)
        ));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            String jsonResponse = response.getBody();

            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(jsonResponse);
                return root.path("choices").get(0).path("message").path("content").asText();
            } catch (Exception e) {
                throw new RuntimeException("Erreur lors du parsing JSON", e);
            }

        } else {
            throw new RuntimeException("Erreur API OpenRouter : " + response.getStatusCode());
        }
    }
}

