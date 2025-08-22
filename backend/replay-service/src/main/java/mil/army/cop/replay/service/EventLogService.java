package mil.army.cop.replay.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import mil.army.cop.replay.dto.EventLogDto;
import mil.army.cop.replay.dto.CreateEventLogDto;
import mil.army.cop.replay.dto.EventFilterDto;
import mil.army.cop.replay.entity.EventLog;
import mil.army.cop.replay.repository.EventLogRepository;
import mil.army.cop.shared.exception.CopException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventLogService {

    @Autowired
    private EventLogRepository eventLogRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<EventLogDto> getEventsByOperation(UUID operationId) {
        return eventLogRepository.findByOperationIdOrderByTimestampAsc(operationId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EventLogDto> getEventsWithFilters(EventFilterDto filterDto) {
        return eventLogRepository.findEventsWithFilters(
                filterDto.getOperationId(),
                filterDto.getStartTime(),
                filterDto.getEndTime(),
                filterDto.getEventType(),
                filterDto.getEntityType()
        ).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EventLogDto> getEventsByTimeRange(UUID operationId, LocalDateTime startTime, LocalDateTime endTime) {
        return eventLogRepository.findByOperationIdAndTimestampBetweenOrderByTimestampAsc(
                operationId, startTime, endTime)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EventLogDto> getEventsByType(UUID operationId, EventLog.EventType eventType) {
        return eventLogRepository.findByOperationIdAndEventTypeOrderByTimestampAsc(operationId, eventType)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Page<EventLogDto> getEventsPageable(UUID operationId, Pageable pageable) {
        return eventLogRepository.findByOperationIdOrderByTimestampDesc(operationId, pageable)
                .map(this::convertToDto);
    }

    public EventLogDto logEvent(CreateEventLogDto createDto) {
        EventLog eventLog = new EventLog(
                createDto.getOperationId(),
                createDto.getEventType(),
                createDto.getEntityType(),
                createDto.getEntityId(),
                createDto.getUserId(),
                createDto.getUserName(),
                createDto.getAction(),
                createDto.getDescription(),
                createDto.getSeverity()
        );

        if (createDto.getEventData() != null) {
            try {
                eventLog.setEventData(objectMapper.writeValueAsString(createDto.getEventData()));
            } catch (JsonProcessingException e) {
                throw new CopException("Failed to serialize event data", "SERIALIZATION_ERROR");
            }
        }

        if (createDto.getPreviousState() != null) {
            try {
                eventLog.setPreviousState(objectMapper.writeValueAsString(createDto.getPreviousState()));
            } catch (JsonProcessingException e) {
                throw new CopException("Failed to serialize previous state", "SERIALIZATION_ERROR");
            }
        }

        if (createDto.getNewState() != null) {
            try {
                eventLog.setNewState(objectMapper.writeValueAsString(createDto.getNewState()));
            } catch (JsonProcessingException e) {
                throw new CopException("Failed to serialize new state", "SERIALIZATION_ERROR");
            }
        }

        eventLog.setLocation(createDto.getLocation());

        EventLog savedEvent = eventLogRepository.save(eventLog);
        return convertToDto(savedEvent);
    }

    public Map<String, Long> getEventStatistics(UUID operationId) {
        List<Object[]> stats = eventLogRepository.getEventTypeStatistics(operationId);
        return stats.stream()
                .collect(Collectors.toMap(
                        row -> ((EventLog.EventType) row[0]).name(),
                        row -> (Long) row[1]
                ));
    }

    private EventLogDto convertToDto(EventLog eventLog) {
        EventLogDto dto = new EventLogDto();
        dto.setId(eventLog.getId());
        dto.setOperationId(eventLog.getOperationId());
        dto.setEventType(eventLog.getEventType());
        dto.setEntityType(eventLog.getEntityType());
        dto.setEntityId(eventLog.getEntityId());
        dto.setUserId(eventLog.getUserId());
        dto.setUserName(eventLog.getUserName());
        dto.setAction(eventLog.getAction());
        dto.setDescription(eventLog.getDescription());
        dto.setSeverity(eventLog.getSeverity());
        dto.setTimestamp(eventLog.getTimestamp());
        dto.setLocation(eventLog.getLocation());

        // Deserialize JSON fields
        if (eventLog.getEventData() != null) {
            try {
                dto.setEventData(objectMapper.readValue(eventLog.getEventData(), Map.class));
            } catch (JsonProcessingException e) {
                // Log error but don't fail
                dto.setEventData(Map.of("error", "Failed to deserialize event data"));
            }
        }

        return dto;
    }
}
