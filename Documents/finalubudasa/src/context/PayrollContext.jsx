import { createContext, useState, useEffect, useContext } from 'react';
import { EmployeeContext } from './EmployeeContext';
import { AttendanceContext } from './AttendanceContext';
//import payrollService from '../services/payrollService';

export const PayrollContext = createContext();

export const PayrollProvider = ({ children }) => {
  const { employees } = useContext(EmployeeContext);
  const { attendanceRecords } = useContext(AttendanceContext);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employees.length > 0) {
      fetchPayrollRecords();
    }
  }, [employees]);

  const fetchPayrollRecords = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await payrollService.getAllPayrolls();
      
      // For development, using mock data
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      // Previous month
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      const mockPayroll = [
        {
          id: 1,
          month: prevMonth,
          year: prevMonthYear,
          employeePayments: [
            {
              employeeId: 1,
              baseSalary: 85000,
              daysPresent: 21,
              daysExpected: 22,
              bonus: 5000,
              deductions: 0,
              totalPay: 86363, // ((85000/22) * 21) + 5000
              notes: 'Monthly bonus for excellent work'
            },
            {
              employeeId: 2,
              baseSalary: 92000,
              daysPresent: 22,
              daysExpected: 22,
              bonus: 0,
              deductions: 0,
              totalPay: 92000, // Full salary for perfect attendance
              notes: ''
            },
            {
              employeeId: 3,
              baseSalary: 78000,
              daysPresent: 20,
              daysExpected: 22,
              bonus: 0,
              deductions: 0,
              totalPay: 70909, // ((78000/22) * 20)
              notes: 'Two days absent'
            }
          ],
          dateGenerated: new Date(prevMonthYear, prevMonth, 28).toISOString(),
          isPaid: true,
          datePaid: new Date(prevMonthYear, prevMonth, 30).toISOString()
        }
      ];
      
      setPayrollRecords(mockPayroll);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch payroll records');
      setLoading(false);
      console.error('Error fetching payroll:', err);
    }
  };

  const generateMonthlyPayroll = async (month, year) => {
    try {
      setLoading(true);
      
      // Calculate the total working days in the month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const weekends = [...Array(daysInMonth)].filter((_, i) => {
        const day = new Date(year, month, i + 1).getDay();
        return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
      }).length;
      const workingDays = daysInMonth - weekends;
      
      // For each employee, calculate their attendance and pay
      const employeePayments = employees.map(employee => {
        // Count days present for this employee in this month
        const daysPresent = attendanceRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() === month && 
                 recordDate.getFullYear() === year &&
                 record.employeesPresent.includes(employee.id);
        }).length;
        
        // Calculate pay based on attendance
        const attendanceRatio = daysPresent / workingDays;
        const basePay = employee.salary * attendanceRatio;
        
        return {
          employeeId: employee.id,
          baseSalary: employee.salary,
          daysPresent,
          daysExpected: workingDays,
          bonus: 0, // No default bonus, can be added later
          deductions: 0, // No default deductions, can be added later
          totalPay: basePay,
          notes: daysPresent < workingDays ? `${workingDays - daysPresent} days absent` : ''
        };
      });
      
      const newPayroll = {
        id: payrollRecords.length + 1,
        month,
        year,
        employeePayments,
        dateGenerated: new Date().toISOString(),
        isPaid: false,
        datePaid: null
      };
      
      // In a real app, this would be an API call
      // const savedPayroll = await payrollService.createPayroll(newPayroll);
      
      setPayrollRecords([...payrollRecords, newPayroll]);
      setLoading(false);
      return newPayroll;
    } catch (err) {
      setError('Failed to generate payroll');
      setLoading(false);
      console.error('Error generating payroll:', err);
      throw err;
    }
  };

  const updatePayrollRecord = async (id, payrollData) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const updatedPayroll = await payrollService.updatePayroll(id, payrollData);
      
      // For development
      const updatedRecords = payrollRecords.map(record => 
        record.id === id ? { ...record, ...payrollData } : record
      );
      
      setPayrollRecords(updatedRecords);
      setLoading(false);
      return updatedRecords.find(record => record.id === id);
    } catch (err) {
      setError('Failed to update payroll record');
      setLoading(false);
      console.error('Error updating payroll record:', err);
      throw err;
    }
  };

  const markPayrollAsPaid = async (id) => {
    try {
      setLoading(true);
      
      // For development
      const updatedRecords = payrollRecords.map(record => 
        record.id === id 
          ? { 
              ...record, 
              isPaid: true, 
              datePaid: new Date().toISOString() 
            } 
          : record
      );
      
      setPayrollRecords(updatedRecords);
      setLoading(false);
      return updatedRecords.find(record => record.id === id);
    } catch (err) {
      setError('Failed to mark payroll as paid');
      setLoading(false);
      console.error('Error marking payroll as paid:', err);
      throw err;
    }
  };

  const updateEmployeePayment = async (payrollId, employeeId, paymentData) => {
    try {
      setLoading(true);
      
      // For development
      const updatedRecords = payrollRecords.map(record => {
        if (record.id === payrollId) {
          const updatedPayments = record.employeePayments.map(payment => 
            payment.employeeId === employeeId 
              ? { ...payment, ...paymentData } 
              : payment
          );
          
          return {
            ...record,
            employeePayments: updatedPayments
          };
        }
        return record;
      });
      
      setPayrollRecords(updatedRecords);
      setLoading(false);
      return updatedRecords.find(record => record.id === payrollId);
    } catch (err) {
      setError('Failed to update employee payment');
      setLoading(false);
      console.error('Error updating employee payment:', err);
      throw err;
    }
  };

  const getPayrollById = (id) => {
    return payrollRecords.find(record => record.id === Number(id)) || null;
  };

  const getMonthlyPayroll = (month, year) => {
    return payrollRecords.find(
      record => record.month === month && record.year === year
    ) || null;
  };

  const getEmployeePayrollHistory = (employeeId) => {
    return payrollRecords
      .filter(record => 
        record.employeePayments.some(payment => 
          payment.employeeId === Number(employeeId)
        )
      )
      .map(record => {
        const payment = record.employeePayments.find(
          p => p.employeeId === Number(employeeId)
        );
        return {
          payrollId: record.id,
          month: record.month,
          year: record.year,
          ...payment,
          isPaid: record.isPaid,
          datePaid: record.datePaid
        };
      });
  };

  return (
    <PayrollContext.Provider
      value={{
        payrollRecords,
        loading,
        error,
        fetchPayrollRecords,
        generateMonthlyPayroll,
        updatePayrollRecord,
        markPayrollAsPaid,
        updateEmployeePayment,
        getPayrollById,
        getMonthlyPayroll,
        getEmployeePayrollHistory
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
};

export const usePayroll = () => {
  const context = useContext(PayrollContext);
  if (!context) {
    throw new Error('usePayroll must be used within a PayrollProvider');
  }
  return context;
};
