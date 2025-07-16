import React from 'react';
import MainLayout from '../components/layout/MainLayout'; // adjust if your path is different

const Dashboard = () => {
  return (
    <MainLayout>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Welcome to the School Management System dashboard.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb' 
          }}>
            <h3>Total Students</h3>
            <p style={{ fontSize: '2rem', color: '#3b82f6' }}>1,234</p>
          </div>
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.5rem', 
            border: '1px solid #e5e7eb' 
          }}>
            <h3>Total Teachers</h3>
            <p style={{ fontSize: '2rem', color: '#10b981' }}>56</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
