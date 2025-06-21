// Export all authentication types
export * from './auth';
export * from './contest';
export * from './player';
export * from './reward';
export * from './tournament';

// Re-export commonly used types for convenience
export type {
  UserProfile,
  LoginCredentials,
  RegisterData,
  AuthState,
  AuthResponse,
  UseAuthReturn,
  UseAuthOptions,
  AuthEvent,
} from './auth';
export type { Contest, ContestEntry } from './contest';
export type { Player, FantasyTeam } from './player';
export type { Reward, RewardTransaction } from './reward';
export type { Tournament, Team } from './tournament';

export type ApiResponse<T> = {
    ok: T;
} | {
    err: {
        code: number;
        message: string;
    };
};

export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
}; 