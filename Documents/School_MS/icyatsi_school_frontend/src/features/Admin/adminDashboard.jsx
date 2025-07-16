import React from 'react';
import MainLayout from '../../components/layout/MainLayout'; // adjust path

const AdminDashboard = () => {
  return (
    <MainLayout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back, Administrator!</p>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Students</h3>
            <p className="dashboard-number">1,234</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Teachers</h3>
            <p className="dashboard-number">56</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
