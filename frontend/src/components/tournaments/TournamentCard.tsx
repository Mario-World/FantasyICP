// src/components/tournaments/TournamentCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Tournament } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface TournamentCardProps {
    tournament: Tournament;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
    return (
        <Link to={`/tournaments/${tournament.id}`} className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <img 
                className="w-full h-40 object-cover"
                src={tournament.imageUrl || `https://source.unsplash.com/random/400x200?${tournament.sport}`} 
                alt={tournament.name} 
            />
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">{tournament.name}</h2>
                <p className="text-sm text-gray-600">{tournament.sport}</p>
                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <p className="text-sm font-semibold text-gray-700">Prize Pool</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(tournament.prizePool, 'INR')}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700">Starts On</p>
                        <p className="text-md text-gray-800">{formatDate(tournament.startDate)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}; 