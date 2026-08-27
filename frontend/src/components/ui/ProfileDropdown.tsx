import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const ProfileDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </label>
      <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
        <li className="px-4 py-3 border-b border-base-200">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-xs opacity-70">{user?.email}</p>
        </li>
        <li>
          <a onClick={() => navigate('/profile')} className="gap-2">
            <User size={16} /> Profile
          </a>
        </li>
        <li>
          <a onClick={() => navigate('/settings')} className="gap-2">
            <Settings size={16} /> Settings
          </a>
        </li>
        <li className="border-t border-base-200 mt-2">
          <a onClick={logout} className="text-error gap-2">
            <LogOut size={16} /> Sign Out
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
