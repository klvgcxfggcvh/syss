package mil.army.cop.report.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "reports", schema = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type;

    @Column(nullable = false)
    private String title;

    @Column(length = 5000)
    private String content;

    @Column(nullable = false)
    private UUID operationId;

    @Column(nullable = false)
    private String reportedBy;

    @Column(nullable = false)
    private String unit;

    private Point location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;

    @ElementCollection
    @CollectionTable(name = "report_data", schema = "reports", joinColumns = @JoinColumn(name = "report_id"))
    @MapKeyColumn(name = "field_name")
    @Column(name = "field_value", length = 1000)
    private Map<String, String> templateData;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReportAttachment> attachments = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructors
    public Report() {}

    public Report(ReportType type, String title, String content, UUID operationId, 
                 String reportedBy, String unit, ReportStatus status) {
        this.type = type;
        this.title = title;
        this.content = content;
        this.operationId = operationId;
        this.reportedBy = reportedBy;
        this.unit = unit;
        this.status = status;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public ReportType getType() { return type; }
    public void setType(ReportType type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public UUID getOperationId() { return operationId; }
    public void setOperationId(UUID operationId) { this.operationId = operationId; }

    public String getReportedBy() { return reportedBy; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Point getLocation() { return location; }
    public void setLocation(Point location) { this.location = location; }

    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }

    public Map<String, String> getTemplateData() { return templateData; }
    public void setTemplateData(Map<String, String> templateData) { this.templateData = templateData; }

    public List<ReportAttachment> getAttachments() { return attachments; }
    public void setAttachments(List<ReportAttachment> attachments) { this.attachments = attachments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum ReportType {
        SITREP, CONREP, INTSUM, SPOTREP, CASREP
    }

    public enum ReportStatus {
        DRAFT, SUBMITTED, REVIEWED, APPROVED, REJECTED
    }
}
