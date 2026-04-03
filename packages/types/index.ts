/* =====================
   USER MANAGEMENT TYPES
   ===================== */
export interface IUser {
  id: string;
  nrp: string; // NRP: National Registration Number (Military ID)
  name: string;
  rank: string;
  unit: string;
  pin: string; // Hashed PIN
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile extends Omit<IUser, 'pin'> {
  // User data without sensitive PIN
}

/* =====================
   DEVICE TYPES
   ===================== */
export interface IDevice {
  id: string;
  userId: string;
  deviceId: string; // Device UUID/Fingerprint
  deviceModel: string;
  osVersion: string;
  isActive: boolean;
  bindedAt: Date;
  lastSeen: Date;
}

export type DeviceMode = 'loose' | 'strict';

/* =====================
   ACTIVITY LOG TYPES
   ===================== */
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'early_leave';
export type DetectionStatus = 'normal' | 'suspicious' | 'blocked';

export interface IActivityLog {
  id: string;
  userId: string;
  deviceId: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  accuracy: number;
  attendanceStatus: AttendanceStatus;
  detectionStatus: DetectionStatus;
  detectionDetails?: string; // JSON stringified object
  ipAddress: string;
  userAgent: string;
  isVerified: boolean;
}

/* =====================
   QR TOKEN TYPES
   ===================== */
export interface IQRToken {
  id: string;
  token: string; // JWT/encrypted token
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

/* =====================
   CONFIG & FEATURE TOGGLE TYPES
   ===================== */
export interface ISystemConfigValue {
  auth: {
    pin: boolean;
    otp: boolean;
    face: boolean;
  };
  device: {
    mode: DeviceMode;
  };
  geo: {
    mode: 'hybrid' | 'gps' | 'network';
    radius: number; // meters
  };
  qr: {
    refresh: number; // seconds
  };
  detection: {
    level: 'low' | 'medium' | 'high';
  };
}

/* =====================
   IMPORT TYPES
   ===================== */
export interface IBulkUserData {
  nrp: string;
  name: string;
  rank: string;
  unit: string;
  pin: string;
}

export type ImportMode = 'overwrite' | 'skip_duplicates';

export interface IImportLog {
  id: string;
  mode: ImportMode;
  totalRecords: number;
  successCount: number;
  failureCount: number;
  errors: string[]; // Error messages
  createdAt: Date;
  importedBy: string;
}

/* =====================
   STATS TYPES
   ===================== */
export interface IAttendanceStats {
  totalMembers: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  suspiciousCount: number;
  blockedCount: number;
  lastUpdated: Date;
}

/* =====================
   API REQUEST/RESPONSE TYPES
   ===================== */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/* =====================
   DETECTION ENGINE TYPES
   ===================== */
export interface DetectionContext {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  previousActivity?: IActivityLog;
}

export interface DetectionResult {
  status: DetectionStatus;
  confidence: number; // 0-100
  reason: string;
  details: {
    locationJump?: boolean;
    rapidScan?: boolean;
    deviceSwitch?: boolean;
    suspiciousPattern?: boolean;
  };
}

/* =====================
   WEBSOCKET EVENT TYPES
   ===================== */
export interface WebSocketMessage {
  event: string;
  data: any;
  timestamp: Date;
}

export interface DashboardUpdate {
  stats: IAttendanceStats;
  recentActivities: IActivityLog[];
  activeMembers: number;
  inactiveMembers: number;
}
