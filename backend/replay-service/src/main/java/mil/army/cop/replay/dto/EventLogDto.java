package mil.army.cop.replay.dto;

import mil.army.cop.replay.entity.EventLog;
import org.locationtech.jts.geom.Geometry;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public class EventLogDto {
    private UUID id;
    private UUID operationId;
    private EventLog.EventType eventType;
    private String entityType;
    private String entityId;
    private String userId;
    private String userName;
    private String action;
    private String description;
    private Map<String, Object> eventData;
    private Geometry location;
    private EventLog.EventSeverity severity;
    private LocalDateTime timestamp;

    // Constructors
    public EventLogDto() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getOperationId() { return operationId; }
    public void setOperationId(UUID operationId) { this.operationId = operationId; }

    public EventLog.EventType getEventType() { return eventType; }
    public void setEventType(EventLog.EventType eventType) { this.eventType = eventType; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Map<String, Object> getEventData() { return eventData; }
    public void setEventData(Map<String, Object> eventData) { this.eventData = eventData; }

    public Geometry getLocation() { return location; }
    public void setLocation(Geometry location) { this.location = location; }

    public EventLog.EventSeverity getSeverity() { return severity; }
    public void setSeverity(EventLog.EventSeverity severity) { this.severity = severity; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
