import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface BalanceCardProps {
    balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold">Balance</h2>
      <p className="text-2xl">{formatCurrency(balance, 'INR')}</p>
    </div>
  );
};

export default BalanceCard; 