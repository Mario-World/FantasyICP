// src/types/tournament.ts

import type { Player } from "./player";

export const Sport = {
  CRICKET: 'CRICKET',
  FOOTBALL: 'FOOTBALL',
  BASKETBALL: 'BASKETBALL',
  Tennis: 'TENNIS',
} as const;

export type Sport = typeof Sport[keyof typeof Sport];

export const TournamentStatus = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  Cancelled: 'CANCELLED',
} as const;

export type TournamentStatus = typeof TournamentStatus[keyof typeof TournamentStatus];

export type Tournament = {
  id: string;
  name: string;
  sport: Sport;
  startDate: Date;
  endDate: Date;
  prizePool: number;
  entryFee: number;
  maxTeams: number;
  currentTeams: number;
  status: TournamentStatus;
  imageUrl?: string;
};

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  players: Player[];
}

export interface Match {
  id: string;
  tournamentId: string;
  teamA: Team;
  teamB: Team;
  startTime: Date;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  venue: string;
  result?: string;
} 