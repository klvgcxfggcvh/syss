-- Create users table
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keycloak_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    rank VARCHAR(50) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user roles table
CREATE TABLE auth.user_roles (
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role)
);

-- Create indexes
CREATE INDEX idx_users_keycloak_id ON auth.users(keycloak_id);
CREATE INDEX idx_users_username ON auth.users(username);
CREATE INDEX idx_users_unit ON auth.users(unit);
CREATE INDEX idx_users_active ON auth.users(active);
CREATE INDEX idx_user_roles_role ON auth.user_roles(role);

-- Insert sample data
INSERT INTO auth.users (keycloak_id, username, email, first_name, last_name, rank, unit) VALUES
('kc-001', 'admin', 'admin@army.mil', 'John', 'Smith', 'COL', 'HQ'),
('kc-002', 'unit1', 'unit1@army.mil', 'Jane', 'Doe', 'MAJ', 'ALPHA'),
('kc-003', 'observer1', 'observer1@army.mil', 'Bob', 'Johnson', 'CPT', 'BRAVO');

INSERT INTO auth.user_roles (user_id, role) VALUES
((SELECT id FROM auth.users WHERE username = 'admin'), 'ROLE_HQ'),
((SELECT id FROM auth.users WHERE username = 'unit1'), 'ROLE_UNIT'),
((SELECT id FROM auth.users WHERE username = 'observer1'), 'ROLE_OBSERVER');
