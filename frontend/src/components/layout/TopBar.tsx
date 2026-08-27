import React, { useState } from 'react';
import { Home, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ThemeController from '../common/ThemeController';

const TopBar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications] = useState(6); // رقم ثابت للـ badge - هنربطه بـ API بعدين

  return (
    <header className="navbar bg-base-100 border-b border-base-200 shadow-sm px-6 sticky top-0 z-50">
      {/* Left: Search */}
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={18} />
          <input
            type="text"
            placeholder="Search here..."
            className="input input-bordered w-full pl-10 pr-4 py-2 bg-base-200 focus:outline-none"
            disabled
            title="Search feature coming soon"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex-none flex items-center gap-3">
        {/* Home */}
        <button
          onClick={() => navigate('/')}
          className="btn btn-ghost btn-circle"
          title="Home"
        >
          <Home size={20} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="btn btn-ghost btn-circle relative"
            title="Notifications"
          >
            <Bell size={20} />
            {notifications > 0 && (
              <span className="badge badge-error badge-xs absolute top-2 right-2 text-white">
                {notifications}
              </span>
            )}
          </button>
        </div>

        {/* Theme Controller */}
        <ThemeController />

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </label>
          {showDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />

              {/* Dropdown Menu */}
              <ul tabIndex={0} className="mt-3 z-[51] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-56 border border-base-200">
                <li className="px-4 py-3 border-b border-base-200">
                  <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                  <p className="text-xs opacity-70">{user?.email || 'user@example.com'}</p>
                </li>

                <li>
                  <a
                    onClick={() => {
                      navigate('/profile');
                      setShowDropdown(false);
                    }}
                    className="gap-2"
                  >
                    <User size={16} />
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      navigate('/settings');
                      setShowDropdown(false);
                    }}
                    className="gap-2"
                  >
                    <Settings size={16} />
                    Settings
                  </a>
                </li>

                <li className="border-t border-base-200 mt-2">
                  <a
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="text-error gap-2"
                  >
                    <LogOut size={16} />
                    SignOut
                  </a>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
