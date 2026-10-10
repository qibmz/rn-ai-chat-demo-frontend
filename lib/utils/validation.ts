/** Basic email format check (client-side UX; server still validates). */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Backend auth password constraint: 8–72 chars. */
export function isValidPassword(value: string): boolean {
  return value.length >= 8 && value.length <= 72;
}

/** Backend forgot-password code: exactly 8 digits. */
export function isValidResetCode(value: string): boolean {
  return /^\d{8}$/.test(value.trim());
}
