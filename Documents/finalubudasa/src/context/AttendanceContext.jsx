// AttendanceContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const AttendanceContext = createContext();

// Custom hook for using the attendance context
export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  
  // Function to mark attendance - this is what was missing
  const markAttendance = (attendanceData) => {
    console.log('Attendance marked:', attendanceData);
    
    // Add the new attendance data to our records
    setAttendanceRecords(prevRecords => [...prevRecords, ...attendanceData]);
    
    // You can also save this to localStorage or send to an API here
    // Example API call:
    // fetch('/api/attendance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(attendanceData)
    // });
  };

  // Other attendance-related functions you might need
  const getAllAttendance = () => {
    return attendanceRecords;
  };

  const getAttendanceByDate = (date) => {
    return attendanceRecords.filter(record => record.date === date);
  };

  // Values and functions to provide through the context
  const value = {
    attendanceRecords,
    markAttendance,      // <-- This is the function that will replace onMarkAttendance
    getAllAttendance,
    getAttendanceByDate
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;