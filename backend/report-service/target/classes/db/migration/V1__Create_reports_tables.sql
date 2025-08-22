-- Create reports table
CREATE TABLE reports.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    operation_id UUID NOT NULL,
    reported_by VARCHAR(255) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    location GEOMETRY(POINT, 4326),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create report data table for template fields
CREATE TABLE reports.report_data (
    report_id UUID NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_value TEXT,
    FOREIGN KEY (report_id) REFERENCES reports.reports(id) ON DELETE CASCADE,
    PRIMARY KEY (report_id, field_name)
);

-- Create report attachments table
CREATE TABLE reports.report_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports.reports(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_reports_operation_id ON reports.reports(operation_id);
CREATE INDEX idx_reports_type ON reports.reports(type);
CREATE INDEX idx_reports_status ON reports.reports(status);
CREATE INDEX idx_reports_reported_by ON reports.reports(reported_by);
CREATE INDEX idx_reports_unit ON reports.reports(unit);
CREATE INDEX idx_reports_created_at ON reports.reports(created_at);
CREATE INDEX idx_reports_location ON reports.reports USING GIST(location);

CREATE INDEX idx_report_attachments_report_id ON reports.report_attachments(report_id);

-- Insert sample data
INSERT INTO reports.reports (type, title, content, operation_id, reported_by, unit, status) VALUES
('SITREP', 'Daily Situation Report - Day 1', 'All units operational and in position. No enemy contact.', 
 (SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1), 'unit1', 'ALPHA-1', 'SUBMITTED'),
('CONREP', 'Civilian Contact Report', 'Encountered group of 5 civilians at checkpoint. Provided assistance and cleared through.', 
 (SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1), 'unit1', 'BRAVO-2', 'SUBMITTED');
