import React, { useContext } from 'react';
import { CarFront, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex min-h-[4.5rem] items-center justify-between gap-4 border-b border-base-300 bg-base-100 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-btn bg-primary/10 text-primary">
          <CarFront size={21} aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-medium text-base-content/50">Fleet operations</p>
          <p className="font-serif text-xl leading-tight text-base-content">Car rental system</p>
        </div>
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
          <LogOut size={16} aria-hidden /> Sign out
        </button>
      </div>
    </header>
  );
};

export default Header;
