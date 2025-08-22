-- Create databases for each service
CREATE DATABASE keycloak;
CREATE DATABASE army_cop;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE keycloak TO cop_user;
GRANT ALL PRIVILEGES ON DATABASE army_cop TO cop_user;

-- Connect to army_cop database and enable PostGIS
\c army_cop;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas for each service
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS ops;
CREATE SCHEMA IF NOT EXISTS cop;
CREATE SCHEMA IF NOT EXISTS tasks;
CREATE SCHEMA IF NOT EXISTS reports;
CREATE SCHEMA IF NOT EXISTS messages;
CREATE SCHEMA IF NOT EXISTS replay;

-- Grant schema permissions
GRANT ALL ON SCHEMA auth TO cop_user;
GRANT ALL ON SCHEMA ops TO cop_user;
GRANT ALL ON SCHEMA cop TO cop_user;
GRANT ALL ON SCHEMA tasks TO cop_user;
GRANT ALL ON SCHEMA reports TO cop_user;
GRANT ALL ON SCHEMA messages TO cop_user;
GRANT ALL ON SCHEMA replay TO cop_user;
