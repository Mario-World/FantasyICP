// Export all hooks
export { useAuth, useAuthEvents, usePermissions, useSession } from './useAuth';
// export { default as useAuth } from './useAuth';
export { useContests } from './useContests';
export { useTournaments } from './useTournaments';
export { useWebSocket } from './useWebSocket';

// Re-export types for convenience
export type { AuthEvent } from '../types/auth'; 