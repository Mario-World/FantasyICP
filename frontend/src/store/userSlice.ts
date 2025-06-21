// src/store/userSlice.ts
import { create } from 'zustand';
import { fantasyService } from '../services/fantasy';
import { contestService } from '../services/contests';
import { rewardService } from '../services/rewards';
import type { FantasyTeam, ContestEntry, RewardTransaction } from '../types';

interface UserState {
  fantasyTeams: FantasyTeam[];
  contestEntries: ContestEntry[];
  transactions: RewardTransaction[];
  isLoading: boolean;
  error: any;
  fetchUserFantasyTeams: () => Promise<void>;
  fetchUserContestEntries: () => Promise<void>;
  fetchUserTransactions: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  fantasyTeams: [],
  contestEntries: [],
  transactions: [],
  isLoading: false,
  error: null,
  fetchUserFantasyTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      const fantasyTeams = await fantasyService.getUserTeams();
      set({ fantasyTeams: Array.isArray(fantasyTeams) ? fantasyTeams : [], isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  fetchUserContestEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const contestEntries = await contestService.getUserEntries();
      set({ contestEntries: Array.isArray(contestEntries) ? contestEntries : [], isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  fetchUserTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await rewardService.getTransactions();
      set({ transactions: Array.isArray(transactions) ? transactions : [], isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
})); 