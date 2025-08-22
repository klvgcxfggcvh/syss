package mil.army.cop.message.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import mil.army.cop.message.dto.WebSocketMessageDto;
import mil.army.cop.message.service.MessageStreamService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ChatWebSocketHandler implements WebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(ChatWebSocketHandler.class);
    private static final Pattern OPERATION_ID_PATTERN = Pattern.compile("/ws/([^/]+)");

    @Autowired
    private MessageStreamService messageStreamService;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        if (!validateWebSocketAuth(session)) {
            logger.warn("Unauthorized WebSocket connection attempt");
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }

        UUID operationId = extractOperationId(session);
        if (operationId != null) {
            messageStreamService.addSession(operationId, session);
            logger.info("WebSocket connection established for operation: {}, session: {}", 
                       operationId, session.getId());
            
            // Send welcome message
            WebSocketMessageDto welcomeMessage = new WebSocketMessageDto();
            welcomeMessage.setType("system");
            welcomeMessage.setContent("Connected to operation chat: " + operationId);
            welcomeMessage.setTimestamp(java.time.LocalDateTime.now());
            
            sendMessage(session, welcomeMessage);
        } else {
            logger.warn("Invalid WebSocket connection - no operation ID found");
            session.close(CloseStatus.BAD_DATA);
        }
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        UUID operationId = extractOperationId(session);
        if (operationId == null) {
            return;
        }

        try {
            String payload = message.getPayload().toString();
            WebSocketMessageDto messageDto = objectMapper.readValue(payload, WebSocketMessageDto.class);
            
            // Process the message through the service
            messageStreamService.processMessage(operationId, session, messageDto);
            
        } catch (Exception e) {
            logger.error("Error processing WebSocket message: {}", e.getMessage());
            
            WebSocketMessageDto errorMessage = new WebSocketMessageDto();
            errorMessage.setType("error");
            errorMessage.setContent("Failed to process message: " + e.getMessage());
            errorMessage.setTimestamp(java.time.LocalDateTime.now());
            
            sendMessage(session, errorMessage);
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        logger.error("WebSocket transport error for session {}: {}", session.getId(), exception.getMessage());
        UUID operationId = extractOperationId(session);
        if (operationId != null) {
            messageStreamService.removeSession(operationId, session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        UUID operationId = extractOperationId(session);
        if (operationId != null) {
            messageStreamService.removeSession(operationId, session);
            logger.info("WebSocket connection closed for operation: {}, session: {}, status: {}", 
                       operationId, session.getId(), closeStatus);
        }
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    private UUID extractOperationId(WebSocketSession session) {
        try {
            URI uri = session.getUri();
            if (uri != null) {
                Matcher matcher = OPERATION_ID_PATTERN.matcher(uri.getPath());
                if (matcher.find()) {
                    return UUID.fromString(matcher.group(1));
                }
            }
        } catch (Exception e) {
            logger.error("Failed to extract operation ID from WebSocket session: {}", e.getMessage());
        }
        return null;
    }

    private void sendMessage(WebSocketSession session, WebSocketMessageDto message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            session.sendMessage(new TextMessage(json));
        } catch (IOException e) {
            logger.error("Failed to send WebSocket message: {}", e.getMessage());
        }
    }

    private boolean validateWebSocketAuth(WebSocketSession session) {
        try {
            // Extract JWT token from query parameters or headers
            String token = extractTokenFromSession(session);
            if (token != null) {
                // In a real implementation, you would validate the JWT token here
                // For now, we'll accept any non-empty token
                return !token.isEmpty();
            }
        } catch (Exception e) {
            logger.error("Error validating WebSocket authentication: {}", e.getMessage());
        }
        return false;
    }

    private String extractTokenFromSession(WebSocketSession session) {
        // Try to get token from query parameters
        String query = session.getUri().getQuery();
        if (query != null && query.contains("token=")) {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("token=")) {
                    return param.substring(6); // Remove "token=" prefix
                }
            }
        }
        
        // Try to get token from headers
        List<String> authHeaders = session.getHandshakeHeaders().get("Authorization");
        if (authHeaders != null && !authHeaders.isEmpty()) {
            String authHeader = authHeaders.get(0);
            if (authHeader.startsWith("Bearer ")) {
                return authHeader.substring(7); // Remove "Bearer " prefix
            }
        }
        
        return null;
    }
}
