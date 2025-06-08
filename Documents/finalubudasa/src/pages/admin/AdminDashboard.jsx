// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/common/Card';
import {
  fetchEmployees,
  fetchAttendance,
  fetchSiteManagers,
  fetchSites,
} from '../../api/DashboardAPI';

import './AdminDashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [siteManagers, setSiteManagers] = useState([]);
  const [sites, setSites] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          empData,
          attData,
          managerData,
          siteData,
        ] = await Promise.all([
          fetchEmployees(),
          fetchAttendance(),
          fetchSiteManagers(),
          fetchSites(),
        ]);
        setEmployees(empData);
        setRecords(attData);
        setSiteManagers(managerData);
        setSites(siteData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAttendance = useMemo(() => {
    if (!filterDate) return records;
    return records.filter(record => record.date === filterDate);
  }, [records, filterDate]);

  if (loading) return <div className="admin-dashboard"><p>Loading dashboard data...</p></div>;
  if (error) return <div className="admin-dashboard"><p>Error loading dashboard data: {error}</p></div>;

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="dashboard-filters">
        <label htmlFor="filter-date">Filter by Date:</label>
        <input
          type="date"
          id="filter-date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="dashboard-date-input"
        />
      </div>

      <div className="dashboard-card-grid">
        <Card title="Total Employees" value={employees.length} className="card card-blue" />
        <Card title="Attendance Records" value={filteredAttendance.length} className="card card-green" />
        <Card title="Total Site Managers" value={siteManagers.length} className="card card-purple" />
        <Card title="Total Sites" value={sites.length} className="card card-yellow" />
      </div>
    </div>
  );
};

export default Dashboard;
