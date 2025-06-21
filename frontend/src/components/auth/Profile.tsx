import React, { useState } from 'react';

interface UserProfile {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  balance: number;
  totalWinnings: number;
  contestsPlayed: number;
  contestsWon: number;
  joinDate: Date;
  avatar?: string;
}

interface ProfileProps {
  user: UserProfile;
  onUpdateProfile: (updatedData: Partial<UserProfile>) => void;
  onAddBalance: (amount: number) => void;
  onLogout: () => void;
  isLoading?: boolean;
}

const Profile: React.FC<ProfileProps> = ({ 
  user, 
  onUpdateProfile, 
  onAddBalance, 
  onLogout, 
  isLoading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingBalance, setIsAddingBalance] = useState(false);
  const [editData, setEditData] = useState({
    username: user.username,
    email: user.email || '',
    phone: user.phone || ''
  });
  const [balanceAmount, setBalanceAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditData({
        username: user.username,
        email: user.email || '',
        phone: user.phone || ''
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    const newErrors: Record<string, string> = {};

    if (!editData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (editData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (editData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(editData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onUpdateProfile({
        username: editData.username,
        email: editData.email || undefined,
        phone: editData.phone || undefined
      });
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    }
  };

  const handleAddBalance = async () => {
    const amount = parseFloat(balanceAmount);
    
    if (!amount || amount <= 0) {
      setErrors({ balance: 'Please enter a valid amount' });
      return;
    }

    if (amount > 10000) {
      setErrors({ balance: 'Maximum amount is ₹10,000' });
      return;
    }

    try {
      await onAddBalance(amount);
      setBalanceAmount('');
      setIsAddingBalance(false);
      setErrors({});
    } catch (error) {
      setErrors({ balance: 'Failed to add balance. Please try again.' });
    }
  };

  const stats = [
    {
      label: 'Total Winnings',
      value: `₹${user.totalWinnings.toLocaleString()}`,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'text-green-600'
    },
    {
      label: 'Contests Played',
      value: user.contestsPlayed.toString(),
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-blue-600'
    },
    {
      label: 'Contests Won',
      value: user.contestsWon.toString(),
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-yellow-600'
    },
    {
      label: 'Win Rate',
      value: `${user.contestsPlayed > 0 ? Math.round((user.contestsWon / user.contestsPlayed) * 100) : 0}%`,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="h-20 w-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="h-20 w-20 rounded-full object-cover" />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>

            {/* User Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.username}</h2>
              <p className="text-gray-600 mb-2">
                Member since {user.joinDate.toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-green-600">
                  Balance: ₹{user.balance.toLocaleString()}
                </span>
                <button
                  onClick={() => setIsAddingBalance(true)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Balance
                </button>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={handleEditToggle}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>
          
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              {isEditing ? (
                <input
                  id="username"
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              ) : (
                <p className="text-gray-900 py-2">{user.username}</p>
              )}
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              ) : (
                <p className="text-gray-900 py-2">{user.email || 'Not provided'}</p>
              )}
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  id="phone"
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              ) : (
                <p className="text-gray-900 py-2">{user.phone || 'Not provided'}</p>
              )}
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Balance
              </label>
              <p className="text-gray-900 py-2 font-semibold">₹{user.balance.toLocaleString()}</p>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Add Balance Modal */}
        {isAddingBalance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Balance</h3>
              
              {errors.balance && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                  {errors.balance}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  id="balance"
                  type="number"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  min="1"
                  max="10000"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsAddingBalance(false);
                    setBalanceAmount('');
                    setErrors({});
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBalance}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Balance'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 