package mil.army.cop.message.repository;

import mil.army.cop.message.entity.Message;
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
public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByChannelIdOrderByCreatedAtAsc(UUID channelId);
    Page<Message> findByChannelIdOrderByCreatedAtDesc(UUID channelId, Pageable pageable);
    List<Message> findBySenderIdOrderByCreatedAtDesc(String senderId);
    
    @Query("SELECT m FROM Message m WHERE m.channel.id = :channelId AND m.createdAt > :since ORDER BY m.createdAt ASC")
    List<Message> findRecentMessages(@Param("channelId") UUID channelId, @Param("since") LocalDateTime since);
}
