import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './features/auth/Login';
import Student from './pages/Students';

import RoleBasedDashboard from './features/RoleBasedDashboard';

import AdminDashboard from './features/Admin/adminDashboard';
import HeadTeacherDashboard from './features/Head_teacher/HeadTeacherDashboard';
import AccountantDashboard from './features/Accountant/accountantDashboard';
import CasheirDashboard from './features/Casheir/CasheirDashboard';

import MainLayout from './components/layout/MainLayout'; // 🧠 Make sure this path is correct

// 404 Not Found component
const NotFound = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif'
  }}>
    <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
    <p style={{ fontSize: '1.5rem' }}>Page Not Found</p>
  </div>
);

function App() {
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<RoleBasedDashboard userRole={userRole} />} />

        {/* Protected Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/headteacher" element={<HeadTeacherDashboard />} />
          <Route path="/dashboard/accountant" element={<AccountantDashboard />} />
          <Route path="/dashboard/cashier" element={<CasheirDashboard />} />

          {/* Other pages inside layout */}
          <Route path="/students" element={<Student />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
