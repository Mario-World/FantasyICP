// src/types/player.ts
import type { Sport } from './tournament';

export const PlayerRole = {
  BATSMAN: 'BATSMAN',
  BOWLER: 'BOWLER',
  WICKET_KEEPER: 'WICKET_KEEPER',
  ALL_ROUNDER: 'ALL_ROUNDER',
  FORWARD: 'FORWARD',
  MIDFIELDER: 'MIDFIELDER',
  DEFENDER: 'DEFENDER',
  GOALKEEPER: 'GOALKEEPER',
} as const;

export type PlayerRole = typeof PlayerRole[keyof typeof PlayerRole];

export type Player = {
  id: string;
  name: string;
  role: PlayerRole;
  sport: Sport;
  teamId: string;
  totalPoints: number;
  price: number;
  isSelected: boolean;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  stats: {
    matches: number;
    runs?: number;
    wickets?: number;
    goals?: number;
    assists?: number;
  };
};

export type FantasyTeam = {
  id: string;
  name: string;
  userId: string;
  players: Player[];
  captainId: string;
  viceCaptainId: string;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}; 