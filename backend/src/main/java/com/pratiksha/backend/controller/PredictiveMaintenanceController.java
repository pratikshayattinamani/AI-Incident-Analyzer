package com.pratiksha.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.pratiksha.backend.service.PredictiveMaintenanceService;

@RestController
@RequestMapping("/api/predict")
@CrossOrigin(origins = "*")
public class PredictiveMaintenanceController {

    @Autowired
    private PredictiveMaintenanceService predictiveMaintenanceService;

    @GetMapping
    public String predict(
            @RequestParam double temperature,
            @RequestParam double vibration) {

        return predictiveMaintenanceService.predict(temperature, vibration);
    }
}
