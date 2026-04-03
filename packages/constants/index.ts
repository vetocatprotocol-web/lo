/* =====================
   SYSTEM CONSTANTS
   ===================== */

// Authentication
export const AUTH_PIN_LENGTH = 4;
export const AUTH_PIN_REGEX = /^\d{4}$/;
export const AUTH_MAX_ATTEMPTS = 3;
export const AUTH_LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// QR Token
export const QR_TOKEN_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes (default)
export const QR_TOKEN_REFRESH_INTERVAL_MS = 10 * 1000; // 10 seconds

// Location Validation
export const LOCATION_VALIDATION_RADIUS_M = 50; // meters
export const LOCATION_VALIDATION_ACCURACY_THRESHOLD_M = 30; // meters

// Detection Engine Thresholds
export const LOCATION_JUMP_THRESHOLD_M = 1000; // 1 km
export const LOCATION_JUMP_TIME_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
export const RAPID_SCAN_THRESHOLD_MS = 30 * 1000; // 30 seconds
export const DEVICE_SWITCH_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Bulk Import
export const MAX_IMPORT_BATCH_SIZE = 1000;
export const ALLOWED_IMPORT_FORMATS = ['csv', 'xlsx'];

// Attendance Status
export const ATTENDANCE_STATUSES = ['present', 'absent', 'late', 'early_leave'] as const;
export const DETECTION_STATUSES = ['normal', 'suspicious', 'blocked'] as const;

// Error Messages
export const ERROR_INVALID_PIN = 'Invalid PIN';
export const ERROR_PIN_ATTEMPTS_EXCEEDED = 'Too many PIN attempts. Please try again later.';
export const ERROR_DEVICE_NOT_BOUND = 'Device not bound. Please bind your device first.';
export const ERROR_LOCATION_OUT_OF_RANGE = 'Location out of valid range.';
export const ERROR_UNAUTHORIZED = 'Unauthorized access.';
export const ERROR_NOT_FOUND = 'Resource not found.';
export const ERROR_INVALID_REQUEST = 'Invalid request.';
export const ERROR_INTERNAL_SERVER = 'Internal server error.';

// Success Messages
export const SUCCESS_LOGIN = 'Login successful';
export const SUCCESS_ATTENDANCE_RECORDED = 'Attendance recorded successfully';
export const SUCCESS_DEVICE_BOUND = 'Device bound successfully';
export const SUCCESS_IMPORT_COMPLETED = 'Import completed successfully';

// Database Constraints
export const NRP_LENGTH = 8; // Typical military NRP length
export const NRP_REGEX = /^[0-9]{8}$/;

// WebSocket Events
export const WS_EVENT_STATS_UPDATE = 'stats:update';
export const WS_EVENT_ACTIVITY_LOG = 'activity:log';
export const WS_EVENT_ALERT = 'alert';
export const WS_EVENT_QR_REFRESH = 'qr:refresh';
