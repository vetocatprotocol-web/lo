import type { IUser } from '@mas/types';

/**
 * Validate NRP format
 */
export function validateNRP(nrp: string): boolean {
  return /^[0-9]{8}$/.test(nrp);
}

/**
 * Validate PIN format (4 digits)
 */
export function validatePIN(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

/**
 * Validate if coordinates are valid
 */
export function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Validate accuracy meter value
 */
export function validateAccuracy(accuracy: number): boolean {
  return accuracy >= 0 && accuracy <= 1000;
}

/**
 * Calculate distance between two GPS points (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if user data is valid for bulk import
 */
export function validateBulkUserData(user: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!validateNRP(user.nrp)) {
    errors.push('Invalid NRP format');
  }

  if (!validatePIN(user.pin)) {
    errors.push('Invalid PIN format');
  }

  if (!user.name || user.name.trim().length < 3) {
    errors.push('Name must be at least 3 characters');
  }

  if (!user.rank || user.rank.trim().length === 0) {
    errors.push('Rank is required');
  }

  if (!user.unit || user.unit.trim().length === 0) {
    errors.push('Unit is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
