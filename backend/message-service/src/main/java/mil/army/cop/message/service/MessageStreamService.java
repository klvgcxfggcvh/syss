package mil.army.cop.message.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import mil.army.cop.message.dto.WebSocketMessageDto;
import mil.army.cop.message.dto.MessageDto;
import mil.army.cop.message.entity.Channel;
import mil.army.cop.message.entity.Message;
import mil.army.cop.message.repository.ChannelRepository;
import mil.army.cop.message.repository.MessageRepository;
import mil.army.cop.shared.exception.CopException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class MessageStreamService {

    private static final Logger logger = LoggerFactory.getLogger(MessageStreamService.class);

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // Store active WebSocket sessions by operation ID
    private final Map<UUID, CopyOnWriteArrayList<WebSocketSession>> operationSessions = new ConcurrentHashMap<>();

    public void addSession(UUID operationId, WebSocketSession session) {
        operationSessions.computeIfAbsent(operationId, k -> new CopyOnWriteArrayList<>()).add(session);
        logger.info("Added WebSocket session for operation {}: {}", operationId, session.getId());
    }

    public void removeSession(UUID operationId, WebSocketSession session) {
        CopyOnWriteArrayList<WebSocketSession> sessions = operationSessions.get(operationId);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                operationSessions.remove(operationId);
            }
        }
        logger.info("Removed WebSocket session for operation {}: {}", operationId, session.getId());
    }

    public void processMessage(UUID operationId, WebSocketSession senderSession, WebSocketMessageDto messageDto) {
        try {
            // Find the appropriate channel (for now, use general channel)
            Channel channel = channelRepository.findByOperationIdAndType(operationId, Channel.ChannelType.GENERAL)
                    .stream()
                    .findFirst()
                    .orElseThrow(() -> new CopException("No general channel found for operation", "CHANNEL_NOT_FOUND"));

            // Create and save the message
            Message message = new Message(
                    channel,
                    messageDto.getSenderId(),
                    messageDto.getSenderName(),
                    messageDto.getContent(),
                    Message.MessageType.TEXT,
                    Message.MessagePriority.NORMAL
            );

            Message savedMessage = messageRepository.save(message);

            // Create response DTO
            MessageDto responseDto = convertToMessageDto(savedMessage);

            // Broadcast to all sessions in this operation
            broadcastToOperation(operationId, "new_message", responseDto);

        } catch (Exception e) {
            logger.error("Failed to process message for operation {}: {}", operationId, e.getMessage());
            throw new CopException("Failed to process message", "MESSAGE_PROCESSING_FAILED");
        }
    }

    public void broadcastToOperation(UUID operationId, String eventType, Object data) {
        CopyOnWriteArrayList<WebSocketSession> sessions = operationSessions.get(operationId);
        if (sessions != null && !sessions.isEmpty()) {
            WebSocketMessageDto broadcastMessage = new WebSocketMessageDto();
            broadcastMessage.setType(eventType);
            broadcastMessage.setData(data);
            broadcastMessage.setTimestamp(LocalDateTime.now());

            sessions.removeIf(session -> {
                try {
                    if (session.isOpen()) {
                        String json = objectMapper.writeValueAsString(broadcastMessage);
                        session.sendMessage(new TextMessage(json));
                        return false; // Keep session
                    } else {
                        return true; // Remove closed session
                    }
                } catch (IOException e) {
                    logger.warn("Failed to send message to WebSocket session, removing: {}", e.getMessage());
                    return true; // Remove failed session
                }
            });
        }
    }

    public void broadcastSystemMessage(UUID operationId, String content) {
        WebSocketMessageDto systemMessage = new WebSocketMessageDto();
        systemMessage.setType("system");
        systemMessage.setContent(content);
        systemMessage.setTimestamp(LocalDateTime.now());

        broadcastToOperation(operationId, "system_message", systemMessage);
    }

    private MessageDto convertToMessageDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setChannelId(message.getChannel().getId());
        dto.setSenderId(message.getSenderId());
        dto.setSenderName(message.getSenderName());
        dto.setContent(message.getContent());
        dto.setType(message.getType());
        dto.setPriority(message.getPriority());
        dto.setIsEdited(message.getIsEdited());
        dto.setEditedAt(message.getEditedAt());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
}
