import React from 'react';

const AdminDashboard = () => {
  return (
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
  );
};

export default AdminDashboard;
