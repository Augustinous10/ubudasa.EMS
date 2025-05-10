import React, { useState } from 'react';
import './attendance-list.css'; // Custom CSS for styling

const AttendanceList = ({ attendanceRecords = [], employees = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getEmployeeNameById = (id) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? emp.name : `Unknown ID: ${id}`;
  };

  const filteredRecords = attendanceRecords.filter(record =>
    record?.employeesPresent?.some(id =>
      getEmployeeNameById(id).toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    (record.notes && record.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (record.date && record.date.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="attendance-list">
      <h2>Attendance Records</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name, date, or notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="attendance-search-bar"
      />

      {filteredRecords.length === 0 ? (
        <p className="no-records">No matching records found.</p>
      ) : (
        filteredRecords.map((record) => (
          <div key={record.id} className="attendance-record">
            <div className="attendance-header">
              <div className="attendance-date">{record.date}</div>
              <div className="attendance-status">
                Present: {record.employeesPresent?.length || 0}
              </div>
            </div>

            <div className="attendance-employees">
              {record.employeesPresent?.map((id, index) => (
                <span key={id} className="employee-name">
                  {getEmployeeNameById(id)}
                  {index < record.employeesPresent.length - 1 && ', '}
                </span>
              ))}
            </div>

            {record.notes && (
              <div className="attendance-notes">
                <strong>Notes:</strong> {record.notes}
              </div>
            )}

            {record.images?.length > 0 && (
              <div className="attendance-images">
                {record.images.map((img, index) => (
                  <div key={index} className="attendance-image">
                    <img src={img} alt={`Attendance visual ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AttendanceList;
