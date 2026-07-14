package com.pratiksha.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pratiksha.backend.model.Incident;
import com.pratiksha.backend.service.IncidentService;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    @PostMapping
    public Incident createIncident(@RequestBody Incident incident) {
        return incidentService.saveIncident(incident);
    }

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @GetMapping("/{id}")
    public Incident getIncident(@PathVariable String id) {
        return incidentService.getIncidentById(id);
    }

    @PutMapping("/{id}")
    public Incident updateIncident(@PathVariable String id,
                                   @RequestBody Incident incident) {
        return incidentService.updateIncident(id, incident);
    }

    @DeleteMapping("/{id}")
    public String deleteIncident(@PathVariable String id) {
        incidentService.deleteIncident(id);
        return "Incident deleted successfully";
    }
    @GetMapping("/status/{status}")
    public List<Incident> getIncidentsByStatus(@PathVariable String status) {
        return incidentService.getIncidentsByStatus(status);
    }
    @GetMapping("/severity/{severity}")
    public List<Incident> getIncidentsBySeverity(@PathVariable String severity) {
        return incidentService.getIncidentsBySeverity(severity);
    }
    @GetMapping("/machine/{machineName}")
    public List<Incident> getIncidentsByMachineName(@PathVariable String machineName) {
        return incidentService.getIncidentsByMachineName(machineName);
    }
}
