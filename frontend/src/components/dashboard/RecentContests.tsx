// src/components/dashboard/RecentContests.tsx
import React from 'react';
import type { ContestEntry } from '../../types';
import { Link } from 'react-router-dom';

interface RecentContestsProps {
    contests: ContestEntry[];
}

const RecentContests: React.FC<RecentContestsProps> = ({ contests }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold">Recent Contests</h2>
      <ul>
        {contests.slice(0, 5).map(entry => (
            <li key={entry.contestId}>
                <Link to={`/contests/${entry.contestId}`} className="text-blue-500 hover:underline">
                    Contest {entry.contestId} - Rank: {entry.rank}
                </Link>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentContests; 