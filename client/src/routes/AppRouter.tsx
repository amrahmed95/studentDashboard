import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext';
import requireAuth from '../hoc/requireAuth';
import HomePage from '../pages/HomePage/HomePage'
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import DashboardPage from '../pages/DashboardPage'
import AllDueItemsPage from '../pages/AllDueItemsPage/AllDueItemsPage';
import AddAssignment from '../pages/AddAssignment/AddAssignment';
import EditAssignment from '../pages/EditAssignment/EditAssignment';
import AddQuiz from '../pages/AddQuiz/AddQuiz';
import EditQuiz from '../pages/EditQuiz/EditQuiz';

const AppRouter: React.FC = () => {

  const AuthenticatedDashboard = requireAuth(DashboardPage);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<AuthenticatedDashboard />} />
          <Route path="/all-due-items" element={<AllDueItemsPage />} />
          <Route path="/new-assignment" element={<AddAssignment />} />
          <Route path="/edit-assignment/:id" element={<EditAssignment />} />
          <Route path="/new-quiz" element={<AddQuiz />} />
          <Route path="/edit-quiz/:id" element={<EditQuiz />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter