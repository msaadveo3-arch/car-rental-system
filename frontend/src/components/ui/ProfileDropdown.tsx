import React from 'react';

const ProfileDropdown: React.FC = () => {
  return (
    <div className="dropdown dropdown-end">
      <button type="button" tabIndex={0} className="btn btn-ghost btn-sm">Profile</button>
      <ul tabIndex={0} className="menu dropdown-content z-[1] mt-2 w-40 rounded-box bg-base-100 p-2 shadow border border-base-300">
        <li><span className="text-base-content/60">Profile actions</span></li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
