package com.pratiksha.backend.dto;

public class AIRequest {

    private String machineName;
    private String description;

    public AIRequest() {
    }

    public AIRequest(String machineName, String description) {
        this.machineName = machineName;
        this.description = description;
    }

    public String getMachineName() {
        return machineName;
    }

    public void setMachineName(String machineName) {
        this.machineName = machineName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
