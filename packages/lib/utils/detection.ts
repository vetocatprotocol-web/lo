import type { DetectionContext, DetectionResult, IActivityLog } from '@mas/types';
import {
  LOCATION_JUMP_THRESHOLD_M,
  LOCATION_JUMP_TIME_THRESHOLD_MS,
  RAPID_SCAN_THRESHOLD_MS,
  DEVICE_SWITCH_THRESHOLD_MS,
} from '@mas/constants';
import { calculateDistance } from './validation';

/**
 * Detect location jump (user moved too far too quickly)
 */
export function detectLocationJump(context: DetectionContext): boolean {
  if (!context.previousActivity) return false;

  const distance = calculateDistance(
    context.previousActivity.latitude,
    context.previousActivity.longitude,
    context.latitude,
    context.longitude,
  );

  const timeDiff = context.timestamp.getTime() - context.previousActivity.timestamp.getTime();

  // If distance > threshold AND time < threshold = suspicious
  if (distance > LOCATION_JUMP_THRESHOLD_M && timeDiff < LOCATION_JUMP_TIME_THRESHOLD_MS) {
    return true;
  }

  return false;
}

/**
 * Detect rapid scanning (multiple scans within short period)
 */
export function detectRapidScan(context: DetectionContext, recentActivities: IActivityLog[]): boolean {
  if (recentActivities.length === 0) return false;

  const recentScans = recentActivities.filter((activity) => {
    const timeDiff = context.timestamp.getTime() - activity.timestamp.getTime();
    return timeDiff < RAPID_SCAN_THRESHOLD_MS;
  });

  // If more than 2 scans in 30 seconds = suspicious
  return recentScans.length >= 2;
}

/**
 * Detect device switch (different device used)
 */
export function detectDeviceSwitchSuspicion(
  currentDeviceId: string,
  previousActivity: IActivityLog | undefined,
  recentActivities: IActivityLog[],
): boolean {
  if (!previousActivity) return false;

  const timeSinceLastActivity = Date.now() - previousActivity.timestamp.getTime();

  // If device changed within short time window = suspicious
  if (
    previousActivity.deviceId !== currentDeviceId &&
    timeSinceLastActivity < DEVICE_SWITCH_THRESHOLD_MS
  ) {
    return true;
  }

  return false;
}

/**
 * Run full detection analysis
 */
export function analyzeActivityForAnomalies(
  context: DetectionContext,
  detectionLevel: 'low' | 'medium' | 'high' = 'high',
  recentActivities: IActivityLog[] = [],
): DetectionResult {
  const details = {
    locationJump: false,
    rapidScan: false,
    deviceSwitch: false,
    suspiciousPattern: false,
  };

  let suspicionScore = 0;

  // Check location jump
  if (detectLocationJump(context)) {
    details.locationJump = true;
    suspicionScore += 40;
  }

  // Check rapid scanning
  if (detectRapidScan(context, recentActivities)) {
    details.rapidScan = true;
    suspicionScore += 30;
  }

  // Check device switch
  if (context.previousActivity && detectDeviceSwitchSuspicion(context.previousActivity.deviceId, context.previousActivity, recentActivities)) {
    details.deviceSwitch = true;
    suspicionScore += 25;
  }

  // Determine detection status based on threshold and level
  const thresholds = {
    low: 70,
    medium: 50,
    high: 30,
  };

  const threshold = thresholds[detectionLevel];

  let status: 'normal' | 'suspicious' | 'blocked' = 'normal';
  let reason = 'No anomalies detected';

  if (suspicionScore >= threshold) {
    status = suspicionScore >= 80 ? 'blocked' : 'suspicious';
    reason = 'Suspicious activity detected';
  }

  return {
    status,
    confidence: Math.min(suspicionScore, 100),
    reason,
    details,
  };
}
