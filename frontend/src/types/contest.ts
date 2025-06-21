// src/types/contest.ts
import type { FantasyTeam } from './player';

export type Contest = {
  id: string;
  name: string;
  matchId: string;
  entryFee: number;
  prizePool: number;
  maxEntries: number;
  currentEntries: number;
  status: 'upcoming' | 'live' | 'completed';
  startTime: Date;
  endTime: Date;
  teams: FantasyTeam[];
  isGuaranteed: boolean;
  payouts: Payout[];
  winningTeamId?: string;
};

export const ContestType = {
  HeadToHead: 'H2H',
  FiftyFifty: '50_50',
  League: 'LEAGUE',
} as const;

export type ContestType = typeof ContestType[keyof typeof ContestType];

export type Payout = {
  rank: number;
  percentage: number;
  amount: number;
};

export type ContestEntry = {
  id: string;
  contestId: string;
  userId: string;
  teamId: string;
  rank?: number;
  points: number;
  winnings?: number;
  joinedAt: Date;
}; 