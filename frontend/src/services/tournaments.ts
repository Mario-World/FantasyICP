// src/services/tournaments.ts
import { createActor } from './actor';
import { useAuthStore } from '../store';
import type { Tournament, Team } from '../types';

const getActor = () => {
  const { identity } = useAuthStore.getState();
  return createActor(identity);
};

export const tournamentService = {
    async getAllTournaments(): Promise<Tournament[]> {
        try {
            const actor = getActor();
            const result = await actor.get_all_tournaments();
            return result as Tournament[];
        } catch (error) {
            console.error("Error fetching all tournaments:", error);
            throw error;
        }
    },

    async getTournamentById(id: string): Promise<Tournament> {
        try {
            const actor = getActor();
            const result = await actor.get_tournament_by_id(id);
            return result as Tournament;
        } catch (error) {
            console.error(`Error fetching tournament with id ${id}:`, error);
            throw error;
        }
    },

    async getTournamentTeams(tournamentId: string): Promise<Team[]> {
        try {
            const actor = getActor();
            const result = await actor.get_tournament_teams(tournamentId);
            return result as Team[];
        } catch (error) {
            console.error(`Error fetching teams for tournament ${tournamentId}:`, error);
            throw error;
        }
    },

    async getPlayers(teamId: string): Promise<any[]> {
        try {
            const actor = getActor();
            const result = await actor.get_players(teamId);
            return result as any[];
        } catch (error) {
            console.error(`Error fetching players for team ${teamId}:`, error);
            throw error;
        }
    },
}; 