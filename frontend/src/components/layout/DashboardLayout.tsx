import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);

  // الحماية: من غير دخول؟ روح على صفحة اللوجن
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-base-100 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
