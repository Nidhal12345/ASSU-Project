package com.assuflex.assuflexapi.controller;

import com.assuflex.assuflexapi.service.ChatbotService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/ask")
    public String ask(@RequestBody String prompt) {
        System.out.println(prompt);
        return chatbotService.askChatbot(prompt);
    }
}

