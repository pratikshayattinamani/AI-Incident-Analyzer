package com.pratiksha.backend.predict;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predict")
@CrossOrigin(origins = "*")
public class PredictionController {

    @PostMapping
    public PredictionResponse predict(@RequestBody PredictionRequest request) {

        if (request.getTemperature() > 80 ||
                request.getVibration() > 7 ||
                request.getPressure() > 120) {

            return new PredictionResponse("High Risk", "92%");
        }

        return new PredictionResponse("Low Risk", "98%");
    }
}