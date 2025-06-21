// src/components/contests/ContestCard.tsx
import React from 'react';
import type { Contest } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';

interface ContestCardProps {
    contest: Contest;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
  return (
    <Link to={`/contests/${contest.id}`} className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">{contest.name}</h2>
            <p className="text-sm text-gray-600">Entry: {formatCurrency(contest.entryFee, 'INR')}</p>
            <div className="mt-4 flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-gray-700">Prize Pool</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(contest.prizePool, 'INR')}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-700">Status</p>
                    <p className="text-md text-gray-800">{contest.status}</p>
                </div>
            </div>
        </div>
    </Link>
  );
};

export default ContestCard; 