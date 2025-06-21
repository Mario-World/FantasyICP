// src/store/tournamentSlice.ts
import { create } from 'zustand';
import { tournamentService } from '../services/tournaments';
import type { Tournament } from '../types';

interface TournamentState {
    tournaments: Tournament[];
    selectedTournament: Tournament | null;
    isLoading: boolean;
    error: any;
    fetchAllTournaments: () => Promise<void>;
    fetchTournamentById: (id: string) => Promise<void>;
}

export const useTournamentStore = create<TournamentState>((set) => ({
    tournaments: [],
    selectedTournament: null,
    isLoading: false,
    error: null,
    fetchAllTournaments: async () => {
        set({ isLoading: true, error: null });
        try {
            const tournaments = await tournamentService.getAllTournaments();
            set({ tournaments: Array.isArray(tournaments) ? tournaments : [], isLoading: false });
        } catch (error) {
            set({ error, isLoading: false });
        }
    },
    fetchTournamentById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const tournament = await tournamentService.getTournamentById(id);
            if (tournament && typeof tournament === 'object' && 'id' in tournament) {
                set({ selectedTournament: tournament as Tournament, isLoading: false });
            } else {
                set({ selectedTournament: null, isLoading: false });
            }
        } catch (error) {
            set({ error, isLoading: false });
        }
    },
})); 