import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar/Sidebar'
import Topbar from '../components/Topbar/Topbar'
import Dashboard from '../components/Dashboard/Dashboard'

const DashboardPage: React.FC = () => {

  const { user, logout } = useAuth();

  // Additional Check for token
  if(!localStorage.getItem('token')) {
    return <Navigate to="/" replace />
  }

  const username = localStorage.getItem('username')

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName={ username || user?.name || ''} onLogout={logout} />
        <main className="flex-1 overflow-y-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};
export default DashboardPage