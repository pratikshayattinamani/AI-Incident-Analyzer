package com.pratiksha.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pratiksha.backend.model.Incident;
import com.pratiksha.backend.repository.IncidentRepository;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private IncidentRepository incidentRepository;

    @GetMapping("/stats")
    public Map<String, Integer> getStats() {

        List<Incident> incidents = incidentRepository.findAll();

        int total = incidents.size();

        int critical = 0;
        int high = 0;
        int medium = 0;
        int low = 0;

        int open = 0;
        int resolved = 0;

        for (Incident incident : incidents) {

            String severity = incident.getSeverity();
            String status = incident.getStatus();

            if ("CRITICAL".equalsIgnoreCase(severity))
                critical++;

            else if ("HIGH".equalsIgnoreCase(severity))
                high++;

            else if ("MEDIUM".equalsIgnoreCase(severity))
                medium++;

            else if ("LOW".equalsIgnoreCase(severity))
                low++;

            if ("OPEN".equalsIgnoreCase(status))
                open++;

            if ("RESOLVED".equalsIgnoreCase(status))
                resolved++;
        }

        Map<String, Integer> stats = new HashMap<>();

        stats.put("totalIncidents", total);

        stats.put("criticalIncidents", critical);
        stats.put("highIncidents", high);
        stats.put("mediumIncidents", medium);
        stats.put("lowIncidents", low);

        stats.put("openIncidents", open);
        stats.put("resolvedIncidents", resolved);

        return stats;
    }
}