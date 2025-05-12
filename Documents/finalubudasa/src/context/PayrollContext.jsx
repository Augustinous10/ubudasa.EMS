// Updated PayrollContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useAttendance } from './AttendanceContext'; // Import the hook instead of the context directly

// Create the payroll context
const PayrollContext = createContext();

// Custom hook for using the payroll context
export const usePayroll = () => useContext(PayrollContext);

export const PayrollProvider = ({ children }) => {
  const [payrollRecords, setPayrollRecords] = useState([]);
  
  // Use the attendance hook to access attendance data
  const { attendanceRecords } = useAttendance();
  
  // Example functionality
  const calculatePayroll = (employeeId, startDate, endDate) => {
    // Example calculation logic using attendance data
    const relevantAttendance = attendanceRecords.filter(record => 
      record.id === employeeId && 
      new Date(record.date) >= new Date(startDate) &&
      new Date(record.date) <= new Date(endDate) &&
      record.status === 'present'
    );
    
    // Calculate pay based on attendance
    const daysPresent = relevantAttendance.length;
    const dailyRate = 100; // Example rate
    const totalPay = daysPresent * dailyRate;
    
    const payrollRecord = {
      employeeId,
      startDate,
      endDate,
      daysPresent,
      totalPay,
      createdAt: new Date().toISOString()
    };
    
    setPayrollRecords(prev => [...prev, payrollRecord]);
    return payrollRecord;
  };
  
  const getAllPayroll = () => {
    return payrollRecords;
  };
  
  const getPayrollByEmployee = (employeeId) => {
    return payrollRecords.filter(record => record.employeeId === employeeId);
  };
  
  const value = {
    payrollRecords,
    calculatePayroll,
    getAllPayroll,
    getPayrollByEmployee
  };
  
  return (
    <PayrollContext.Provider value={value}>
      {children}
    </PayrollContext.Provider>
  );
};

export default PayrollContext;