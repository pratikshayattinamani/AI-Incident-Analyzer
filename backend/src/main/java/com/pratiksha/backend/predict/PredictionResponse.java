package com.pratiksha.backend.predict;

public class PredictionResponse {

    private String prediction;
    private String confidence;

    public PredictionResponse() {
    }

    public PredictionResponse(String prediction, String confidence) {
        this.prediction = prediction;
        this.confidence = confidence;
    }

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public String getConfidence() {
        return confidence;
    }

    public void setConfidence(String confidence) {
        this.confidence = confidence;
    }
}
