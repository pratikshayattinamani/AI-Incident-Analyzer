package com.pratiksha.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pratiksha.backend.model.Incident;
import com.pratiksha.backend.repository.IncidentRepository;

@Service
public class IncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

    public Incident saveIncident(Incident incident) {
        return incidentRepository.save(incident);
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(String id) {
        return incidentRepository.findById(id).orElse(null);
    }

    public Incident updateIncident(String id, Incident updatedIncident) {

        Incident incident = incidentRepository.findById(id).orElse(null);

        if (incident != null) {
            incident.setTitle(updatedIncident.getTitle());
            incident.setDescription(updatedIncident.getDescription());
            incident.setSeverity(updatedIncident.getSeverity());
            incident.setStatus(updatedIncident.getStatus());
            incident.setMachineName(updatedIncident.getMachineName());

            return incidentRepository.save(incident);
        }

        return null;
    }

    public void deleteIncident(String id) {
        incidentRepository.deleteById(id);
    }

    public List<Incident> getIncidentsByStatus(String status) {
        return incidentRepository.findByStatus(status);
    }

    public List<Incident> getIncidentsBySeverity(String severity) {
        return incidentRepository.findBySeverity(severity);
    }

    public List<Incident> getIncidentsByMachineName(String machineName) {
        return incidentRepository.findByMachineName(machineName);
    }

    }


