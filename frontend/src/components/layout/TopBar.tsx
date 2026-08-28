import React, { useState } from 'react';
import { Home, Bell, Search, User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

const TopBar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications] = useState(6); // رقم ثابت للـ badge - هنربطه بـ API بعدين

  return (
    <header className="navbar min-h-16 bg-base-100 border-b border-base-300 shadow-sm px-4 sm:px-6 sticky top-0 z-50">
      {/* Left: Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-52 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" size={16} />
          <input
            type="text"
            placeholder="Search here..."
            className="input input-bordered input-sm h-9 min-h-9 w-full bg-base-200 pl-9 pr-3 text-sm focus:outline-primary"
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
          className="btn btn-ghost btn-square btn-sm"
          title="Home"
        >
          <Home size={20} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="btn btn-ghost btn-square btn-sm relative"
            title="Notifications"
          >
            <Bell size={20} />
            {notifications > 0 && (
              <span className="badge badge-error badge-xs absolute top-1 right-1 text-[10px] font-bold">
                {notifications}
              </span>
            )}
          </button>
        </div>

        <label
          className="swap swap-rotate btn btn-ghost btn-circle btn-sm"
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          <input
            type="checkbox"
            className="theme-controller"
            value="dark"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          <Sun className="swap-on" size={18} />
          <Moon className="swap-off" size={18} />
        </label>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-content font-bold text-sm">
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
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-base-100 shadow-lg border border-base-300 py-2 z-50">
                <div className="px-4 py-3 border-b border-base-300">
                  <p className="text-sm font-semibold text-base-content">{user?.name || 'User'}</p>
                  <p className="text-xs text-base-content/60">{user?.email || 'user@example.com'}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-base-content/80 hover:bg-base-200 flex items-center gap-2"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-base-content/80 hover:bg-base-200 flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                </div>

                <div className="border-t border-base-300 py-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center gap-2"
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
