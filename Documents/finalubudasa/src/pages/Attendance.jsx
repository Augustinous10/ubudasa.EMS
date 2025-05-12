import React, { useState, useEffect, useCallback } from 'react';
import './attendance.css';
import { useEmployee } from '../context/EmployeeContext';

const Attendance = ({ attendanceRecords, siteManagers = [] }) => {
  const { employees = [] } = useEmployee();
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  const filterAttendanceByDateAndManager = useCallback(() => {
    if (!Array.isArray(attendanceRecords)) {
      setFilteredAttendance([]);
      return;
    }

    const filtered = attendanceRecords.filter((record) => {
      const matchesDate = record.date === attendanceDate;
      const matchesManager = selectedManagerId ? record.siteManagerId === selectedManagerId : true;
      return matchesDate && matchesManager;
    });

    setFilteredAttendance(filtered);
  }, [attendanceRecords, attendanceDate, selectedManagerId]);

  useEffect(() => {
    filterAttendanceByDateAndManager();
  }, [filterAttendanceByDateAndManager]);

  return (
    <section className="attendance-report-container">
      <header className="attendance-header">
        <h2>Attendance Report</h2>

        <div className="filters">
          <div className="date-filter">
            <label htmlFor="attendance-date">Select Date:</label>
            <input
              type="date"
              id="attendance-date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>

          <div className="manager-filter">
            <label htmlFor="site-manager">Site Manager:</label>
            <select
              id="site-manager"
              value={selectedManagerId}
              onChange={(e) => setSelectedManagerId(e.target.value)}
            >
              <option value="">All</option>
              {siteManagers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="attendance-list">
        <h3>Attendance for {attendanceDate}</h3>

        {filteredAttendance.length === 0 ? (
          <p className="no-records">No attendance records for this date and manager.</p>
        ) : (
          <div className="attendance-grid">
            {filteredAttendance.map((record) => {
              const employee = employees.find(emp => emp.id === record.id);
              const manager = siteManagers.find(m => m.id === record.siteManagerId);

              return (
                <div key={record.id + record.siteManagerId} className="attendance-card">
                  <div className="attendance-info">
                    <h4>{employee?.name || 'Unknown Employee'}</h4>
                    <p className={`status-label ${record.status}`}>
                      Status: {record.status}
                    </p>
                    <p className="submitted-by">
                      Submitted by: {manager?.name || 'Unknown Manager'}
                    </p>
                  </div>
                  {record.status === 'present' && record.image && (
                    <div className="attendance-photo">
                      <img
                        src={record.image}
                        alt={`Attendance proof for ${employee?.name}`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Attendance;
