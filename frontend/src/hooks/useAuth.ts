import { useEffect, useCallback, useState } from 'react';
import type { AuthEvent } from '../types/auth';
import { useAuthStore } from '../store';
import { useIdentity } from "@nfid/identitykit/react";
import { createActor } from "../services/actor";

/**
 * Custom hook for authentication state management
 * Provides login, logout, and profile management functionality
 */
export const useAuth = () => {
  const identity = useIdentity();
  const {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    setAuth,
    setNoAuth,
  } = useAuthStore();

  useEffect(() => {
    const syncAuth = async () => {
      if (identity) {
        const actor = createActor(identity);
        const userProfileResponse = (await actor.get_user_profile(
          []
        )) as any;
        if (
          userProfileResponse &&
          "ok" in userProfileResponse &&
          (userProfileResponse.ok as any[]).length > 0
        ) {
          setAuth({
            identity,
            user: (userProfileResponse.ok as any[])[0],
          });
        } else {
          setAuth({ identity, user: null });
        }
      } else {
        setNoAuth();
      }
    };
    syncAuth();
  }, [identity, setAuth, setNoAuth]);

  return {
    isAuthenticated,
    user,
    identity,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
  };
};

/**
 * Hook for listening to authentication events
 */
export const useAuthEvents = (listener: (event: AuthEvent) => void) => {
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe(
      (state, prevState) => {
        if (state.isAuthenticated && !prevState.isAuthenticated && state.user) {
          listener({
            type: 'login',
            user: state.user,
            timestamp: new Date(),
          });
        } else if (!state.isAuthenticated && prevState.isAuthenticated) {
          listener({
            type: 'logout',
            timestamp: new Date(),
          });
        }
      }
    );

    return unsubscribe;
  }, [listener]);
};

/**
 * Hook for checking if user has specific permissions
 */
export const usePermissions = (requiredPermissions: string[]) => {
  const { user } = useAuth();
  
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    
    // Mock permission check - in real app, this would check user roles/permissions
    const userPermissions = [
      'read:tournaments',
      'read:contests',
      'create:fantasy_teams',
      'join:contests',
    ];
    
    return userPermissions.includes(permission);
  }, [user]);

  const hasAllPermissions = useCallback((): boolean => {
    return requiredPermissions.every(permission => hasPermission(permission));
  }, [requiredPermissions, hasPermission]);

  const hasAnyPermission = useCallback((): boolean => {
    return requiredPermissions.some(permission => hasPermission(permission));
  }, [requiredPermissions, hasPermission]);

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    userPermissions: user ? ['read:tournaments', 'read:contests', 'create:fantasy_teams', 'join:contests'] : [],
  };
};

/**
 * Hook for session management
 */
export const useSession = () => {
  const { isAuthenticated } = useAuth();
  const [sessionTimeout, setSessionTimeout] = useState<Date | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Set session timeout to 30 minutes from now
      const timeout = new Date(Date.now() + 30 * 60 * 1000);
      setSessionTimeout(timeout);
    } else {
      setSessionTimeout(null);
    }
  }, [isAuthenticated]);

  const extendSession = useCallback(() => {
    if (isAuthenticated) {
      const timeout = new Date(Date.now() + 30 * 60 * 1000);
      setSessionTimeout(timeout);
    }
  }, [isAuthenticated]);

  const getSessionTimeRemaining = useCallback((): number => {
    if (!sessionTimeout) return 0;
    return Math.max(0, sessionTimeout.getTime() - Date.now());
  }, [sessionTimeout]);

  return {
    sessionTimeout,
    extendSession,
    getSessionTimeRemaining,
    isSessionExpired: getSessionTimeRemaining() <= 0,
  };
};

export default useAuth; 