-- Create event_log table
CREATE TABLE replay.event_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operation_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    event_data JSONB,
    previous_state JSONB,
    new_state JSONB,
    location GEOMETRY(GEOMETRY, 4326),
    severity VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AAR reports table
CREATE TABLE replay.aar_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operation_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    key_events TEXT,
    lessons_learned TEXT,
    recommendations TEXT,
    statistics JSONB,
    analysis_start_time TIMESTAMP NOT NULL,
    analysis_end_time TIMESTAMP NOT NULL,
    generated_by VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for event_log
CREATE INDEX idx_event_log_operation_id ON replay.event_log(operation_id);
CREATE INDEX idx_event_log_timestamp ON replay.event_log(timestamp);
CREATE INDEX idx_event_log_event_type ON replay.event_log(event_type);
CREATE INDEX idx_event_log_entity_type ON replay.event_log(entity_type);
CREATE INDEX idx_event_log_entity_id ON replay.event_log(entity_id);
CREATE INDEX idx_event_log_user_id ON replay.event_log(user_id);
CREATE INDEX idx_event_log_severity ON replay.event_log(severity);
CREATE INDEX idx_event_log_location ON replay.event_log USING GIST(location);
CREATE INDEX idx_event_log_operation_timestamp ON replay.event_log(operation_id, timestamp);

-- Create indexes for AAR reports
CREATE INDEX idx_aar_reports_operation_id ON replay.aar_reports(operation_id);
CREATE INDEX idx_aar_reports_status ON replay.aar_reports(status);
CREATE INDEX idx_aar_reports_generated_by ON replay.aar_reports(generated_by);
CREATE INDEX idx_aar_reports_created_at ON replay.aar_reports(created_at);

-- Insert sample event log data
INSERT INTO replay.event_log (operation_id, event_type, entity_type, entity_id, user_id, user_name, action, description, severity) VALUES
((SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1), 'OPERATION_STARTED', 'Operation', 
 (SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1)::text, 'admin', 'Admin', 'START', 'Operation Thunder has been started', 'INFO'),
((SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1), 'UNIT_MOVEMENT', 'Unit', 'ALPHA-1', 'unit1', 'Unit 1', 'MOVE', 'Unit moved to new position', 'INFO'),
((SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1), 'TASK_CREATED', 'Task', 
 (SELECT id FROM tasks.tasks WHERE title = 'Secure Checkpoint Alpha' LIMIT 1)::text, 'admin', 'Admin', 'CREATE', 'New task assigned to ALPHA-1', 'INFO'),
((SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1), 'REPORT_SUBMITTED', 'Report', 
 (SELECT id FROM reports.reports WHERE title LIKE 'Daily Situation Report%' LIMIT 1)::text, 'unit1', 'Unit 1', 'SUBMIT', 'SITREP submitted', 'INFO');

-- Insert sample AAR report
INSERT INTO replay.aar_reports (operation_id, title, summary, analysis_start_time, analysis_end_time, generated_by, status) VALUES
((SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1), 'Operation Thunder AAR', 
 'After Action Review for Operation Thunder training exercise', 
 CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP, 'admin', 'DRAFT');
