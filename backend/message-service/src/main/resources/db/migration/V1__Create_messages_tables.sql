-- Create channels table
CREATE TABLE messages.channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    operation_id UUID NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create channel members table
CREATE TABLE messages.channel_members (
    channel_id UUID NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (channel_id) REFERENCES messages.channels(id) ON DELETE CASCADE,
    PRIMARY KEY (channel_id, user_id)
);

-- Create messages table
CREATE TABLE messages.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID NOT NULL,
    sender_id VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES messages.channels(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_channels_operation_id ON messages.channels(operation_id);
CREATE INDEX idx_channels_type ON messages.channels(type);
CREATE INDEX idx_channels_created_by ON messages.channels(created_by);

CREATE INDEX idx_messages_channel_id ON messages.messages(channel_id);
CREATE INDEX idx_messages_sender_id ON messages.messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages.messages(created_at);
CREATE INDEX idx_messages_priority ON messages.messages(priority);

-- Insert sample data
INSERT INTO messages.channels (name, description, type, operation_id, created_by) VALUES
('General', 'General communication channel', 'GENERAL', 
 (SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1), 'admin'),
('Command', 'Command and control channel', 'COMMAND', 
 (SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1), 'admin');

-- Add sample channel members
INSERT INTO messages.channel_members (channel_id, user_id) VALUES
((SELECT id FROM messages.channels WHERE name = 'General' LIMIT 1), 'admin'),
((SELECT id FROM messages.channels WHERE name = 'General' LIMIT 1), 'unit1'),
((SELECT id FROM messages.channels WHERE name = 'Command' LIMIT 1), 'admin');

-- Insert sample messages
INSERT INTO messages.messages (channel_id, sender_id, sender_name, content, type, priority) VALUES
((SELECT id FROM messages.channels WHERE name = 'General' LIMIT 1), 'admin', 'Admin', 'Operation Thunder is now active. All units report status.', 'TEXT', 'HIGH'),
((SELECT id FROM messages.channels WHERE name = 'General' LIMIT 1), 'unit1', 'Unit 1', 'ALPHA-1 in position and ready.', 'TEXT', 'NORMAL');
