# API Documentation

## Base URL

```
Development: http://localhost:3001
Production: https://api.mas.military.id (example)
```

## Authentication

All endpoints require a valid JWT token (except login).

```http
Authorization: Bearer {JWT_TOKEN}
```

---

## Endpoints

### Authentication

#### POST /auth/login
Login with NRP and PIN.

**Request**
```json
{
  "nrp": "12345678",
  "pin": "1234"
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "nrp": "12345678",
      "name": "Kolonel Ahmad",
      "rank": "Kolonel",
      "unit": "Komando Pusat"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### POST /auth/verify-pin
Verify PIN without login.

**Request**
```json
{
  "nrp": "12345678",
  "pin": "1234"
}
```

**Response** (200)
```json
{
  "success": true,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

### Devices

#### POST /devices/bind
Bind a device to a user.

**Request**
```json
{
  "userId": "user_123",
  "deviceId": "device-uuid-123",
  "deviceModel": "iPhone 14 Pro",
  "osVersion": "iOS 17.2"
}
```

**Response** (201)
```json
{
  "id": "device_123",
  "userId": "user_123",
  "deviceId": "device-uuid-123",
  "deviceModel": "iPhone 14 Pro",
  "osVersion": "iOS 17.2",
  "isActive": true,
  "bindedAt": "2024-01-01T12:00:00Z",
  "lastSeen": "2024-01-01T12:00:00Z"
}
```

#### POST /devices/{deviceId}/verify
Verify if device is valid and bound.

**Response** (200)
```json
{
  "verified": true,
  "userId": "user_123"
}
```

---

### Location Validation

#### POST /location/validate
Validate if location is within allowed geo-fence.

**Request**
```json
{
  "latitude": 6.2088,
  "longitude": 106.8456,
  "accuracy": 12.5
}
```

**Response** (200)
```json
{
  "valid": true,
  "reason": "Location valid"
}
```

---

### QR Token

#### POST /qr-token/generate
Generate a new QR token (10-minute expiry).

**Response** (201)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-01T12:10:00Z",
  "refreshInterval": 10
}
```

#### GET /qr-token/refresh
Refresh QR token.

**Response** (200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-01T12:10:00Z",
  "refreshInterval": 10
}
```

---

### Attendance

#### POST /attendance/record
Record attendance event.

**Request**
```json
{
  "userId": "user_123",
  "deviceId": "device_123",
  "latitude": 6.2088,
  "longitude": 106.8456,
  "accuracy": 12.5,
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

**Response** (201)
```json
{
  "id": "activity_123",
  "userId": "user_123",
  "deviceId": "device_123",
  "timestamp": "2024-01-01T08:30:00Z",
  "latitude": 6.2088,
  "longitude": 106.8456,
  "accuracy": 12.5,
  "attendanceStatus": "present",
  "detectionStatus": "normal",
  "ipAddress": "192.168.1.100",
  "isVerified": true
}
```

#### GET /attendance/user/{userId}
Get user attendance history (last 7 days default).

**Query Parameters**
- `days`: Number of days to retrieve (default: 7)

**Response** (200)
```json
[
  {
    "id": "activity_123",
    "userId": "user_123",
    "timestamp": "2024-01-01T08:30:00Z",
    "attendanceStatus": "present",
    "detectionStatus": "normal"
  }
]
```

#### GET /attendance/today
Get today's attendance statistics.

**Response** (200)
```json
{
  "date": "2024-01-01T00:00:00Z",
  "stats": {
    "present": 250,
    "late": 15,
    "absent": 5,
    "early_leave": 2
  }
}
```

---

### Detection

#### POST /detection/analyze
Analyze activity for anomalies.

**Request**
```json
{
  "userId": "user_123",
  "latitude": 6.2088,
  "longitude": 106.8456,
  "accuracy": 12.5,
  "deviceId": "device_123"
}
```

**Response** (200)
```json
{
  "status": "normal",
  "confidence": 15,
  "reason": "No anomalies detected",
  "details": {
    "locationJump": false,
    "rapidScan": false,
    "deviceSwitch": false,
    "suspiciousPattern": false
  }
}
```

---

### Configuration

#### GET /config/system
Get current system configuration.

**Response** (200)
```json
{
  "auth": {
    "pin": true,
    "otp": false,
    "face": true
  },
  "device": {
    "mode": "strict"
  },
  "geo": {
    "mode": "hybrid",
    "radius": 50
  },
  "qr": {
    "refresh": 10
  },
  "detection": {
    "level": "high"
  }
}
```

#### PUT /config/system
Update system configuration.

**Request**
```json
{
  "auth": {
    "pin": true,
    "otp": true,
    "face": false
  },
  "detection": {
    "level": "medium"
  }
}
```

**Response** (200)
- Updated configuration (same structure as GET)

#### GET /config/features
Get active feature flags.

**Response** (200)
```json
{
  "auth": {
    "pin": true,
    "otp": false,
    "face": true
  },
  "detection": {
    "level": "high"
  },
  "device": {
    "mode": "strict"
  }
}
```

---

### Import

#### POST /import/users
Bulk import users from CSV/XLSX.

**Request**
```json
{
  "users": [
    {
      "nrp": "12345678",
      "name": "Kolonel Ahmad",
      "rank": "Kolonel",
      "unit": "Komando Pusat",
      "pin": "1234"
    }
  ],
  "mode": "skip_duplicates",
  "userId": "admin_user_id"
}
```

**Response** (201)
```json
{
  "successCount": 150,
  "failureCount": 2,
  "errors": [
    "Row 25: Invalid PIN format",
    "Row 87: NRP already exists"
  ],
  "importLogId": "import_123"
}
```

#### GET /import/logs
Get import history.

**Response** (200)
```json
[
  {
    "id": "import_123",
    "userId": "admin_user_id",
    "mode": "skip_duplicates",
    "totalRecords": 152,
    "successCount": 150,
    "failureCount": 2,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

#### GET /import/logs/{id}
Get specific import log details.

**Response** (200)
```json
{
  "id": "import_123",
  "userId": "admin_user_id",
  "mode": "skip_duplicates",
  "totalRecords": 152,
  "successCount": 150,
  "failureCount": 2,
  "errors": ["Row 25: Invalid PIN format"],
  "createdAt": "2024-01-01T10:00:00Z"
}
```

---

### Statistics

#### GET /stats/attendance
Get attendance statistics for today.

**Response** (200)
```json
{
  "totalMembers": 272,
  "presentCount": 250,
  "absentCount": 5,
  "lateCount": 15,
  "suspiciousCount": 1,
  "blockedCount": 0,
  "lastUpdated": "2024-01-01T12:30:00Z"
}
```

#### GET /stats/dashboard
Get full dashboard statistics with recent activities.

**Response** (200)
```json
{
  "stats": {
    "totalMembers": 272,
    "presentCount": 250,
    "absentCount": 5,
    "lateCount": 15,
    "suspiciousCount": 1,
    "blockedCount": 0,
    "lastUpdated": "2024-01-01T12:30:00Z"
  },
  "recentActivities": [
    {
      "id": "activity_123",
      "userId": "user_123",
      "timestamp": "2024-01-01T12:29:00Z",
      "attendanceStatus": "present",
      "detectionStatus": "normal"
    }
  ],
  "activeMembers": 250,
  "inactiveMembers": 22
}
```

---

### Audit Logs

#### GET /audit-logs
Get audit log entries.

**Query Parameters**
- `action`: Filter by action (e.g., USER_LOGIN, DEVICE_BIND)
- `limit`: Number of records (default: 50, max: 500)

**Response** (200)
```json
[
  {
    "id": "audit_123",
    "action": "USER_LOGIN",
    "userId": "user_123",
    "resourceType": "User",
    "resourceId": "user_123",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2024-01-01T12:00:00Z"
  }
]
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

### Example Error Response

**400 - Bad Request**
```json
{
  "success": false,
  "error": "Invalid PIN format. PIN must be 4 digits.",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**401 - Unauthorized**
```json
{
  "success": false,
  "error": "Invalid credentials",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Rate Limiting

- **Login endpoint**: 5 requests per 15 minutes per IP
- **Other endpoints**: 100 requests per minute per user

---

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:3001/ws');

socket.on('connect', () => {
  console.log('Connected');
});
```

### Subscribe to Stats
```javascript
socket.emit('stats:subscribe');
```

### Listen to Events
```javascript
// Stats update
socket.on('stats:update', (data) => {
  console.log('New stats:', data);
});

// New attendance
socket.on('activity:log', (data) => {
  console.log('New activity:', data);
});

// Security alert
socket.on('alert', (data) => {
  console.log('Alert:', data);
});

// QR refresh signal
socket.on('qr:refresh', (data) => {
  console.log('QR token refreshed');
});
```

---

## Example Workflows

### Complete Attendance Flow

```
1. GET /qr-token/generate
   ✓ Get QR token

2. Mobile scans QR code
   ✓ Extract token + user data

3. POST /attendance/record
   ✓ Record attendance with location

4. POST /detection/analyze
   ✓ Check for anomalies

5. WebSocket: stats:update
   ✓ Dashboard updates in real-time
```

### Bulk User Import Flow

```
1. Admin prepares CSV file
   ✓ Format: NRP, Name, Rank, Unit, PIN

2. POST /import/users
   ✓ System validates & imports

3. GET /import/logs/{id}
   ✓ View import results

4. WebSocket: config:update
   ✓ System config refreshes
```

---

## Response Time Targets

| Endpoint | Target |
|----------|--------|
| Authentication | < 200ms |
| Attendance Record | < 500ms |
| Stats | < 300ms |
| Import (100 users) | < 2s |

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0
