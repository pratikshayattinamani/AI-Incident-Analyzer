package com.pratiksha.backend.service;

import org.springframework.stereotype.Service;

@Service
public class PredictiveMaintenanceService {

    public String predict(double temperature, double vibration) {

        if (temperature > 90 && vibration > 8) {
            return "⚠ Immediate maintenance required. High risk of machine failure.";
        }

        if (temperature > 75 || vibration > 5) {
            return "Schedule maintenance within 24 hours.";
        }

        return "Machine is operating normally.";
    }
}