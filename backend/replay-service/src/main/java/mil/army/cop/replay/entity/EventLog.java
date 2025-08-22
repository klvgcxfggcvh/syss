package mil.army.cop.replay.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.locationtech.jts.geom.Geometry;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "event_log", schema = "replay")
public class EventLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID operationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType;

    @Column(nullable = false)
    private String entityType;

    @Column(nullable = false)
    private String entityId;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String action;

    @Column(length = 1000)
    private String description;

    @Column(columnDefinition = "jsonb")
    private String eventData;

    @Column(columnDefinition = "jsonb")
    private String previousState;

    @Column(columnDefinition = "jsonb")
    private String newState;

    private Geometry location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventSeverity severity;

    @CreationTimestamp
    private LocalDateTime timestamp;

    // Constructors
    public EventLog() {}

    public EventLog(UUID operationId, EventType eventType, String entityType, String entityId,
                   String userId, String userName, String action, String description,
                   EventSeverity severity) {
        this.operationId = operationId;
        this.eventType = eventType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.userId = userId;
        this.userName = userName;
        this.action = action;
        this.description = description;
        this.severity = severity;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getOperationId() { return operationId; }
    public void setOperationId(UUID operationId) { this.operationId = operationId; }

    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }

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

    public String getEventData() { return eventData; }
    public void setEventData(String eventData) { this.eventData = eventData; }

    public String getPreviousState() { return previousState; }
    public void setPreviousState(String previousState) { this.previousState = previousState; }

    public String getNewState() { return newState; }
    public void setNewState(String newState) { this.newState = newState; }

    public Geometry getLocation() { return location; }
    public void setLocation(Geometry location) { this.location = location; }

    public EventSeverity getSeverity() { return severity; }
    public void setSeverity(EventSeverity severity) { this.severity = severity; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public enum EventType {
        UNIT_MOVEMENT, UNIT_STATUS_CHANGE, TASK_CREATED, TASK_UPDATED, TASK_COMPLETED,
        REPORT_SUBMITTED, REPORT_APPROVED, MESSAGE_SENT, OPERATION_STARTED, OPERATION_ENDED,
        MAP_ANNOTATION, CONTACT_REPORT, SYSTEM_EVENT, USER_LOGIN, USER_LOGOUT
    }

    public enum EventSeverity {
        INFO, WARNING, ERROR, CRITICAL
    }
}
