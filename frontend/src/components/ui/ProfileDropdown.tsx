import React from 'react';
import { UserRound } from 'lucide-react';

const ProfileDropdown: React.FC = () => {
  return (
    <div className="dropdown dropdown-end">
      <button type="button" tabIndex={0} className="btn btn-ghost btn-sm gap-2">
        <UserRound size={16} aria-hidden /> Account
      </button>
      <ul tabIndex={0} className="menu dropdown-content z-[1] mt-2 w-48 rounded-box border border-base-300 bg-base-100 p-2 shadow-redwood">
        <li><span className="text-sm text-base-content/60">Account actions</span></li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
