package mil.army.cop.ops.dto;

import jakarta.validation.constraints.NotNull;

public class UnitPositionUpdateDto {
    @NotNull
    private Double latitude;
    
    @NotNull
    private Double longitude;
    
    private Double heading;
    private Double speed;

    // Constructors
    public UnitPositionUpdateDto() {}

    public UnitPositionUpdateDto(Double latitude, Double longitude, Double heading, Double speed) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.heading = heading;
        this.speed = speed;
    }

    // Getters and Setters
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getHeading() { return heading; }
    public void setHeading(Double heading) { this.heading = heading; }

    public Double getSpeed() { return speed; }
    public void setSpeed(Double speed) { this.speed = speed; }
}
