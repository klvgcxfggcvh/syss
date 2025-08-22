package mil.army.cop.shared.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class GeoJsonDto {
    private String type;
    private Object coordinates;
    private Map<String, Object> properties;

    public GeoJsonDto() {}

    public GeoJsonDto(String type, Object coordinates, Map<String, Object> properties) {
        this.type = type;
        this.coordinates = coordinates;
        this.properties = properties;
    }

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Object getCoordinates() { return coordinates; }
    public void setCoordinates(Object coordinates) { this.coordinates = coordinates; }

    public Map<String, Object> getProperties() { return properties; }
    public void setProperties(Map<String, Object> properties) { this.properties = properties; }
}
