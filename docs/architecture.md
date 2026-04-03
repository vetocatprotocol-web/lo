# System Architecture

## Overview

The Military Attendance System (MAS) uses a **modular, layered architecture** designed for enterprise scalability and security.

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js Admin Dashboard (React 18, App Router)     │   │
│  │  - Dashboard | Members | Import | Logs | Settings   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ REST/WebSocket
┌────────────────────┴────────────────────────────────────────┐
│                    API Layer (NestJS)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Core Modules (10 Feature Modules)                   │   │
│  ├─ Authentication ─ Device ─ Location ─ QR Token       │   │
│  ├─ Attendance ─ Detection ─ Audit ─ Config             │   │
│  ├─ Import ─ Stats ─ WebSocket Gateway                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Cross-Cutting Concerns                              │   │
│  ├─ JWT Guards ─ Exception Filters ─ Logging            │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬──────────────┐
        │            │            │              │
┌───────▼─┐  ┌──────▼──┐  ┌─────▼────┐  ┌────▼────┐
│PostgreSQL│  │ Prisma  │  │  Redis   │  │Socket.IO│
│Database  │  │   ORM   │  │  Cache   │  │WebSocket│
└──────────┘  └─────────┘  └──────────┘  └─────────┘
```

## Layer Description

### 1. Frontend Layer (Next.js 14)
- **Location**: `/apps/web`
- **Technology**: React 18, Next.js 14 (App Router)
- **Responsibilities**:
  - Admin dashboard interface
  - Real-time statistics visualization
  - Bulk member import UI
  - Activity log display
  - Configuration management
  - WebSocket connection for live updates

### 2. API Layer (NestJS)
- **Location**: `/apps/api`
- **Technology**: NestJS, TypeScript, Express
- **Responsibilities**:
  - REST API endpoints
  - Business logic implementation
  - Data validation
  - WebSocket event handling
  - Cross-module orchestration

### 3. Data Layer
- **PostgreSQL**: Persistent data storage
- **Prisma**: Type-safe ORM
- **Redis**: Session/token caching
- **Socket.IO**: Real-time communication

## Module Architecture

Each module follows **Feature-Based Modular Design**:

```
Module/
├── {module}.module.ts       # Module definition
├── {module}.controller.ts   # HTTP endpoints
├── {module}.service.ts      # Business logic
├── {module}.dto.ts          # Input validation (optional)
└── {module}.spec.ts         # Tests (optional)
```

### Example: Authentication Module
```
auth/
├── auth.module.ts          # AuthModule (imports JwtModule)
├── auth.controller.ts       # POST /auth/login, /auth/verify-pin
├── auth.service.ts          # Login, verify PIN methods
│   └── Uses: JwtService, PrismaService
└── Guards/ Decorators       # @UseGuards(JwtGuard)
```

## Data Flow

### Attendance Recording Flow

```
1. Mobile App
   └─ POST /attendance/record
      {userId, deviceId, lat, lng, accuracy}

2. AttendanceController
   └─ Receives request, validates input

3. AttendanceService
   ├─ Determine attendance status (time-based)
   └─ Create ActivityLog record

4. DetectionModule (parallel)
   ├─ Fetch previous activity
   ├─ Fetch recent activities (10 latest)
   ├─ Get detection config
   ├─ Run anomaly detection algorithm
   └─ Update ActivityLog.detectionStatus

5. WebSocket Gateway
   └─ Broadcast to admin dashboard
      ws.emit('activity:log', record)
      ws.emit('stats:update', newStats)

6. Response
   └─ Return {id, status, timestamp}
```

### Configuration Change Flow

```
1. Admin Dashboard
   └─ PUT /config/system
      {auth: {...}, detection: {...}, ...}

2. ConfigService
   └─ Update SystemConfig in DB (Prisma)

3. WebSocket Gateway
   └─ Broadcast to all connected clients
      ws.emit('config:update', newConfig)

4. All Services
   └─ Next call to getSystemConfig() reads new values
```

## Feature Toggle System

The system uses **centralized configuration** for feature management:

```typescript
// In ConfigService
async getSystemConfig(): Promise<ISystemConfigValue> {
  const config = await prisma.systemConfig.findUnique({
    where: { key: 'system_config' }
  });
  return JSON.parse(config.value);
}

// In other services
const config = await this.configService.getSystemConfig();
if (config.auth.pin) {
  // Enable PIN auth flow
}
if (config.detection.level === 'high') {
  // Use strict detection thresholds
}
```

## Security Architecture

### Authentication
- **PIN-based**: 4-digit military PIN
- **JWT**: Token-based session management
- **Device Binding**: Device UUID validation
- **Hashing**: bcrypt for sensitive data

### Authorization
- **Guards**: JWT verification guards
- **Route Protection**: All routes checked for valid token
- **Audit Logging**: All actions logged with user context

### Data Protection
- **Encryption**: AES-256-GCM for sensitive fields
- **Validation**: Input sanitization & type validation
- **SQL Injection**: Prisma parameterized queries prevent injection

### Anomaly Detection
- **Location Jump**: Detects impossible travel
- **Rapid Scanning**: Detects multiple entries in short time
- **Device Switch**: Detects unusual device changes
- **Confidence Scoring**: ML-like scoring system (0-100)

## Scaling Considerations

### Horizontal Scaling
- ✅ Stateless API servers (multiple instances behind load balancer)
- ✅ Redis for session/token sharing
- ✅ Database connection pooling via Prisma

### Performance Optimization
- ✅ WebSocket for real-time updates (vs. polling)
- ✅ Redis caching for frequently accessed configs
- ✅ Database indexing on userId, timestamp, deviceId
- ✅ Query optimization via Prisma query optimization

### Database Design
```sql
-- ActivityLog indexes for common queries
CREATE INDEX idx_activity_userId_timestamp ON activity_logs(user_id, timestamp);
CREATE INDEX idx_activity_timestamp ON activity_logs(timestamp);
CREATE INDEX idx_device_userId ON devices(user_id);
```

## Error Handling

### Exception Filters (NestJS)
```typescript
@Catch(Exception)
export class AllExceptionsFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    // Log error
    // Format response
    // Send to client
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "User not found",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Testing Strategy

- **Unit Tests**: Service logic, utilities
- **Integration Tests**: Module interactions
- **E2E Tests**: API endpoints
- **Load Tests**: WebSocket scalability

## DevOps & Deployment

### Development
```bash
pnpm dev        # Run all services locally
```

### Production Build
```bash
pnpm build      # Build all apps
pnpm lint       # Quality checks
```

### Database Management
```bash
pnpm db:seed    # Demo data
pnpm db:setup   # Migrations + seed
```

## Monitoring & Observability

### Logging
- Structured logging via NestJS Logger
- Audit log model for compliance
- WebSocket event tracking

### Metrics (Future)
- Attendance statistics
- System health checks
- API response times
- WebSocket connection count

---

**This architecture supports 10,000+ active users with proper scaling**
