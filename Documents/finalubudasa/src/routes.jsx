import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import DailyReport from './pages/DailyReport';
import SiteManager from './pages/SiteManager'; // ✅ Already Added
import Login from './pages/Login';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = ({ onMarkAttendance }) => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes inside Main Layout */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees onMarkAttendance={onMarkAttendance} />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/daily-report" element={<DailyReport />} />
        <Route path="/site-manager" element={<SiteManager />} /> {/* ✅ Site Managers Route */}
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
