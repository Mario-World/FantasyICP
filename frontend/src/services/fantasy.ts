// src/services/fantasy.ts
import { createActor } from './actor';
import { useAuthStore } from '../store';
import type { FantasyTeam } from '../types';

const getActor = () => {
  const { identity } = useAuthStore.getState();
  return createActor(identity);
};

export const fantasyService = {
    async getUserTeams(): Promise<FantasyTeam[]> {
        try {
            const actor = getActor();
            const result = await actor.get_user_teams();
            return result as FantasyTeam[];
        } catch (error) {
            console.error("Error fetching user teams:", error);
            throw error;
        }
    },

    async createFantasyTeam(teamData: Omit<FantasyTeam, 'id' | 'userId' | 'totalPoints'>): Promise<FantasyTeam> {
        try {
            const actor = getActor();
            const result = await actor.create_fantasy_team(teamData);
            return result as FantasyTeam;
        } catch (error) {
            console.error("Error creating fantasy team:", error);
            throw error;
        }
    },

    async getTeamById(teamId: string): Promise<FantasyTeam> {
        try {
            const actor = getActor();
            const result = await actor.get_team_by_id(teamId);
            return result as FantasyTeam;
        } catch (error) {
            console.error(`Error fetching team ${teamId}:`, error);
            throw error;
        }
    },

    async updateTeam(teamId: string, teamData: Partial<FantasyTeam>): Promise<FantasyTeam> {
        try {
            const actor = getActor();
            const result = await actor.update_team(teamId, teamData);
            return result as FantasyTeam;
        } catch (error) {
            console.error(`Error updating team ${teamId}:`, error);
            throw error;
        }
    },

    async deleteTeam(teamId: string): Promise<boolean> {
        try {
            const actor = getActor();
            const result = await actor.delete_team(teamId);
            return result as boolean;
        } catch (error) {
            console.error(`Error deleting team ${teamId}:`, error);
            throw error;
        }
    },
}; 