package com.pratiksha.backend.controller;

import com.pratiksha.backend.dto.AIRequest;
import com.pratiksha.backend.dto.AIResponse;
import com.pratiksha.backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/analyze")
    public AIResponse analyze(@RequestBody AIRequest request) {

        return aiService.analyzeIncident(
                request.getMachineName(),
                request.getDescription()
        );

    }
}