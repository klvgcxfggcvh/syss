package mil.army.cop.ops.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import mil.army.cop.ops.dto.CreateOperationDto;
import mil.army.cop.ops.dto.OperationDto;
import mil.army.cop.ops.service.OperationService;
import mil.army.cop.shared.dto.GeoJsonDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OperationController.class)
class OperationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OperationService operationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "HQ")
    void createOperation_ShouldReturnCreatedOperation() throws Exception {
        // Given
        CreateOperationDto createDto = new CreateOperationDto();
        createDto.setName("Test Operation");
        createDto.setDescription("Test Description");
        createDto.setStartTime(LocalDateTime.now());
        createDto.setEndTime(LocalDateTime.now().plusHours(24));

        OperationDto operationDto = new OperationDto();
        operationDto.setId("1");
        operationDto.setName("Test Operation");
        operationDto.setDescription("Test Description");
        operationDto.setStatus("PLANNING");

        when(operationService.createOperation(any(CreateOperationDto.class))).thenReturn(operationDto);

        // When & Then
        mockMvc.perform(post("/api/operations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Test Operation"))
                .andExpect(jsonPath("$.status").value("PLANNING"));
    }

    @Test
    @WithMockUser(roles = "UNIT")
    void createOperation_WithUnitRole_ShouldReturnForbidden() throws Exception {
        CreateOperationDto createDto = new CreateOperationDto();
        createDto.setName("Test Operation");

        mockMvc.perform(post("/api/operations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "HQ")
    void getAllOperations_ShouldReturnOperationList() throws Exception {
        // Given
        List<OperationDto> operations = Arrays.asList(
            createOperationDto("1", "Operation Alpha"),
            createOperationDto("2", "Operation Bravo")
        );
        when(operationService.getAllOperations()).thenReturn(operations);

        // When & Then
        mockMvc.perform(get("/api/operations"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }

    private OperationDto createOperationDto(String id, String name) {
        OperationDto dto = new OperationDto();
        dto.setId(id);
        dto.setName(name);
        dto.setStatus("ACTIVE");
        return dto;
    }
}
