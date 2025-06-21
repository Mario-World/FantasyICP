import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME } from '../../utils/constants';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            {APP_NAME}
          </Link>
          <div className="flex items-center">
            <Link to="/tournaments" className="mx-2 text-gray-600 hover:text-gray-800">
              Tournaments
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="mx-2 text-gray-600 hover:text-gray-800">
                  Dashboard
                </Link>
                <span className="mx-2 text-gray-600">Balance: ${user?.balance.toFixed(2)}</span>
                <button onClick={logout} className="mx-2 text-gray-600 hover:text-gray-800">
                  Logout
                </button>
                <Link to="/profile">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
                    alt="User"
                  />
                </Link>
              </>
            ) : (
              <Link to="/login" className="mx-2 text-gray-600 hover:text-gray-800">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}; 