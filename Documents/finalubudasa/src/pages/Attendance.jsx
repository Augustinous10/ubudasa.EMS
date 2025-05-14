import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './attendance.css';
import { useEmployee } from '../context/EmployeeContext';
import { useDailyReport } from '../context/DailyReportContext';

const Attendance = ({ attendanceRecords, siteManagers = [] }) => {
  const { employees = [] } = useEmployee();
  const dailyReportContext = useDailyReport();
  const dailyReports = useMemo(() => dailyReportContext?.dailyReports || [], [dailyReportContext]);

  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

  const filterData = useCallback(() => {
    const filteredAtt = Array.isArray(attendanceRecords)
      ? attendanceRecords.filter(record => {
          const matchesDate = record.date === attendanceDate;
          const matchesManager = selectedManagerId ? record.siteManagerId === selectedManagerId : true;
          return matchesDate && matchesManager;
        })
      : [];

    const filteredRep = Array.isArray(dailyReports)
      ? dailyReports.filter(report => {
          const matchesDate = report.date === attendanceDate;
          const matchesManager = selectedManagerId ? report.managerId === selectedManagerId : true;
          return matchesDate && matchesManager;
        })
      : [];

    setFilteredAttendance(filteredAtt);
    setFilteredReports(filteredRep);
  }, [attendanceRecords, dailyReports, attendanceDate, selectedManagerId]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const resetFilters = () => {
    setAttendanceDate('');
    setSelectedManagerId('');
  };

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

          <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
        </div>
      </header>

      {/* Attendance Section */}
      <div className="attendance-list">
        <h3>Attendance for {attendanceDate || 'All Dates'}</h3>

        {filteredAttendance.length === 0 ? (
          <p className="no-records">
            No attendance records found for {attendanceDate || 'any date'}
            {selectedManagerId && ` under manager ${siteManagers.find(m => m.id === selectedManagerId)?.name || 'Unknown'}`}.
          </p>
        ) : (
          <>
            <div className="summary">
              <p>Total: {filteredAttendance.length}</p>
              <p>Present: {filteredAttendance.filter(r => r.status === 'present').length}</p>
              <p>Absent: {filteredAttendance.filter(r => r.status === 'absent').length}</p>
            </div>

            <div className="attendance-grid">
              {filteredAttendance.map((record) => {
                const employee = employees.find(emp => emp.id === record.id);
                const manager = siteManagers.find(m => m.id === record.siteManagerId);

                return (
                  <div
                    key={`${record.id}-${record.date}-${record.siteManagerId}`}
                    className="attendance-card"
                  >
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
          </>
        )}
      </div>

      {/* Daily Reports Section */}
      <div className="daily-reports">
        <h3>Daily Reports for {attendanceDate || 'All Dates'}</h3>

        {filteredReports.length === 0 ? (
          <p className="no-records">
            No daily reports found for {attendanceDate || 'any date'}
            {selectedManagerId && ` under manager ${siteManagers.find(m => m.id === selectedManagerId)?.name || 'Unknown'}`}.
          </p>
        ) : (
          <div className="report-grid">
            {filteredReports.map((report, idx) => {
              const manager = siteManagers.find(m => m.id === report.managerId);

              return (
                <div key={idx} className="report-card">
                  <h4>{manager?.name || 'Unknown Manager'}</h4>
                  <p><strong>Time:</strong> {report.time}</p>
                  <p><strong>Activities:</strong> {report.activities}</p>
                  <p><strong>Next Day Plan:</strong> {report.nextPlan}</p>
                  <p><strong>Comments:</strong> {report.comments}</p>
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
