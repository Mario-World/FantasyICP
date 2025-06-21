// src/services/contests.ts
import { createActor } from './actor';
import { useAuthStore } from '../store';
import type { Contest, ContestEntry } from '../types';

const getActor = () => {
  const { identity } = useAuthStore.getState();
  return createActor(identity);
};

export const contestService = {
  async getContestsByMatch(matchId: string): Promise<Contest[]> {
    try {
      const actor = getActor();
      const result = await actor.get_contests_by_match(matchId);
      return result as Contest[];
    } catch (error) {
      console.error(`Error fetching contests for match ${matchId}:`, error);
      throw error;
    }
  },

  async joinContest(contestId: string, teamId: string): Promise<boolean> {
    try {
      const actor = getActor();
      const result = await actor.join_contest(contestId, teamId);
      return result as boolean;
    } catch (error) {
      console.error(`Error joining contest ${contestId}:`, error);
      return false;
    }
  },

  async getUserEntries(): Promise<ContestEntry[]> {
    try {
      const actor = getActor();
      const result = await actor.get_user_entries();
      return result as ContestEntry[];
    } catch (error) {
      console.error("Error fetching user entries:", error);
      throw error;
    }
  },
}; 