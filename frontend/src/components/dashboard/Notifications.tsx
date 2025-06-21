// src/components/dashboard/Notifications.tsx
import React from 'react';
import type { RewardTransaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface NotificationsProps {
    transactions: RewardTransaction[];
}

const Notifications: React.FC<NotificationsProps> = ({ transactions }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold">Recent Transactions</h2>
      <ul>
        {transactions.slice(0, 5).map(tx => (
            <li key={tx.id}>
                <span>{formatDate(tx.timestamp)}: {tx.type} - {formatCurrency(tx.amount, 'INR')}</span>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications; 