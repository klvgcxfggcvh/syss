package mil.army.cop.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import mil.army.cop.auth.dto.UserDto;
import mil.army.cop.auth.service.UserService;
import mil.army.cop.shared.security.CopRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "HQ")
    void getAllUsers_ShouldReturnUserList() throws Exception {
        // Given
        List<UserDto> users = Arrays.asList(
            createUserDto("1", "john.doe", "John Doe", CopRole.UNIT),
            createUserDto("2", "jane.smith", "Jane Smith", CopRole.HQ)
        );
        when(userService.getAllUsers()).thenReturn(users);

        // When & Then
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].username").value("john.doe"))
                .andExpect(jsonPath("$[1].username").value("jane.smith"));
    }

    @Test
    @WithMockUser(roles = "HQ")
    void getUserById_ShouldReturnUser() throws Exception {
        // Given
        UserDto user = createUserDto("1", "john.doe", "John Doe", CopRole.UNIT);
        when(userService.getUserById("1")).thenReturn(user);

        // When & Then
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.username").value("john.doe"));
    }

    @Test
    @WithMockUser(roles = "UNIT")
    void getAllUsers_WithUnitRole_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());
    }

    private UserDto createUserDto(String id, String username, String displayName, CopRole role) {
        UserDto user = new UserDto();
        user.setId(id);
        user.setUsername(username);
        user.setDisplayName(displayName);
        user.setRole(role);
        user.setActive(true);
        return user;
    }
}
