import React, { useContext } from 'react';
import { LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded">Logo</div>
        <h1 className="text-xl font-bold">Car Rental Dubai</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">{user?.full_name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          title="Logout"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;