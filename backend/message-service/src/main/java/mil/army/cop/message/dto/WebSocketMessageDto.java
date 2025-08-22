package mil.army.cop.message.dto;

import java.time.LocalDateTime;

public class WebSocketMessageDto {
    private String type;
    private String senderId;
    private String senderName;
    private String content;
    private Object data;
    private LocalDateTime timestamp;

    // Constructors
    public WebSocketMessageDto() {}

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
