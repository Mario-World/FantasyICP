// src/store/contestSlice.ts
import { create } from 'zustand';
import { contestService } from '../services/contests';
import type { Contest, ContestEntry } from '../types';

interface ContestState {
    contests: Contest[];
    userEntries: ContestEntry[];
    selectedContest: Contest | null;
    isLoading: boolean;
    error: any;
    fetchContestsByMatch: (matchId: string) => Promise<void>;
    joinContest: (contestId: string, teamId: string) => Promise<void>;
    fetchUserEntries: () => Promise<void>;
}

export const useContestStore = create<ContestState>((set) => ({
    contests: [],
    userEntries: [],
    selectedContest: null,
    isLoading: false,
    error: null,
    fetchContestsByMatch: async (matchId: string) => {
        set({ isLoading: true, error: null });
        try {
            const contests = await contestService.getContestsByMatch(matchId);
            set({ contests: Array.isArray(contests) ? contests : [], isLoading: false });
        } catch (error) {
            set({ error, isLoading: false });
        }
    },
    joinContest: async (contestId: string, teamId: string) => {
        set({ isLoading: true, error: null });
        try {
            await contestService.joinContest(contestId, teamId);
            set({ isLoading: false });
        } catch (error) {
            set({ error, isLoading: false });
        }
    },
    fetchUserEntries: async () => {
        set({ isLoading: true, error: null });
        try {
            const userEntries = await contestService.getUserEntries();
            set({ userEntries: Array.isArray(userEntries) ? userEntries : [], isLoading: false });
        } catch (error) {
            set({ error, isLoading: false });
        }
    },
})); 