import React, { useState, useEffect, useCallback } from 'react';
import './attendance.css';

const Attendance = ({ employees, attendanceRecords }) => {
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  // Filter attendance based on selected date
  const filterAttendanceByDate = useCallback(() => {
    if (Array.isArray(attendanceRecords)) {
      const filtered = attendanceRecords.filter(
        (record) => record.date === attendanceDate
      );
      setFilteredAttendance(filtered);
    } else {
      setFilteredAttendance([]); // Fallback to empty array if attendanceRecords is not an array
    }
  }, [attendanceRecords, attendanceDate]);  // Add attendanceRecords and attendanceDate as dependencies

  // Run the filter when attendanceRecords or attendanceDate changes
  useEffect(() => {
    filterAttendanceByDate();
  }, [filterAttendanceByDate]);  // Use filterAttendanceByDate as the only dependency

  const handleDateChange = (e) => {
    setAttendanceDate(e.target.value);
  };

  return (
    <div className="attendance-report-container">
      <h2>Attendance Report</h2>

      {/* Date filter */}
      <div className="date-filter">
        <label htmlFor="attendance-date">Select Date: </label>
        <input
          type="date"
          id="attendance-date"
          value={attendanceDate}
          onChange={handleDateChange}
        />
      </div>

      {/* Attendance List */}
      <div className="attendance-list">
        <h3>Attendance for {attendanceDate}</h3>
        {filteredAttendance.length === 0 ? (
          <p>No attendance records for this date.</p>
        ) : (
          filteredAttendance.map((record) => {
            const employee = employees.find((emp) => emp.id === record.id);
            return (
              <div key={record.id} className="attendance-item">
                <div className="attendance-info">
                  <span>{employee ? employee.name : 'Unknown Employee'}</span>
                  <span>Status: {record.status}</span>
                </div>
                {record.status === 'present' && record.image && (
                  <div className="attendance-image">
                    <img
                      src={record.image}
                      alt={`${employee ? employee.name : 'Employee'}'s attendance`}
                      width="100"
                      height="100"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Attendance;
