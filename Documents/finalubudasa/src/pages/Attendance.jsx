import React from 'react';
import '../pages/attendance.css'
const AttendanceList = ({ attendanceRecords, employees, onUploadImage }) => {
  // Create a map for fast employee name lookup
  const employeeMap = employees.reduce((map, emp) => {
    map[emp.id] = emp.name;
    return map;
  }, {});

  return (
    <div className="attendance-list-container">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <td>{employeeMap[record.employeeId] || 'Unknown Employee'}</td>
              <td>{record.status || 'Present'}</td>
              <td>
                <button 
                  className="upload-btn" 
                  onClick={() => onUploadImage(record.date)}
                >
                  Upload Image
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;
