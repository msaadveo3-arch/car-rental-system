import React, { useContext } from 'react';
import { LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ThemeController from '../common/ThemeController';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary text-primary-content flex items-center justify-center rounded">Logo</div>
        <h1 className="text-xl font-bold">Car Rental Dubai</h1>
      </div>
      <div className="flex-none flex items-center gap-3">
        <ThemeController />
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">{user?.full_name}</p>
          <p className="text-xs opacity-70 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          title="Logout"
          className="btn btn-sm btn-outline btn-error gap-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;