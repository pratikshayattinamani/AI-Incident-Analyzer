package com.pratiksha.backend.dto;

public class AIResponse {

    private String rootCause;
    private String riskLevel;
    private String immediateAction;
    private String preventiveMaintenance;

    public AIResponse() {
    }

    public String getRootCause() {
        return rootCause;
    }

    public void setRootCause(String rootCause) {
        this.rootCause = rootCause;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getImmediateAction() {
        return immediateAction;
    }

    public void setImmediateAction(String immediateAction) {
        this.immediateAction = immediateAction;
    }

    public String getPreventiveMaintenance() {
        return preventiveMaintenance;
    }

    public void setPreventiveMaintenance(String preventiveMaintenance) {
        this.preventiveMaintenance = preventiveMaintenance;
    }
}
