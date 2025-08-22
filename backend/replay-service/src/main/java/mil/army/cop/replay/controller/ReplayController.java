package mil.army.cop.replay.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import mil.army.cop.replay.dto.EventLogDto;
import mil.army.cop.replay.dto.CreateEventLogDto;
import mil.army.cop.replay.dto.EventFilterDto;
import mil.army.cop.replay.dto.AarReportDto;
import mil.army.cop.replay.entity.EventLog;
import mil.army.cop.replay.service.EventLogService;
import mil.army.cop.replay.service.AarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/replay")
@Tag(name = "Replay & AAR", description = "Event logging and replay operations for After Action Review")
public class ReplayController {

    @Autowired
    private EventLogService eventLogService;

    @Autowired
    private AarService aarService;

    @GetMapping("/{operationId}")
    @Operation(summary = "Get all events for operation")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public ResponseEntity<List<EventLogDto>> getOperationEvents(@PathVariable UUID operationId) {
        List<EventLogDto> events = eventLogService.getEventsByOperation(operationId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{operationId}/timeline")
    @Operation(summary = "Get events within time range")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public ResponseEntity<List<EventLogDto>> getEventTimeline(
            @PathVariable UUID operationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        List<EventLogDto> events = eventLogService.getEventsByTimeRange(operationId, startTime, endTime);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{operationId}/type/{eventType}")
    @Operation(summary = "Get events by type")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public ResponseEntity<List<EventLogDto>> getEventsByType(
            @PathVariable UUID operationId,
            @PathVariable EventLog.EventType eventType) {
        List<EventLogDto> events = eventLogService.getEventsByType(operationId, eventType);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/{operationId}/filter")
    @Operation(summary = "Get events with advanced filters")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public ResponseEntity<List<EventLogDto>> getEventsWithFilters(
            @PathVariable UUID operationId,
            @RequestBody EventFilterDto filterDto) {
        filterDto.setOperationId(operationId);
        List<EventLogDto> events = eventLogService.getEventsWithFilters(filterDto);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{operationId}/pageable")
    @Operation(summary = "Get events with pagination")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public ResponseEntity<Page<EventLogDto>> getEventsPageable(
            @PathVariable UUID operationId,
            Pageable pageable) {
        Page<EventLogDto> events = eventLogService.getEventsPageable(operationId, pageable);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/log")
    @Operation(summary = "Log new event")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public ResponseEntity<EventLogDto> logEvent(@RequestBody CreateEventLogDto createDto) {
        EventLogDto loggedEvent = eventLogService.logEvent(createDto);
        return ResponseEntity.ok(loggedEvent);
    }

    @GetMapping("/{operationId}/statistics")
    @Operation(summary = "Get event statistics for operation")
    @PreAuthorize("hasRole('HQ')")
    public ResponseEntity<Map<String, Long>> getEventStatistics(@PathVariable UUID operationId) {
        Map<String, Long> statistics = eventLogService.getEventStatistics(operationId);
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/{operationId}/aar")
    @Operation(summary = "Generate AAR report")
    @PreAuthorize("hasRole('HQ')")
    public ResponseEntity<AarReportDto> generateAarReport(
            @PathVariable UUID operationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        AarReportDto aarReport = aarService.generateAarReport(operationId, startTime, endTime);
        return ResponseEntity.ok(aarReport);
    }

    @GetMapping("/{operationId}/aar")
    @Operation(summary = "Get AAR reports for operation")
    @PreAuthorize("hasRole('HQ')")
    public ResponseEntity<List<AarReportDto>> getAarReports(@PathVariable UUID operationId) {
        List<AarReportDto> reports = aarService.getAarReportsByOperation(operationId);
        return ResponseEntity.ok(reports);
    }
}
