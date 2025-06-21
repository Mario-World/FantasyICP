import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 mt-5 text-gray-600 rounded-md hover:bg-gray-200 ${
      isActive ? 'bg-gray-200' : ''
    }`;

  return (
    <div className="hidden md:flex flex-col w-64 bg-white">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-white">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/tournaments" className={navLinkClass}>
            Tournaments
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/my-teams" className={navLinkClass}>
                My Teams
              </NavLink>
              <NavLink to="/rewards" className={navLinkClass}>
                Rewards
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}; 