package mil.army.cop.ops.dto;

import java.time.LocalDateTime;

public class UnitPositionDto {
    private String unitId;
    private Double latitude;
    private Double longitude;
    private Double heading;
    private Double speed;
    private String status;
    private LocalDateTime timestamp;

    // Constructors
    public UnitPositionDto() {}

    // Getters and Setters
    public String getUnitId() { return unitId; }
    public void setUnitId(String unitId) { this.unitId = unitId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getHeading() { return heading; }
    public void setHeading(Double heading) { this.heading = heading; }

    public Double getSpeed() { return speed; }
    public void setSpeed(Double speed) { this.speed = speed; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
