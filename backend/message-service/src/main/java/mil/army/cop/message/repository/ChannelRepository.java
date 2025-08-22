package mil.army.cop.message.repository;

import mil.army.cop.message.entity.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, UUID> {
    List<Channel> findByOperationId(UUID operationId);
    List<Channel> findByOperationIdAndType(UUID operationId, Channel.ChannelType type);
    List<Channel> findByCreatedBy(String createdBy);
}
