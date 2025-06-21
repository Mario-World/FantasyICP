// Basic Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email?: string;
  phone?: string;
  principal?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  balance: number;
  totalWinnings: number;
  contestsPlayed: number;
  contestsWon: number;
  joinDate: Date;
  avatar?: string;
  isVerified: boolean;
  lastLoginAt?: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showProfile: boolean;
    showStats: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: Date | null;
}

export interface TokenPayload {
  userId: string;
  username: string;
  email?: string;
  iat: number;
  exp: number;
}

// Internet Identity Types
export interface InternetIdentityConfig {
  url: string;
  clientName: string;
  redirectUrl: string;
}

export interface IIAuthRequest {
  clientName: string;
  redirectUrl: string;
  scope?: string[];
}

export interface IIAuthResponse {
  principal: string;
  signature: string;
  timestamp: number;
}

export interface PrincipalVerification {
  principal: string;
  isValid: boolean;
  verifiedAt: Date;
}

// Session Types
export interface SessionInfo {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

export interface SessionActivity {
  sessionId: string;
  action: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Password Management
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Two-Factor Authentication
export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerify {
  code: string;
  remember?: boolean;
}

export interface TwoFactorStatus {
  isEnabled: boolean;
  isVerified: boolean;
  lastUsed?: Date;
}

// Verification Types
export interface EmailVerification {
  email: string;
  token: string;
  verifiedAt?: Date;
}

export interface PhoneVerification {
  phone: string;
  code: string;
  verifiedAt?: Date;
}

// Security Types
export interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  metadata?: Record<string, any>;
}

export interface LoginAttempt {
  id: string;
  userId?: string;
  username: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  failureReason?: string;
}

// Permission and Role Types
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
}

export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy?: string;
}

// API Response Types
export interface AuthApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export interface PaginatedAuthResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error Types
export interface AuthError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export const AuthErrorCode = {
  UserNotFound: "USER_NOT_FOUND",
  InvalidCredentials: "INVALID_CREDENTIALS",
  UserAlreadyExists: "USER_ALREADY_EXISTS",
  InvalidToken: "INVALID_TOKEN",
  TokenExpired: "TOKEN_EXPIRED",
  InsufficientPermissions: "INSUFFICIENT_PERMISSIONS",
  AccountLocked: "ACCOUNT_LOCKED",
  AccountDisabled: "ACCOUNT_DISABLED",
  EmailNotVerified: "EMAIL_NOT_VERIFIED",
  PhoneNotVerified: "PHONE_NOT_VERIFIED",
  TwoFactorRequired: "TWO_FACTOR_REQUIRED",
  InvalidTwoFactorCode: "INVALID_TWO_FACTOR_CODE",
  PasswordTooWeak: "PASSWORD_TOO_WEAK",
  RateLimitExceeded: "RATE_LIMIT_EXCEEDED",
  InvalidPrincipal: "INVALID_PRINCIPAL",
  InternetIdentityError: "INTERNET_IDENTITY_ERROR",
} as const;

export type AuthErrorCode = typeof AuthErrorCode[keyof typeof AuthErrorCode];

// Validation Types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Hook Types
export interface UseAuthReturn {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithII: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addBalance: (amount: number) => Promise<void>;
  clearError: () => void;
}

export interface UseAuthOptions {
  autoLogin?: boolean;
  redirectTo?: string;
  onLogin?: (user: UserProfile) => void;
  onLogout?: () => void;
  onError?: (error: string) => void;
}

// Event Types
export interface AuthEvent {
  type: 'login' | 'logout' | 'register' | 'profile_update' | 'balance_update';
  user?: UserProfile;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AuthEventListener {
  (event: AuthEvent): void;
}

// Constants
export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'auth_refresh_token',
  USER_KEY: 'auth_user',
  SESSION_KEY: 'auth_session',
  LAST_ACTIVITY_KEY: 'auth_last_activity',
  
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,
} as const;

// Utility Types
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export type LoginMethod = 'password' | 'internet_identity' | 'two_factor';

export type VerificationStatus = 'pending' | 'verified' | 'failed';

export type SecurityLevel = 'low' | 'medium' | 'high'; 