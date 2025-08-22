package mil.army.cop.ops.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import mil.army.cop.ops.service.UnitStreamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.UUID;

@RestController
@RequestMapping("/api/ops")
@Tag(name = "Real-time Streaming", description = "Server-Sent Events for real-time data streaming")
public class StreamController {

    @Autowired
    private UnitStreamService unitStreamService;

    @GetMapping(value = "/{operationId}/stream/positions", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Stream unit positions for Blue Force Tracking")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT') or hasRole('OBSERVER')")
    public SseEmitter streamUnitPositions(@PathVariable UUID operationId) {
        return unitStreamService.createPositionStream(operationId);
    }

    @GetMapping(value = "/{operationId}/stream/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Stream operation events")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public SseEmitter streamOperationEvents(@PathVariable UUID operationId) {
        return unitStreamService.createEventStream(operationId);
    }

    @PostMapping("/{operationId}/units/{unitId}/position")
    @Operation(summary = "Update unit position (triggers stream update)")
    @PreAuthorize("hasRole('HQ') or hasRole('UNIT')")
    public void updateUnitPosition(
            @PathVariable UUID operationId,
            @PathVariable String unitId,
            @RequestBody UnitPositionUpdateDto positionUpdate) {
        unitStreamService.updateUnitPosition(operationId, unitId, positionUpdate);
    }
}
