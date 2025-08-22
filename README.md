# Army Common Operational Picture (COP) System

A comprehensive military command and control system built with React frontend and Java Spring Boot microservices backend, designed for real-time situational awareness, operations management, and tactical coordination.

## 🏗️ System Architecture

### Frontend (React + TypeScript + Next.js)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand with persistence
- **Maps**: Leaflet with NATO symbology
- **Real-time**: WebSockets + Server-Sent Events
- **Offline**: IndexedDB with background sync
- **PWA**: Service worker for offline capabilities

### Backend (Java Spring Boot Microservices)
- **Framework**: Spring Boot 3.2 with Java 17
- **Database**: PostgreSQL with PostGIS extension
- **Security**: Keycloak OIDC/OAuth2 with JWT
- **Real-time**: WebSocket + SSE streaming
- **Documentation**: OpenAPI 3.0 (Swagger)
- **Testing**: JUnit 5 + Testcontainers
- **Deployment**: Docker + Kubernetes

## 📁 Project Structure

\`\`\`
army-cop-system/
├── frontend/                    # React Next.js application
│   ├── app/                    # Next.js app router pages
│   ├── components/             # React components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Main dashboard layout
│   │   ├── map/               # Map and geospatial components
│   │   ├── operations/        # Operations management
│   │   ├── tasking/           # Task assignment and tracking
│   │   ├── reports/           # SITREP, CONREP, INTSUM reports
│   │   ├── messaging/         # Real-time chat and messaging
│   │   ├── replay/            # Historical data replay and AAR
│   │   └── ui/                # shadcn/ui base components
│   ├── services/              # API and external service clients
│   ├── store/                 # Zustand state management
│   ├── lib/                   # Utility functions and helpers
│   └── public/                # Static assets and PWA files
└── backend/                    # Java Spring Boot microservices
    ├── shared/                # Common utilities and DTOs
    ├── auth-service/          # User authentication and authorization
    ├── ops-service/           # Operations and unit management
    ├── cop-service/           # Map layers and spatial data
    ├── task-service/          # Task lifecycle management
    ├── report-service/        # Military reports (SITREP, CONREP)
    ├── message-service/       # Real-time messaging and chat
    ├── replay-service/        # Event logging and AAR
    ├── keycloak/              # Identity provider configuration
    └── k8s/                   # Kubernetes deployment manifests
\`\`\`

## 🚀 Features Overview

### 1. Authentication & Authorization
- **Keycloak Integration**: OIDC/OAuth2 with JWT tokens
- **Role-Based Access**: HQ, Unit, Observer roles with different permissions
- **Multi-language Support**: English and Amharic (አማርኛ)
- **Calendar System**: Gregorian and Ethiopian calendar support

### 2. Interactive Map System
- **Leaflet Integration**: High-performance web mapping
- **NATO Symbology**: Military unit symbols and tactical graphics
- **Layer Management**: Toggle visibility of different data layers
- **Drawing Tools**: Create and edit tactical overlays
- **Measurement Tools**: Distance and area calculations
- **Real-time Updates**: Live position tracking and feature updates

### 3. Operations Management
- **Operation CRUD**: Create, read, update, delete operations
- **Area of Interest (AOI)**: Define operational boundaries
- **Unit Assignment**: Assign units to operations
- **Status Tracking**: Monitor operation progress and status
- **Geospatial Data**: PostGIS integration for spatial queries

### 4. Tasking System
- **Task Assignment**: HQ assigns tasks to units
- **Status Workflow**: ASSIGNED → IN_PROGRESS → DONE
- **Geographical Tasks**: Location-based mission assignments
- **Progress Tracking**: Real-time status updates
- **Priority Management**: High, Medium, Low priority levels

### 5. Reports & Documentation
- **SITREP**: Situation Reports with standardized templates
- **CONREP**: Contact Reports for enemy/civilian encounters
- **INTSUM**: Intelligence Summary reports
- **File Attachments**: Upload and manage report documents
- **Report History**: Search and filter historical reports

### 6. Real-time Messaging
- **Per-Operation Chat**: Dedicated channels for each operation
- **Direct Messages**: Private communication between users
- **Group Conversations**: Multi-user chat rooms
- **Message Status**: Delivered, read receipts
- **WebSocket Integration**: Real-time message delivery

### 7. Replay & After Action Review (AAR)
- **Event Logging**: Comprehensive activity tracking
- **Timeline Playback**: Scrub through historical data
- **Event Filtering**: Filter by type, time range, entity
- **AAR Reports**: Automated performance analysis
- **Lessons Learned**: Extract insights from operations

### 8. Offline Capabilities
- **IndexedDB Storage**: Local data persistence
- **Background Sync**: Automatic synchronization when online
- **Offline Actions**: Queue operations for later sync
- **PWA Features**: Install as native app
- **Service Worker**: Cache management and offline functionality

## 🛠️ Technical Implementation

### Frontend Architecture

#### State Management (Zustand)
\`\`\`typescript
// Example: Map Store
interface MapState {
  activeFeatures: MapFeature[]
  selectedFeature: MapFeature | null
  drawingMode: DrawingMode
  addFeature: (feature: MapFeature) => void
  updateFeature: (id: string, updates: Partial<MapFeature>) => void
  removeFeature: (id: string) => void
}
\`\`\`

#### Real-time Services
\`\`\`typescript
// WebSocket + SSE Integration
class RealtimeService {
  private eventSource: EventSource | null = null
  private websocket: WebSocket | null = null
  
  connect() {
    this.connectSSE()      // Position updates
    this.connectWebSocket() // Chat messages
  }
}
\`\`\`

#### Offline Storage
\`\`\`typescript
// IndexedDB with automatic sync
class IndexedDBService {
  async saveFeatures(features: MapFeature[], operationId: string)
  async getFeatures(operationId: string): Promise<MapFeature[]>
  async addOfflineAction(action: OfflineAction)
}
\`\`\`

### Backend Architecture

#### Microservices Design
Each service is independently deployable with:
- **Spring Boot 3.2**: Modern Java framework
- **PostgreSQL**: Relational database with PostGIS
- **Flyway**: Database migration management
- **Docker**: Containerized deployment
- **Kubernetes**: Orchestration and scaling

#### Security Implementation
\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        return http
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/ops/**").hasRole("HQ")
                .requestMatchers("/api/tasks/**").hasAnyRole("HQ", "UNIT")
                .anyRequest().authenticated()
            )
            .build();
    }
}
\`\`\`

#### Real-time Streaming
\`\`\`java
// Server-Sent Events for position updates
@GetMapping(value = "/stream/positions", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter streamPositions(@PathVariable String operationId) {
    return unitStreamService.createPositionStream(operationId);
}

// WebSocket for chat messages
@MessageMapping("/chat/{operationId}")
public void handleChatMessage(@DestinationVariable String operationId, 
                             WebSocketMessageDto message) {
    messageStreamService.broadcastMessage(operationId, message);
}
\`\`\`

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts and profiles
- **operations**: Military operations with AOI geometry
- **units**: Military units with current positions
- **tasks**: Task assignments and status tracking
- **reports**: SITREP, CONREP, and other military reports
- **messages**: Chat messages and conversations
- **event_log**: Comprehensive activity logging for replay

### Spatial Data (PostGIS)
\`\`\`sql
-- Operations with Area of Interest
CREATE TABLE operations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    aoi_geometry GEOMETRY(POLYGON, 4326),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Units with real-time positions
CREATE TABLE units (
    id UUID PRIMARY KEY,
    operation_id UUID REFERENCES operations(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    current_position GEOMETRY(POINT, 4326),
    last_update TIMESTAMP,
    status VARCHAR(50)
);
\`\`\`

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** for frontend development
- **Java 17+** for backend development
- **Docker & Docker Compose** for local development
- **PostgreSQL 15+** with PostGIS extension

### Frontend Setup
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

### Backend Setup
\`\`\`bash
# Start infrastructure (PostgreSQL, Keycloak)
cd backend
docker-compose up -d postgres keycloak

# Build all services
./build-all.sh

# Run all services
./run-dev.sh

# Run tests
./test-all.sh
\`\`\`

### Environment Variables
\`\`\`bash
# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8081
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Backend (application.properties)
spring.datasource.url=jdbc:postgresql://localhost:5432/army_cop
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8081/realms/army-cop
\`\`\`

## 🔧 Development Workflow

### Adding New Features
1. **Frontend**: Create components in appropriate directories
2. **Backend**: Add endpoints to relevant microservices
3. **Database**: Create Flyway migrations for schema changes
4. **Tests**: Add unit and integration tests
5. **Documentation**: Update OpenAPI specifications

### Code Organization
- **Components**: Organized by feature (map, operations, tasking, etc.)
- **Services**: API clients and external integrations
- **Stores**: Zustand state management with persistence
- **Types**: TypeScript interfaces and type definitions

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress for E2E testing
- **Component Tests**: Storybook for UI components

### Backend Testing
\`\`\`java
@SpringBootTest
@Testcontainers
class OperationServiceIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgis/postgis:15-3.3")
            .withDatabaseName("test_army_cop")
            .withUsername("test")
            .withPassword("test");
}
\`\`\`

## 🚀 Deployment

### Docker Deployment
\`\`\`bash
# Build all services
docker-compose build

# Deploy full stack
docker-compose up -d
\`\`\`

### Kubernetes Deployment
\`\`\`bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n army-cop
\`\`\`

### Production Considerations
- **Load Balancing**: NGINX or cloud load balancer
- **SSL/TLS**: Certificate management with Let's Encrypt
- **Monitoring**: Prometheus + Grafana for metrics
- **Logging**: ELK stack for centralized logging
- **Backup**: Automated PostgreSQL backups

## 🔒 Security Features

### Authentication Flow
1. User authenticates with Keycloak
2. Keycloak issues JWT token
3. Frontend stores token securely
4. Backend validates JWT on each request
5. Role-based authorization enforced

### Data Protection
- **Encryption**: TLS 1.3 for data in transit
- **JWT Security**: Short-lived tokens with refresh
- **CORS**: Configured for frontend domain only
- **Input Validation**: Comprehensive request validation
- **SQL Injection**: Parameterized queries and JPA

## 📊 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Service worker for offline caching
- **Bundle Analysis**: Webpack bundle analyzer

### Backend Optimizations
- **Connection Pooling**: HikariCP for database connections
- **Caching**: Redis for session and data caching
- **Indexing**: Database indexes for spatial queries
- **Pagination**: Cursor-based pagination for large datasets

## 🔍 Monitoring & Observability

### Application Metrics
- **Response Times**: API endpoint performance
- **Error Rates**: 4xx/5xx error tracking
- **User Activity**: Feature usage analytics
- **System Resources**: CPU, memory, disk usage

### Logging Strategy
\`\`\`java
// Structured logging with correlation IDs
@Slf4j
@RestController
public class OperationController {
    @GetMapping("/operations/{id}")
    public ResponseEntity<OperationDto> getOperation(@PathVariable String id) {
        MDC.put("operationId", id);
        log.info("Fetching operation details");
        // ... implementation
    }
}
\`\`\`

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow ESLint/Prettier for frontend, Google Java Style for backend
2. **Git Workflow**: Feature branches with pull requests
3. **Testing**: Maintain >80% code coverage
4. **Documentation**: Update README and API docs with changes

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Submit pull request with description
5. Code review and approval
6. Merge to main branch

## 📚 API Documentation

### REST Endpoints
- **Operations**: `/api/ops/*` - CRUD operations management
- **Tasks**: `/api/tasks/*` - Task assignment and tracking
- **Reports**: `/api/reports/*` - Military report management
- **Messages**: `/api/messages/*` - Chat and messaging
- **Replay**: `/api/replay/*` - Historical data and AAR

### Real-time Endpoints
- **SSE**: `/api/ops/{id}/stream/positions` - Position updates
- **WebSocket**: `/ws/ops/{id}` - Real-time chat and events

### Authentication
\`\`\`bash
# Get JWT token from Keycloak
curl -X POST http://localhost:8081/realms/army-cop/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=army-cop-client&username=hq_user&password=password"

# Use token in API requests
curl -H "Authorization: Bearer $JWT_TOKEN" http://localhost:8080/api/ops
\`\`\`

## 🐛 Troubleshooting

### Common Issues

#### "Operation ID not set" Error
- **Cause**: Realtime service trying to connect before operation selection
- **Solution**: Select an operation from the operations panel first

#### IndexedDB Sync Errors
- **Cause**: Invalid operation ID passed to database queries
- **Solution**: Ensure valid operation is selected before offline operations

#### WebSocket Connection Failed
- **Cause**: Backend services not running or network issues
- **Solution**: Check backend service status and network connectivity

#### Map Not Loading
- **Cause**: Missing Leaflet CSS or JavaScript errors
- **Solution**: Check browser console for errors and network requests

### Debug Mode
\`\`\`bash
# Enable debug logging
export DEBUG=army-cop:*

# Frontend debug logs
console.log("[v0] Debug message", data)

# Backend debug logs
logging.level.mil.army.cop=DEBUG
\`\`\`

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Core map functionality with NATO symbology
- ✅ Operations and task management
- ✅ Real-time messaging and updates
- ✅ Offline capabilities with sync

### Phase 2 (Planned)
- 🔄 Advanced analytics and reporting
- 🔄 Mobile app (React Native)
- 🔄 AI-powered threat detection
- 🔄 Integration with external systems

### Phase 3 (Future)
- 📋 Drone and sensor integration
- 📋 Predictive analytics
- 📋 Advanced visualization (3D maps)
- 📋 Multi-coalition support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Leaflet**: Open-source mapping library
- **Spring Boot**: Java application framework
- **Keycloak**: Identity and access management
- **PostGIS**: Spatial database extension
- **shadcn/ui**: Beautiful UI components
- **Zustand**: Lightweight state management

---

**Built with ❤️ for military operations and situational awareness**

For questions, issues, or contributions, please contact the development team or create an issue in the repository.
