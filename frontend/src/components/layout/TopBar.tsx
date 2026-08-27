import React, { useState } from 'react';
import { Home, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const TopBar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications] = useState(6); // رقم ثابت للـ badge - هنربطه بـ API بعدين

  return (
    <header className="h-16 bg-apple-dark-800/80 backdrop-blur-xs border-b border-apple-dark-700/50 shadow-apple flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left: Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-dark-400" size={18} />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 bg-apple-dark-700/50 border border-apple-dark-600 rounded-apple focus:ring-2 focus:ring-apple-accent-blue focus:bg-apple-dark-600 outline-none transition-colors text-apple-dark-50 placeholder-apple-dark-400"
            disabled
            title="Search feature coming soon"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <button
          onClick={() => navigate('/')}
          className="p-2 text-apple-dark-300 hover:bg-apple-dark-700/50 rounded-apple transition-colors"
          title="Home"
        >
          <Home size={20} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 text-apple-dark-300 hover:bg-apple-dark-700/50 rounded-apple transition-colors relative"
            title="Notifications"
          >
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-apple-accent-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-apple hover:bg-apple-dark-700/50 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-apple-accent-blue to-apple-accent-purple rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>

          {showDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-apple-dark-800/95 backdrop-blur-xs rounded-apple-xl shadow-apple-lg border border-apple-dark-700/50 py-2 z-50">
                <div className="px-4 py-3 border-b border-apple-dark-700/50">
                  <p className="text-sm font-semibold text-apple-dark-50">{user?.name || 'User'}</p>
                  <p className="text-xs text-apple-dark-400">{user?.email || 'user@example.com'}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-apple-dark-300 hover:bg-apple-dark-700/50 flex items-center gap-2"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-apple-dark-300 hover:bg-apple-dark-700/50 flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                </div>

                <div className="border-t border-apple-dark-700/50 py-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-apple-accent-pink hover:bg-apple-dark-700/50 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    SignOut
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;