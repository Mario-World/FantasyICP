// src/utils/constants.ts
export const APP_NAME = 'Fantasy Sports';
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
export const IC_PROVIDER_URL = 'https://identity.ic0.app';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TOURNAMENTS: '/tournaments',
  CONTESTS: '/contests',
  MY_TEAMS: '/my-teams',
  REWARDS: '/rewards',
  PROFILE: '/profile',
};

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user'; 