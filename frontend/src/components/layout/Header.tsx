import React, { useContext } from 'react';
import { LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between p-4 border-b border-base-300 bg-base-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary text-primary-content flex items-center justify-center rounded">Logo</div>
        <h1 className="text-xl font-bold">Car Rental Dubai</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-base-content">{user?.full_name}</p>
          <p className="text-xs text-base-content/60 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          title="Logout"
          className="btn btn-ghost btn-sm border-base-300 text-base-content/70 hover:bg-error/10 hover:text-error"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
