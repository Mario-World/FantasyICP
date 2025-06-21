// src/pages/Profile.tsx
import React from 'react';
import { useAuthStore } from '../store';
import ErrorBoundary from '../components/common/ErrorBoundary';

const Profile: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Balance:</strong> {Number(user.balance)}
          </p>
          <p>
            <strong>KYC Status:</strong> {Object.keys(user.kyc_status)[0]}
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Profile; 