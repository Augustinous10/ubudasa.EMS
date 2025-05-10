// Employees.js
import React, { useState, useEffect } from 'react';
import './employees.css';
import Attendance from './Attendance';  // Correct import

const Employees = ({ onMarkAttendance }) => {
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [employees, setEmployees] = useState([]);
  const [attendanceForTheDay, setAttendanceForTheDay] = useState([]);  // Always an array
  const [attendanceDate, setAttendanceDate] = useState('');  // Initialize with an empty string
  const [groupImage, setGroupImage] = useState(null); // Store group image for all present employees

  // UseEffect to set the current date when the component mounts
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];  // Format date as YYYY-MM-DD
    setAttendanceDate(today);  // Set the date to today's date
  }, []);

  const handleAddEmployee = () => {
    if (newEmployeeName.trim() !== '') {
      const newEmployee = {
        id: Date.now().toString(),
        name: newEmployeeName,
        status: 'absent',  // Default status is 'absent'
        image: ''
      };
      setEmployees((prev) => [...prev, newEmployee]);
      setNewEmployeeName('');
    }
  };

  const handleMarkPresent = (employeeId) => {
    const updatedEmployees = employees.map((emp) => {
      if (emp.id === employeeId) {
        emp.status = 'present';
      }
      return emp;
    });
    setEmployees(updatedEmployees);

    const employee = employees.find((emp) => emp.id === employeeId);
    if (employee && !attendanceForTheDay.some(emp => emp.id === employee.id)) {
      const updatedAttendance = [...attendanceForTheDay, { ...employee, date: attendanceDate }];
      setAttendanceForTheDay(updatedAttendance);
    }
  };

  const handleGroupImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setGroupImage(imageUrl);  // Store the uploaded group image
    }
  };

  const handleAddAttendanceForTheDay = () => {
    if (attendanceForTheDay.length > 0) {
      const updatedAttendance = attendanceForTheDay.map((record) => ({
        ...record,
        image: groupImage, // Assign the group image
      }));

      onMarkAttendance(updatedAttendance);  // This will pass the attendance to the parent
      setAttendanceForTheDay([]);  // Clear the list for the next day
      setGroupImage(null);  // Reset the group image
    }
  };

  return (
    <div className="employee-management">
      <h2>Employee Management</h2>
      <div className="add-employee-form">
        <input
          type="text"
          value={newEmployeeName}
          onChange={(e) => setNewEmployeeName(e.target.value)}
          placeholder="Enter employee name"
        />
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>

      <div className="employee-list">
        <h3>Employees</h3>
        {employees.map((employee) => (
          <div key={employee.id} className="employee-item">
            <span>{employee.name}</span>
            <span>Status: {employee.status}</span>
            {employee.status === 'absent' && (
              <button onClick={() => handleMarkPresent(employee.id)}>Mark Present</button>
            )}
          </div>
        ))}
      </div>

      {attendanceForTheDay.length > 0 && (
        <div className="group-image-upload">
          <label htmlFor="group-image-upload">Upload Group Image for Present Employees:</label>
          <input
            id="group-image-upload"
            type="file"
            accept="image/*"
            onChange={handleGroupImageUpload}
          />
        </div>
      )}

      <div className="attendance-report">
        <h3>Today's Attendance</h3>
        <button onClick={handleAddAttendanceForTheDay}>Finalize Today's Attendance</button>
        <Attendance attendance={attendanceForTheDay} />
      </div>
    </div>
  );
};

export default Employees;
