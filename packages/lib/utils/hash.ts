import * as crypto from 'crypto';

/**
 * Hash a PIN/password using bcrypt-like approach
 * Note: Use 'bcrypt' library in production
 */
export function hashPin(pin: string): string {
  return crypto.createHash('sha256').update(pin + process.env.JWT_SECRET).digest('hex');
}

/**
 * Verify PIN against hash
 */
export function verifyPin(pin: string, hash: string): boolean {
  return hashPin(pin) === hash;
}

/**
 * Generate secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function generateDeviceId(): string {
  return crypto.randomUUID();
}
