# Army Common Operational Picture (COP) Backend

A comprehensive microservices-based backend system for military Common Operational Picture applications, built with Spring Boot and designed for high availability, security, and real-time operations.

## 🏗️ Architecture

### Microservices
- **auth-service** (8081) - User authentication and management with Keycloak integration
- **ops-service** (8082) - Operations and unit management with PostGIS spatial data
- **task-service** (8084) - Task lifecycle management and assignment
- **report-service** (8085) - SITREP/CONREP generation with file handling
- **message-service** (8086) - Real-time messaging and chat functionality
- **replay-service** (8087) - Event logging and After Action Review (AAR)

### Technology Stack
- **Framework**: Spring Boot 3.1.x
- **Database**: PostgreSQL 15 with PostGIS extension
- **Security**: Keycloak OIDC/OAuth2 with JWT tokens
- **Real-time**: WebSockets and Server-Sent Events (SSE)
- **Containerization**: Docker and Kubernetes
- **Testing**: JUnit 5, TestContainers, MockMvc

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- Docker & Docker Compose
- kubectl (for Kubernetes deployment)

### Local Development

1. **Clone and setup**:
   \`\`\`bash
   git clone <repository-url>
   cd backend
   \`\`\`

2. **Start infrastructure**:
   \`\`\`bash
   docker-compose up -d postgres keycloak
   \`\`\`

3. **Build and run services**:
   \`\`\`bash
   ./build-all.sh
   ./run-dev.sh
   \`\`\`

4. **Access services**:
   - API Gateway: http://localhost:8080
   - Keycloak Admin: http://localhost:8080/auth (admin/admin)
   - Swagger UI: http://localhost:8081/swagger-ui.html

### Production Deployment

1. **Deploy to Kubernetes**:
   \`\`\`bash
   ./scripts/deploy.sh
   \`\`\`

2. **Access via Ingress**:
   - API: http://army-cop-api.local
   - Documentation: http://army-cop-api.local/swagger-ui.html

## 🧪 Testing

### Run All Tests
\`\`\`bash
./scripts/test-all.sh
\`\`\`

### Individual Test Types
\`\`\`bash
# Unit tests
mvn test

# Integration tests
mvn verify -Dspring.profiles.active=test

# Security tests
./test-security.sh
\`\`\`

## 📊 Monitoring & Observability

### Health Checks
All services expose health endpoints:
- `/actuator/health` - Overall health status
- `/actuator/health/readiness` - Kubernetes readiness probe
- `/actuator/health/liveness` - Kubernetes liveness probe

### Metrics
Prometheus metrics available at `/actuator/prometheus`

### API Documentation
OpenAPI 3.0 documentation available at `/swagger-ui.html` for each service

## 🔒 Security

### Authentication & Authorization
- **OIDC/OAuth2** integration with Keycloak
- **JWT tokens** for stateless authentication
- **Role-based access control** (HQ, UNIT, OBSERVER)
- **Method-level security** with @PreAuthorize

### Security Features
- CORS configuration for frontend integration
- WebSocket security with token validation
- Database connection encryption
- Container security scanning with Trivy

## 🗄️ Database Schema

### Core Tables
- **users** - User profiles and roles
- **operations** - Military operations with AOI geometry
- **units** - Military units with position tracking
- **tasks** - Task assignments and status tracking
- **reports** - SITREP/CONREP with templates
- **messages** - Chat messages per operation
- **event_log** - All system events for replay/AAR

### Spatial Data
PostGIS extensions enable:
- Geographic operations and unit positions
- Area of Interest (AOI) polygon storage
- Spatial queries and proximity analysis

## 🔄 Real-time Features

### Server-Sent Events (SSE)
- **Blue Force Tracking**: `/api/ops/{id}/stream/positions`
- **Operation Events**: `/api/ops/{id}/stream/events`

### WebSockets
- **Per-operation Chat**: `/ws/{operationId}`
- **Real-time Notifications**: `/ws/notifications`

## 📁 Project Structure

\`\`\`
backend/
├── shared/                 # Common utilities and configurations
├── auth-service/          # Authentication service
├── ops-service/           # Operations management
├── task-service/          # Task management
├── report-service/        # Report generation
├── message-service/       # Messaging and chat
├── replay-service/        # Event logging and AAR
├── k8s/                   # Kubernetes manifests
├── scripts/               # Deployment and utility scripts
├── keycloak/             # Keycloak realm configuration
└── docker-compose.yml    # Local development setup
\`\`\`

## 🛠️ Development

### Adding New Services
1. Create service directory with Maven structure
2. Add to parent `pom.xml`
3. Create Dockerfile
4. Add to `docker-compose.yml`
5. Create Kubernetes manifests
6. Update build scripts

### Database Migrations
Each service uses Flyway for database migrations:
\`\`\`
src/main/resources/db/migration/
├── V1__Create_initial_tables.sql
├── V2__Add_indexes.sql
└── V3__Insert_sample_data.sql
\`\`\`

### Testing Strategy
- **Unit Tests**: Service and controller layer testing
- **Integration Tests**: Full application context with TestContainers
- **API Tests**: REST endpoint testing with MockMvc
- **Security Tests**: Authentication and authorization validation

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Issues**:
   \`\`\`bash
   # Check PostgreSQL status
   docker-compose ps postgres
   
   # View logs
   docker-compose logs postgres
   \`\`\`

2. **Keycloak Authentication Issues**:
   \`\`\`bash
   # Reset Keycloak admin password
   docker-compose exec keycloak /opt/keycloak/bin/kc.sh export --realm army-cop
   \`\`\`

3. **Service Discovery Issues**:
   \`\`\`bash
   # Check service health
   curl http://localhost:8081/actuator/health
   \`\`\`

### Logs and Debugging
\`\`\`bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-service

# Enable debug logging
export SPRING_PROFILES_ACTIVE=debug
\`\`\`

## 📈 Performance Tuning

### Database Optimization
- Connection pooling with HikariCP
- Database indexes on frequently queried columns
- PostGIS spatial indexes for geographic queries

### JVM Tuning
\`\`\`bash
# Production JVM settings
JAVA_OPTS="-Xms512m -Xmx1g -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above
