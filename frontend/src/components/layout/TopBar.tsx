import React, { useState } from 'react';
import { LogOut, Menu, Moon, Sun, UserRound } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/customers': 'Customers',
  '/cars': 'Fleet',
  '/lookups': 'Reference data',
  '/booking': 'New rental contract',
  '/rentals': 'Rental contracts',
  '/reports': 'Reports',
  '/inspection-queue': 'Inspection queue',
};

interface TopBarProps {
  onOpenNavigation: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenNavigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const rootPath = `/${location.pathname.split('/').filter(Boolean)[0] ?? ''}`;
  const pageName = pageNames[location.pathname] ?? pageNames[rootPath] ?? 'Fleet operations';
  const displayName = (user as any)?.full_name ?? user?.name ?? 'User';

  return (
    <header className="navbar sticky top-0 z-40 min-h-[4.5rem] border-b border-base-300 bg-base-100/95 px-3 backdrop-blur-sm sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="btn btn-ghost btn-square btn-sm lg:hidden"
          onClick={onOpenNavigation}
          aria-label="Open navigation"
        >
          <Menu size={20} aria-hidden />
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-base-content/50">Car rental system</p>
          <p className="truncate text-sm font-semibold text-base-content">{pageName}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <label
          className="swap swap-rotate btn btn-ghost btn-square btn-sm"
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
            className="btn btn-ghost gap-2 px-2 sm:px-3"
            aria-label="Open user menu"
            aria-expanded={showDropdown}
          >
            <div className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden max-w-32 truncate text-sm font-medium md:inline">{displayName}</span>
          </button>

          {showDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />

              {/* Dropdown Menu */}
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-box border border-base-300 bg-base-100 py-2 shadow-redwood-lg">
                <div className="px-4 py-3 border-b border-base-300">
                  <p className="text-sm font-semibold text-base-content">{displayName}</p>
                  <p className="text-xs text-base-content/60">{user?.email || 'user@example.com'}</p>
                </div>

                <div className="flex items-center gap-2 px-4 py-3 text-sm text-base-content/65">
                  <UserRound size={16} aria-hidden />
                  <span className="capitalize">{(user as any)?.role ?? 'staff'} access</span>
                </div>

                <div className="border-t border-base-300 py-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="btn btn-ghost h-auto min-h-10 w-full justify-start gap-2 px-4 py-2 text-sm text-error hover:bg-error/10"
                  >
                    <LogOut size={16} />
                    Sign out
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
