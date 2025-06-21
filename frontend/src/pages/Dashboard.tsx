// src/pages/Dashboard.tsx
import React, { useEffect } from 'react';
import { useUserStore, useAuthStore } from '../store';
import { BalanceCard, RecentContests, Notifications } from '../components/dashboard';
import ErrorBoundary from '../components/common/ErrorBoundary';

const Dashboard: React.FC = () => {
  const { contestEntries, transactions, fetchUserContestEntries, fetchUserTransactions } = useUserStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchUserContestEntries();
    fetchUserTransactions();
  }, [fetchUserContestEntries, fetchUserTransactions]);

  return (
    <ErrorBoundary>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <BalanceCard balance={user?.balance || 0} />
          <RecentContests contests={contestEntries} />
          <Notifications transactions={transactions} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard; 