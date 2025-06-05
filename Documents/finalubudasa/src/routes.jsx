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
import SiteManager from './pages/SiteManager';
import AdminDashboard from './pages/admin/AdminDashboard';
import SiteManagerDashboard from './pages/siteManager/SiteManagerDashboard';
import RegisterSite from './pages/RegisterSite';  // <-- updated import here
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = ({ onMarkAttendance }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Shared Protected Layout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SITE_MANAGER']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Common Dashboard Routes Inside Layout */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/site-manager/dashboard" element={<SiteManagerDashboard />} />

        {/* Other pages inside layout */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees onMarkAttendance={onMarkAttendance} />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/daily-report" element={<DailyReport />} />
        <Route path="/site" element={<RegisterSite />} />

        {/* SiteManager page protected */}
        <Route
          path="/site-manager"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SITE_MANAGER']}>
              <SiteManager />
            </ProtectedRoute>
          }
        />

        {/* New Admin-only RegisterSite Route */}
        <Route
          path="/admin/sites"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <RegisterSite />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
