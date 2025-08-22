package mil.army.cop.replay.repository;

import mil.army.cop.replay.entity.EventLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventLogRepository extends JpaRepository<EventLog, UUID> {
    
    List<EventLog> findByOperationIdOrderByTimestampAsc(UUID operationId);
    
    List<EventLog> findByOperationIdAndTimestampBetweenOrderByTimestampAsc(
            UUID operationId, LocalDateTime startTime, LocalDateTime endTime);
    
    List<EventLog> findByOperationIdAndEventTypeOrderByTimestampAsc(
            UUID operationId, EventLog.EventType eventType);
    
    List<EventLog> findByOperationIdAndEntityTypeOrderByTimestampAsc(
            UUID operationId, String entityType);
    
    List<EventLog> findByOperationIdAndUserIdOrderByTimestampAsc(
            UUID operationId, String userId);
    
    Page<EventLog> findByOperationIdOrderByTimestampDesc(UUID operationId, Pageable pageable);
    
    @Query("SELECT e FROM EventLog e WHERE e.operationId = :operationId " +
           "AND e.timestamp BETWEEN :startTime AND :endTime " +
           "AND (:eventType IS NULL OR e.eventType = :eventType) " +
           "AND (:entityType IS NULL OR e.entityType = :entityType) " +
           "ORDER BY e.timestamp ASC")
    List<EventLog> findEventsWithFilters(
            @Param("operationId") UUID operationId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("eventType") EventLog.EventType eventType,
            @Param("entityType") String entityType);
    
    @Query("SELECT COUNT(e) FROM EventLog e WHERE e.operationId = :operationId AND e.eventType = :eventType")
    Long countByOperationIdAndEventType(@Param("operationId") UUID operationId, 
                                       @Param("eventType") EventLog.EventType eventType);
    
    @Query("SELECT e.eventType, COUNT(e) FROM EventLog e WHERE e.operationId = :operationId GROUP BY e.eventType")
    List<Object[]> getEventTypeStatistics(@Param("operationId") UUID operationId);
}
