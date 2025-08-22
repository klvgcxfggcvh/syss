package mil.army.cop.task.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import mil.army.cop.task.dto.TaskDto;
import mil.army.cop.task.dto.CreateTaskDto;
import mil.army.cop.task.dto.UpdateTaskStatusDto;
import mil.army.cop.task.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Task Management", description = "Task lifecycle management operations")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/operation/{operationId}")
    @Operation(summary = "Get tasks by operation")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public ResponseEntity<List<TaskDto>> getTasksByOperation(@PathVariable UUID operationId) {
        List<TaskDto> tasks = taskService.getTasksByOperation(operationId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/unit/{unit}")
    @Operation(summary = "Get tasks assigned to unit")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public ResponseEntity<List<TaskDto>> getTasksByUnit(@PathVariable String unit) {
        List<TaskDto> tasks = taskService.getTasksByUnit(unit);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable UUID id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create new task")
    @PreAuthorize("hasRole('HQ')")
    public ResponseEntity<TaskDto> createTask(@RequestBody CreateTaskDto createTaskDto) {
        TaskDto createdTask = taskService.createTask(createTaskDto);
        return ResponseEntity.ok(createdTask);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update task status")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public ResponseEntity<TaskDto> updateTaskStatus(@PathVariable UUID id, 
                                                   @RequestBody UpdateTaskStatusDto updateDto) {
        TaskDto updatedTask = taskService.updateTaskStatus(id, updateDto);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task")
    @PreAuthorize("hasRole('HQ')")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
