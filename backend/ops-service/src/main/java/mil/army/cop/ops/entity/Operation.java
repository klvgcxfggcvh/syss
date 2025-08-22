package mil.army.cop.ops.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Geometry;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "operations", schema = "ops")
public class Operation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OperationStatus status;

    @Column(name = "area_of_interest")
    private Geometry areaOfInterest;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Column(nullable = false)
    private String commanderId;

    @ElementCollection
    @CollectionTable(name = "operation_units", schema = "ops", joinColumns = @JoinColumn(name = "operation_id"))
    @Column(name = "unit_id")
    private Set<String> assignedUnits;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructors
    public Operation() {}

    public Operation(String name, String description, OperationStatus status, 
                    Geometry areaOfInterest, LocalDateTime startTime, String commanderId) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.areaOfInterest = areaOfInterest;
        this.startTime = startTime;
        this.commanderId = commanderId;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public OperationStatus getStatus() { return status; }
    public void setStatus(OperationStatus status) { this.status = status; }

    public Geometry getAreaOfInterest() { return areaOfInterest; }
    public void setAreaOfInterest(Geometry areaOfInterest) { this.areaOfInterest = areaOfInterest; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getCommanderId() { return commanderId; }
    public void setCommanderId(String commanderId) { this.commanderId = commanderId; }

    public Set<String> getAssignedUnits() { return assignedUnits; }
    public void setAssignedUnits(Set<String> assignedUnits) { this.assignedUnits = assignedUnits; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum OperationStatus {
        PLANNING, ACTIVE, COMPLETED, CANCELLED
    }
}
