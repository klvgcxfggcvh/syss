package mil.army.cop.ops.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import mil.army.cop.ops.dto.UnitPositionDto;
import mil.army.cop.ops.dto.UnitPositionUpdateDto;
import mil.army.cop.ops.entity.Unit;
import mil.army.cop.ops.repository.UnitRepository;
import mil.army.cop.shared.exception.CopException;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class UnitStreamService {

    private static final Logger logger = LoggerFactory.getLogger(UnitStreamService.class);
    private static final long SSE_TIMEOUT = 30 * 60 * 1000L; // 30 minutes

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GeometryFactory geometryFactory;

    // Store active SSE connections by operation ID
    private final Map<UUID, CopyOnWriteArrayList<SseEmitter>> positionStreams = new ConcurrentHashMap<>();
    private final Map<UUID, CopyOnWriteArrayList<SseEmitter>> eventStreams = new ConcurrentHashMap<>();

    public SseEmitter createPositionStream(UUID operationId) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        
        // Add to active streams
        positionStreams.computeIfAbsent(operationId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        
        // Handle completion and timeout
        emitter.onCompletion(() -> removePositionStream(operationId, emitter));
        emitter.onTimeout(() -> removePositionStream(operationId, emitter));
        emitter.onError((ex) -> {
            logger.error("SSE error for operation {}: {}", operationId, ex.getMessage());
            removePositionStream(operationId, emitter);
        });

        // Send initial connection event
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("Connected to position stream for operation: " + operationId));
        } catch (IOException e) {
            logger.error("Failed to send initial SSE event", e);
            removePositionStream(operationId, emitter);
        }

        return emitter;
    }

    public SseEmitter createEventStream(UUID operationId) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        
        // Add to active streams
        eventStreams.computeIfAbsent(operationId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        
        // Handle completion and timeout
        emitter.onCompletion(() -> removeEventStream(operationId, emitter));
        emitter.onTimeout(() -> removeEventStream(operationId, emitter));
        emitter.onError((ex) -> {
            logger.error("SSE error for operation {}: {}", operationId, ex.getMessage());
            removeEventStream(operationId, emitter);
        });

        // Send initial connection event
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("Connected to event stream for operation: " + operationId));
        } catch (IOException e) {
            logger.error("Failed to send initial SSE event", e);
            removeEventStream(operationId, emitter);
        }

        return emitter;
    }

    public void updateUnitPosition(UUID operationId, String unitId, UnitPositionUpdateDto positionUpdate) {
        try {
            // Find and update unit
            Unit unit = unitRepository.findByCallSign(unitId)
                    .orElseThrow(() -> new CopException("Unit not found: " + unitId, "UNIT_NOT_FOUND"));

            // Update position
            Point newPosition = geometryFactory.createPoint(
                    new Coordinate(positionUpdate.getLongitude(), positionUpdate.getLatitude()));
            unit.setPosition(newPosition);
            unit.setHeading(positionUpdate.getHeading());
            unit.setSpeed(positionUpdate.getSpeed());
            unit.setLastUpdate(LocalDateTime.now());

            unitRepository.save(unit);

            // Create position DTO for streaming
            UnitPositionDto positionDto = new UnitPositionDto();
            positionDto.setUnitId(unit.getCallSign());
            positionDto.setLatitude(positionUpdate.getLatitude());
            positionDto.setLongitude(positionUpdate.getLongitude());
            positionDto.setHeading(positionUpdate.getHeading());
            positionDto.setSpeed(positionUpdate.getSpeed());
            positionDto.setStatus(unit.getStatus().name());
            positionDto.setTimestamp(unit.getLastUpdate());

            // Broadcast to all position streams for this operation
            broadcastPositionUpdate(operationId, positionDto);

        } catch (Exception e) {
            logger.error("Failed to update unit position for {}: {}", unitId, e.getMessage());
            throw new CopException("Failed to update unit position", "POSITION_UPDATE_FAILED");
        }
    }

    public void broadcastPositionUpdate(UUID operationId, UnitPositionDto positionDto) {
        CopyOnWriteArrayList<SseEmitter> streams = positionStreams.get(operationId);
        if (streams != null && !streams.isEmpty()) {
            streams.removeIf(emitter -> {
                try {
                    emitter.send(SseEmitter.event()
                            .name("position_update")
                            .data(objectMapper.writeValueAsString(positionDto)));
                    return false; // Keep emitter
                } catch (IOException e) {
                    logger.warn("Failed to send position update, removing emitter: {}", e.getMessage());
                    return true; // Remove emitter
                }
            });
        }
    }

    public void broadcastOperationEvent(UUID operationId, String eventType, Object eventData) {
        CopyOnWriteArrayList<SseEmitter> streams = eventStreams.get(operationId);
        if (streams != null && !streams.isEmpty()) {
            streams.removeIf(emitter -> {
                try {
                    emitter.send(SseEmitter.event()
                            .name(eventType)
                            .data(objectMapper.writeValueAsString(eventData)));
                    return false; // Keep emitter
                } catch (IOException e) {
                    logger.warn("Failed to send operation event, removing emitter: {}", e.getMessage());
                    return true; // Remove emitter
                }
            });
        }
    }

    private void removePositionStream(UUID operationId, SseEmitter emitter) {
        CopyOnWriteArrayList<SseEmitter> streams = positionStreams.get(operationId);
        if (streams != null) {
            streams.remove(emitter);
            if (streams.isEmpty()) {
                positionStreams.remove(operationId);
            }
        }
    }

    private void removeEventStream(UUID operationId, SseEmitter emitter) {
        CopyOnWriteArrayList<SseEmitter> streams = eventStreams.get(operationId);
        if (streams != null) {
            streams.remove(emitter);
            if (streams.isEmpty()) {
                eventStreams.remove(operationId);
            }
        }
    }
}
