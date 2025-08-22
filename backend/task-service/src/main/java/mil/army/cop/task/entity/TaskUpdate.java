package mil.army.cop.task.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "task_updates", schema = "tasks")
public class TaskUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(nullable = false)
    private String updatedBy;

    @Column(length = 1000)
    private String comment;

    @Enumerated(EnumType.STRING)
    private Task.TaskStatus previousStatus;

    @Enumerated(EnumType.STRING)
    private Task.TaskStatus newStatus;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // Constructors
    public TaskUpdate() {}

    public TaskUpdate(Task task, String updatedBy, String comment, 
                     Task.TaskStatus previousStatus, Task.TaskStatus newStatus) {
        this.task = task;
        this.updatedBy = updatedBy;
        this.comment = comment;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Task.TaskStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(Task.TaskStatus previousStatus) { this.previousStatus = previousStatus; }

    public Task.TaskStatus getNewStatus() { return newStatus; }
    public void setNewStatus(Task.TaskStatus newStatus) { this.newStatus = newStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
