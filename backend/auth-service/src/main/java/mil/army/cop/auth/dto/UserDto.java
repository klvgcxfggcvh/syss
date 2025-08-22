package mil.army.cop.auth.dto;

import mil.army.cop.shared.dto.BaseDto;
import java.util.Set;
import java.util.UUID;
import java.time.LocalDateTime;

public class UserDto extends BaseDto {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String rank;
    private String unit;
    private Set<String> roles;
    private Boolean active;

    public UserDto() {}

    public UserDto(UUID id, LocalDateTime createdAt, LocalDateTime updatedAt,
                   String username, String email, String firstName, String lastName,
                   String rank, String unit, Set<String> roles, Boolean active) {
        super(id, createdAt, updatedAt);
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.rank = rank;
        this.unit = unit;
        this.roles = roles;
        this.active = active;
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getRank() { return rank; }
    public void setRank(String rank) { this.rank = rank; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
