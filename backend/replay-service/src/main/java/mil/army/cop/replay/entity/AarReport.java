package mil.army.cop.replay.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "aar_reports", schema = "replay")
public class AarReport {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID operationId;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String summary;

    @Column(columnDefinition = "text")
    private String keyEvents;

    @Column(columnDefinition = "text")
    private String lessonsLearned;

    @Column(columnDefinition = "text")
    private String recommendations;

    @Column(columnDefinition = "jsonb")
    private String statistics;

    @Column(nullable = false)
    private LocalDateTime analysisStartTime;

    @Column(nullable = false)
    private LocalDateTime analysisEndTime;

    @Column(nullable = false)
    private String generatedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AarStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructors
    public AarReport() {}

    public AarReport(UUID operationId, String title, LocalDateTime analysisStartTime,
                    LocalDateTime analysisEndTime, String generatedBy) {
        this.operationId = operationId;
        this.title = title;
        this.analysisStartTime = analysisStartTime;
        this.analysisEndTime = analysisEndTime;
        this.generatedBy = generatedBy;
        this.status = AarStatus.DRAFT;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getOperationId() { return operationId; }
    public void setOperationId(UUID operationId) { this.operationId = operationId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getKeyEvents() { return keyEvents; }
    public void setKeyEvents(String keyEvents) { this.keyEvents = keyEvents; }

    public String getLessonsLearned() { return lessonsLearned; }
    public void setLessonsLearned(String lessonsLearned) { this.lessonsLearned = lessonsLearned; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public String getStatistics() { return statistics; }
    public void setStatistics(String statistics) { this.statistics = statistics; }

    public LocalDateTime getAnalysisStartTime() { return analysisStartTime; }
    public void setAnalysisStartTime(LocalDateTime analysisStartTime) { this.analysisStartTime = analysisStartTime; }

    public LocalDateTime getAnalysisEndTime() { return analysisEndTime; }
    public void setAnalysisEndTime(LocalDateTime analysisEndTime) { this.analysisEndTime = analysisEndTime; }

    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }

    public AarStatus getStatus() { return status; }
    public void setStatus(AarStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum AarStatus {
        DRAFT, COMPLETED, REVIEWED, APPROVED
    }
}
