package com.pratiksha.backend.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.pratiksha.backend.model.Incident;

@Repository
public interface IncidentRepository extends MongoRepository<Incident, String> {

    List<Incident> findByStatus(String status);


    List<Incident> findBySeverity(String severity);

    List<Incident> findByMachineName(String machineName);
}
