// src/pages/Tournaments.tsx
import React, { useEffect } from 'react';
import { useTournamentStore } from '../store';
// import { useTournaments } from '../hooks/useTournaments';
import { TournamentCard } from '../components/tournaments/TournamentCard';
import { Loading } from '../components/common';
import ErrorBoundary from '../components/common/ErrorBoundary';

const Tournaments: React.FC = () => {
    const { tournaments, fetchAllTournaments, isLoading, error } = useTournamentStore();

    useEffect(() => {
        fetchAllTournaments();
    }, [fetchAllTournaments]);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <ErrorBoundary>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Tournaments</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map((tournament) => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                    ))}
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Tournaments; 