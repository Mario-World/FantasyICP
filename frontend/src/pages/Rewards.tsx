// src/pages/Rewards.tsx
import React, { useEffect } from 'react';
import { useUserStore } from '../store';
import Loading from '../components/common/Loading';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { formatCurrency, formatDate } from '../utils/formatters';

const Rewards: React.FC = () => {
  const { transactions, fetchUserTransactions, isLoading, error } = useUserStore();

  useEffect(() => {
    fetchUserTransactions();
  }, [fetchUserTransactions]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Rewards & Transactions</h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Transaction History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-white p-4 rounded-lg shadow">
                <p>Amount: {formatCurrency(transaction.amount, 'INR')}</p>
                <p>Type: {transaction.type}</p>
                <p>Status: {transaction.status}</p>
                <p>Date: {formatDate(transaction.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Rewards; 