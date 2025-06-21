// src/pages/MyTeams.tsx
import React, { useEffect } from 'react';
import { useUserStore } from '../store';
import Loading from '../components/common/Loading';
import ErrorBoundary from '../components/common/ErrorBoundary';

const MyTeams: React.FC = () => {
  const { fantasyTeams, fetchUserFantasyTeams, isLoading, error } = useUserStore();

  useEffect(() => {
    fetchUserFantasyTeams();
  }, [fetchUserFantasyTeams]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Teams</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fantasyTeams.map((team) => (
            <div key={team.id} className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold">{team.name}</h2>
              <p>Total Points: {team.totalPoints}</p>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MyTeams; 