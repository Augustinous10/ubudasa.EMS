// src/components/attendance/AttendanceForm.jsx
import React, { useState, useEffect } from 'react';
import './attendance-form.css'; // optional CSS file

const AttendanceForm = ({ employees, onAddAttendance, addNewEmployee }) => {
  const [date, setDate] = useState('');
  const [isAllPresent, setIsAllPresent] = useState(false); // Track if all employees are present
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null); // Single image upload for the whole group

  // Reset the attendance form daily
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today); // Set default date to today
    setIsAllPresent(false); // Reset attendance status
    setNotes('');
    setImage(null);
  }, []); // This ensures the form resets when the component mounts (like for each new day)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create the attendance record for the day
    const newRecord = {
      id: Date.now().toString(),
      date,
      allPresent: isAllPresent, // Track if the whole team is present
      employeesPresent: isAllPresent ? employees.map(emp => emp.id) : [], // All employees are present
      notes,
      image,
    };

    // Add the attendance record
    onAddAttendance(newRecord);

    // Reset the form for the next day
    setDate('');
    setIsAllPresent(false);
    setNotes('');
    setImage(null);
  };

  const handleEmployeeToggle = () => {
    // This function will toggle between all present or all absent
    setIsAllPresent(prev => !prev);
  };

  return (
    <form className="attendance-form" onSubmit={handleSubmit}>
      <h3>Add Attendance Record</h3>

      <label>Date:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        disabled
      />

      <label>Attendance:</label>
      <div className="attendance-toggle">
        <button type="button" className={`toggle-btn ${isAllPresent ? 'active' : ''}`} onClick={handleEmployeeToggle}>
          {isAllPresent ? 'Mark as All Absent' : 'Mark as All Present'}
        </button>
      </div>

      <label>Notes:</label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

      <label>Upload Group Image:</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      <button type="submit">Add Record</button>
    </form>
  );
};

export default AttendanceForm;
