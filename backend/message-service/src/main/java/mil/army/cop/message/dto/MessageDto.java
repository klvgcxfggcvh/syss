package mil.army.cop.message.dto;

import mil.army.cop.message.entity.Message;
import mil.army.cop.shared.dto.BaseDto;

import java.time.LocalDateTime;
import java.util.UUID;

public class MessageDto extends BaseDto {
    private UUID channelId;
    private String senderId;
    private String senderName;
    private String content;
    private Message.MessageType type;
    private Message.MessagePriority priority;
    private Boolean isEdited;
    private LocalDateTime editedAt;

    // Constructors
    public MessageDto() {}

    // Getters and Setters
    public UUID getChannelId() { return channelId; }
    public void setChannelId(UUID channelId) { this.channelId = channelId; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Message.MessageType getType() { return type; }
    public void setType(Message.MessageType type) { this.type = type; }

    public Message.MessagePriority getPriority() { return priority; }
    public void setPriority(Message.MessagePriority priority) { this.priority = priority; }

    public Boolean getIsEdited() { return isEdited; }
    public void setIsEdited(Boolean isEdited) { this.isEdited = isEdited; }

    public LocalDateTime getEditedAt() { return editedAt; }
    public void setEditedAt(LocalDateTime editedAt) { this.editedAt = editedAt; }
}
