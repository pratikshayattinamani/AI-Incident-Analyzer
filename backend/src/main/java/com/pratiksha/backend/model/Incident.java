package com.pratiksha.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "incidents")
public class Incident {

    @Id
    private String id;

    private String title;
    private String description;
    private String machineName;
    private String severity;
    private String status;
    private String category;

    public Incident() {
    }

    public Incident(String id, String title, String description,
                    String machineName, String severity, String status , String category) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.machineName = machineName;
        this.severity = severity;
        this.status = status;
        this.category=category;

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMachineName() {
        return machineName;
    }

    public void setMachineName(String machineName) {
        this.machineName = machineName;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
