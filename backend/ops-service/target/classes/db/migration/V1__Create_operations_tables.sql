-- Create operations table
CREATE TABLE ops.operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    area_of_interest GEOMETRY(POLYGON, 4326),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    commander_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create operation units table
CREATE TABLE ops.operation_units (
    operation_id UUID NOT NULL,
    unit_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (operation_id) REFERENCES ops.operations(id) ON DELETE CASCADE,
    PRIMARY KEY (operation_id, unit_id)
);

-- Create units table
CREATE TABLE ops.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_sign VARCHAR(100) UNIQUE NOT NULL,
    unit_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    position GEOMETRY(POINT, 4326) NOT NULL,
    heading DOUBLE PRECISION,
    speed DOUBLE PRECISION,
    last_update TIMESTAMP NOT NULL,
    commander_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_operations_status ON ops.operations(status);
CREATE INDEX idx_operations_commander ON ops.operations(commander_id);
CREATE INDEX idx_operations_start_time ON ops.operations(start_time);
CREATE INDEX idx_operations_aoi ON ops.operations USING GIST(area_of_interest);

CREATE INDEX idx_units_call_sign ON ops.units(call_sign);
CREATE INDEX idx_units_status ON ops.units(status);
CREATE INDEX idx_units_commander ON ops.units(commander_id);
CREATE INDEX idx_units_position ON ops.units USING GIST(position);
CREATE INDEX idx_units_last_update ON ops.units(last_update);

-- Insert sample data
INSERT INTO ops.operations (name, description, status, start_time, commander_id) VALUES
('Operation Thunder', 'Training exercise in sector Alpha', 'ACTIVE', CURRENT_TIMESTAMP, 'admin'),
('Operation Shield', 'Defensive operations in sector Bravo', 'PLANNING', CURRENT_TIMESTAMP + INTERVAL '1 day', 'admin');

INSERT INTO ops.units (call_sign, unit_type, status, position, commander_id, last_update) VALUES
('ALPHA-1', 'Infantry', 'FRIENDLY', ST_GeomFromText('POINT(38.9072 -77.0369)', 4326), 'unit1', CURRENT_TIMESTAMP),
('BRAVO-2', 'Armor', 'FRIENDLY', ST_GeomFromText('POINT(38.9100 -77.0400)', 4326), 'unit1', CURRENT_TIMESTAMP),
('CHARLIE-3', 'Artillery', 'FRIENDLY', ST_GeomFromText('POINT(38.9050 -77.0350)', 4326), 'unit1', CURRENT_TIMESTAMP);
