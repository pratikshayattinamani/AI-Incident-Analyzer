package com.pratiksha.backend.ai;

import org.springframework.stereotype.Service;

@Service
public class AIAnalysisService {

    public String analyze(String severity, String status) {

        if (severity.equalsIgnoreCase("CRITICAL")) {
            return "⚠ High risk detected. Immediate maintenance required.";
        }

        if (severity.equalsIgnoreCase("HIGH")) {
            return "Machine should be inspected within 24 hours.";
        }

        if (status.equalsIgnoreCase("OPEN")) {
            return "Incident is still unresolved. Assign technician.";
        }

        return "Machine condition appears stable.";
    }
}
