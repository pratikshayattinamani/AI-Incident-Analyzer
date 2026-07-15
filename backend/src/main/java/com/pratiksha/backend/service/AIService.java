package com.pratiksha.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pratiksha.backend.config.GroqConfig;
import com.pratiksha.backend.dto.AIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private GroqConfig groqConfig;

    private final ObjectMapper mapper = new ObjectMapper();

    public AIResponse analyzeIncident(String machineName, String description) {

        try {

            String prompt = """
You are an Industrial Predictive Maintenance AI.

Analyze the following machine incident.

Machine Name:
%s

Incident Description:
%s

Return ONLY valid JSON.

{
 "rootCause":"",
 "riskLevel":"",
 "immediateAction":"",
 "preventiveMaintenance":""
}
""".formatted(machineName, description);

            Map<String, Object> body = new HashMap<>();

            body.put("model", "llama-3.3-70b-versatile");

            List<Map<String, String>> messages = new ArrayList<>();

            Map<String, String> msg = new HashMap<>();
            msg.put("role", "user");
            msg.put("content", prompt);

            messages.add(msg);

            body.put("messages", messages);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqConfig.getApiKey());

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            groqConfig.getApiUrl(),
                            request,
                            String.class
                    );

            JsonNode root = mapper.readTree(response.getBody());

            String aiText = root
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();

// Remove markdown if Groq returns ```json
            aiText = aiText.replace("```json", "")
                    .replace("```", "")
                    .trim();

            System.out.println("AI RESPONSE:");
            System.out.println(aiText);

            return mapper.readValue(aiText, AIResponse.class);

        }
        catch(Exception e){
            throw new RuntimeException(e);
        }
    }
}

