import { useState, useEffect, useCallback } from 'react';
import { contestService } from '../services/contests';
import type { Contest } from '../types';

export const useContests = (matchId: string) => {
    const [contests, setContests] = useState<Contest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContestsByMatch = useCallback(async (matchId: string) => {
        if (!matchId) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await contestService.getContestsByMatch(matchId);
            setContests(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch contests');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContestsByMatch(matchId);
    }, [fetchContestsByMatch, matchId]);

    return { contests, isLoading, error, refetch: fetchContestsByMatch };
}; 