import React, { useState, useEffect, useCallback } from 'react';
import { usePayroll } from '../context/PayrollContext';
import { useAttendance } from '../context/AttendanceContext';
import './payroll.css';

const Payroll = () => {
  const { payrolls: paymentHistory = [] } = usePayroll() || {};
  const { attendanceRecords = [] } = useAttendance() || {};

  const [payrollData, setPayrollData] = useState([]);
  const [totalAmountToPay, setTotalAmountToPay] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const dailyRate = 10000;

  const generatePayroll = useCallback(() => {
    const startDate = new Date(selectedDateRange.startDate);
    const endDate = new Date(selectedDateRange.endDate);

    const filteredAttendance = attendanceRecords.filter((record) => {
      const date = new Date(record.date);
      return date >= startDate && date <= endDate;
    });

    const attendanceMap = {};

    filteredAttendance.forEach((record) => {
      if (!attendanceMap[record.employeeId]) {
        attendanceMap[record.employeeId] = {
          employeeName: record.employeeName,
          daysWorked: 0,
        };
      }
      attendanceMap[record.employeeId].daysWorked += 1;
    });

    const payroll = Object.entries(attendanceMap).map(([employeeId, data]) => {
      const regularPay = data.daysWorked * dailyRate;
      return {
        id: employeeId,
        name: data.employeeName,
        daysWorked: data.daysWorked,
        extraDaysWorked: 0,
        regularPay,
        extraPay: 0,
        totalPay: regularPay,
      };
    });

    setPayrollData(payroll);
    const total = payroll.reduce((sum, record) => sum + record.totalPay, 0);
    setTotalAmountToPay(total);
  }, [attendanceRecords, selectedDateRange]);

  const handleDateRangeChange = (e) => {
    setSelectedDateRange({
      ...selectedDateRange,
      [e.target.name]: e.target.value,
    });
  };

  const filteredPayments = paymentHistory.filter((payment) => {
    const paymentDate = new Date(payment.date);
    const startDate = new Date(selectedDateRange.startDate);
    const endDate = new Date(selectedDateRange.endDate);
    return paymentDate >= startDate && paymentDate <= endDate;
  });

  useEffect(() => {
    generatePayroll();
  }, [generatePayroll]);

  return (
    <div className="payroll-container">
      <h2>Employee Payroll</h2>

      <div className="date-range">
        <div className="date-input">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={selectedDateRange.startDate}
            onChange={handleDateRangeChange}
          />
        </div>
        <div className="date-input">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={selectedDateRange.endDate}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <h3>Payroll Details</h3>
        <div className="table-scroll">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Days Worked</th>
                <th>Extra Days</th>
                <th>Regular Pay</th>
                <th>Extra Pay</th>
                <th>Total Pay</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.length === 0 ? (
                <tr>
                  <td colSpan="6">No payroll data available.</td>
                </tr>
              ) : (
                payrollData.map((record) => (
                  <tr key={record.id}>
                    <td>{record.name}</td>
                    <td>{record.daysWorked}</td>
                    <td>{record.extraDaysWorked}</td>
                    <td>{record.regularPay}</td>
                    <td>{record.extraPay}</td>
                    <td>{record.totalPay}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="total-pay">
          <p>Total Amount to Pay: <strong>{totalAmountToPay} RWF</strong></p>
        </div>
      </div>

      <div className="table-wrapper">
        <h3>Payment History</h3>
        <div className="table-scroll">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Amount Paid</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="3">No payments made during this period.</td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.employeeName}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
