// src/pages/Contests.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContestStore } from '../store';
import ContestCard from '../components/contests/ContestCard';
import Loading from '../components/common/Loading';
import ErrorBoundary from '../components/common/ErrorBoundary';

const Contests: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { contests, fetchContestsByMatch, isLoading, error } = useContestStore();

  useEffect(() => {
    if (matchId) {
      fetchContestsByMatch(matchId);
    }
  }, [matchId, fetchContestsByMatch]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Contests</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Contests; 