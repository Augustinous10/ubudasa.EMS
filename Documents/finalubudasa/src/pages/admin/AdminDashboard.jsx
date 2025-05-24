import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { useEmployee } from '../../context/EmployeeContext';
import { useAttendance } from '../../context/AttendanceContext';
import { usePayroll } from '../../context/PayrollContext';

import '../dashboard.css';

const Dashboard = () => {
  const { employees = [] } = useEmployee();
  const { records = [] } = useAttendance() || {};
  const { payrolls = [] } = usePayroll() || {};

  const [filterDate, setFilterDate] = useState('');

  // Filtered Attendance based on selected date
  const filteredAttendance = useMemo(() => {
    if (!filterDate) return records;
    return records.filter(record => record.date === filterDate);
  }, [records, filterDate]);

  // Total payroll (you can add date filter to this too if needed)
  const totalPayroll = payrolls.reduce((sum, p) => sum + Number(p.salary || 0), 0);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      {/* Filter UI */}
      <div className="dashboard-filters">
        <label htmlFor="filter-date">Filter by Date:</label>
        <input
          type="date"
          id="filter-date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Stats Cards */}
      <div className="card-grid">
        <Card title="Total Employees" value={employees.length} color="#3366ff" />
        <Card title="Attendance Records" value={filteredAttendance.length} color="#00b894" />
        <Card title="Total Payroll Paid" value={`${totalPayroll} RWF`} color="#e17055" />
      </div>
    </div>
  );
};

export default Dashboard;
