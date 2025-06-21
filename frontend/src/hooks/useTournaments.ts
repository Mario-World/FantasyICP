import { useState, useEffect, useCallback } from 'react';
import { tournamentService } from '../services/tournaments';
import type { Tournament } from '../types';

export const useTournaments = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllTournaments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await tournamentService.getAllTournaments();
            setTournaments(response);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to fetch tournaments');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllTournaments();
    }, [fetchAllTournaments]);

    return { tournaments, isLoading, error, refetch: fetchAllTournaments };
}; 