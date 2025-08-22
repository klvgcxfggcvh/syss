-- Create tasks table
CREATE TABLE tasks.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    operation_id UUID NOT NULL,
    assigned_to_unit VARCHAR(100) NOT NULL,
    assigned_by VARCHAR(255) NOT NULL,
    location GEOMETRY(GEOMETRY, 4326),
    due_date TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create task updates table
CREATE TABLE tasks.task_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    updated_by VARCHAR(255) NOT NULL,
    comment TEXT,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks.tasks(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_tasks_operation_id ON tasks.tasks(operation_id);
CREATE INDEX idx_tasks_assigned_to_unit ON tasks.tasks(assigned_to_unit);
CREATE INDEX idx_tasks_status ON tasks.tasks(status);
CREATE INDEX idx_tasks_priority ON tasks.tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks.tasks(due_date);
CREATE INDEX idx_tasks_location ON tasks.tasks USING GIST(location);

CREATE INDEX idx_task_updates_task_id ON tasks.task_updates(task_id);
CREATE INDEX idx_task_updates_created_at ON tasks.task_updates(created_at);

-- Insert sample data
INSERT INTO tasks.tasks (title, description, status, priority, operation_id, assigned_to_unit, assigned_by, due_date) VALUES
('Secure Checkpoint Alpha', 'Establish and maintain security checkpoint at grid 123456', 'ASSIGNED', 'HIGH', 
 (SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1), 'ALPHA-1', 'admin', CURRENT_TIMESTAMP + INTERVAL '2 hours'),
('Patrol Route Bravo', 'Conduct patrol along designated route Bravo', 'IN_PROGRESS', 'MEDIUM',
 (SELECT id FROM ops.operations WHERE name = 'Operation Thunder' LIMIT 1), 'BRAVO-2', 'admin', CURRENT_TIMESTAMP + INTERVAL '4 hours');
