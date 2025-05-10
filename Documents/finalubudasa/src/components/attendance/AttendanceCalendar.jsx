import React, { useState, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AttendanceContext } from '../../context/AttendanceContext'; // Assuming you're using a context for attendance data
import './AttendanceCalendar.css'; // Import the custom CSS file

const AttendanceCalendar = () => {
  const { attendanceRecords } = useContext(AttendanceContext); // Use the attendance data from context
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isDateMarked = (date) => {
    const formatted = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return attendanceRecords.some(record => record.date === formatted); // Check if the date is marked in the records
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month' && isDateMarked(date)) {
      return <div className="attendance-mark"></div>; // Display a mark on the date
    }
    return null;
  };

  return (
    <div className="attendance-calendar-container">
      <h3 className="attendance-calendar-title">Attendance Calendar</h3>
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        tileContent={tileContent} // Mark the dates with attendance records
      />
    </div>
  );
};

export default AttendanceCalendar;
