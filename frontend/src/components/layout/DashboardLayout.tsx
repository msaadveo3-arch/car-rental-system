import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [navigationOpen, setNavigationOpen] = useState(false);

  // الحماية: من غير دخول؟ روح على صفحة اللوجن
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="redwood-shell flex min-h-screen text-base-content">
      {navigationOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-neutral/45 backdrop-blur-[1px] lg:hidden"
          onClick={() => setNavigationOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <Sidebar mobileOpen={navigationOpen} onMobileClose={() => setNavigationOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenNavigation={() => setNavigationOpen(true)} />
        <main className="redwood-main flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
