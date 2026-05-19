import { compare, hash } from 'bcryptjs'

const MAX_STRING_LENGTH = 255

/**
 * Strip control characters and trim input
 */
export function sanitizeInput(value: string): string {
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, MAX_STRING_LENGTH)
}

/**
 * Reject potentially malicious patterns in text fields
 */
const SUSPICIOUS_PATTERNS = /(?:<\s*script|on\w+\s*=|javascript\s*:|union\s+select|--\s|or\s+'1'\s*=\s*'1)/i

export function containsSuspiciousPattern(value: string): boolean {
  return SUSPICIOUS_PATTERNS.test(value)
}

/**
 * Validate name field
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  const cleaned = sanitizeInput(name)
  if (cleaned.length < 2) return { isValid: false, error: 'Name must be at least 2 characters' }
  if (cleaned.length > 100) return { isValid: false, error: 'Name is too long' }
  if (containsSuspiciousPattern(cleaned)) return { isValid: false, error: 'Name contains invalid characters' }
  return { isValid: true }
}

/**
 * Validate login input
 */
export function validateLoginInput(email: string, password: string): { isValid: boolean; error?: string } {
  if (!email || !password) return { isValid: false, error: 'Email and password are required' }
  const sanitizedEmail = sanitizeInput(email)
  if (sanitizedEmail.length > MAX_STRING_LENGTH) return { isValid: false, error: 'Email is too long' }
  if (!validateEmail(sanitizedEmail)) return { isValid: false, error: 'Invalid email format' }
  if (password.length > 128) return { isValid: false, error: 'Password is too long' }
  return { isValid: true }
}

/**
 * Validate registration input
 */
export function validateRegistrationInput(email: string, password: string, fullName: string): { isValid: boolean; error?: string } {
  if (!email || !password || !fullName) return { isValid: false, error: 'All fields are required' }
  const nameValidation = validateName(fullName)
  if (!nameValidation.isValid) return nameValidation
  const sanitizedEmail = sanitizeInput(email)
  if (!validateEmail(sanitizedEmail)) return { isValid: false, error: 'Invalid email format' }
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) return { isValid: false, error: passwordValidation.errors[0] }
  return { isValid: true }
}

/**
 * Password hashing and verification utilities
 */
const BCRYPT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword)
}

/**
 * Token generation utilities using Web Crypto API (Edge Runtime compatible)
 */
export function generateToken(): string {
  // Use Web Crypto API instead of Node.js crypto for Edge Runtime compatibility
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  // Generate a number between 100000 and 999999
  const otp = (array[0] % 900000) + 100000
  return otp.toString()
}

export function generateSessionToken(): string {
  // Use Web Crypto API instead of Node.js crypto for Edge Runtime compatibility
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Password validation
 */
export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Email validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Session expiry calculation
 */
export function getSessionExpiry(days: number = 7): Date {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + days)
  return expiry
}

/**
 * Token expiry calculation
 */
export function getTokenExpiry(hours: number): Date {
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + hours)
  return expiry
}

/**
 * Get OTP expiry time (15 minutes)
 */
export function getOTPExpiry(): Date {
  return new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true
  return new Date() > expiresAt
}
