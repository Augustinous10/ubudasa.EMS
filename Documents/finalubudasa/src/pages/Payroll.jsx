import React, { useState, useEffect, useCallback } from 'react';
import './payroll.css';

const Payroll = ({ employees, paymentHistory }) => {
  const [payrollData, setPayrollData] = useState([]);
  const [totalAmountToPay, setTotalAmountToPay] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0], // Default to today
    endDate: new Date().toISOString().split('T')[0],
  });

  const dailyRate = 10000; // Set your company’s daily rate for employees

  // Use useCallback to memoize the function
  const generatePayroll = useCallback(() => {
    const payroll = employees.map((employee) => {
      const { daysWorked, extraDaysWorked } = employee;
      const regularPay = daysWorked * dailyRate;
      const extraPay = extraDaysWorked * dailyRate;
      const totalPay = regularPay + extraPay;

      return {
        ...employee,
        regularPay,
        extraPay,
        totalPay,
      };
    });

    setPayrollData(payroll);
    const total = payroll.reduce((sum, record) => sum + record.totalPay, 0);
    setTotalAmountToPay(total);
  }, [employees, dailyRate]); // Include employees and dailyRate as dependencies

  // Handle report filter
  const handleDateRangeChange = (e) => {
    setSelectedDateRange({
      ...selectedDateRange,
      [e.target.name]: e.target.value,
    });
  };

  // Filter payments by date range
  const filteredPayments = paymentHistory.filter((payment) => {
    const paymentDate = new Date(payment.date);
    const startDate = new Date(selectedDateRange.startDate);
    const endDate = new Date(selectedDateRange.endDate);

    return paymentDate >= startDate && paymentDate <= endDate;
  });

  useEffect(() => {
    generatePayroll(); // Update payroll data whenever employee data changes
  }, [employees, generatePayroll]); // Now generatePayroll is memoized and included in the dependencies

  return (
    <div className="payroll-container">
      <h2>Employee Payroll</h2>

      {/* Date Range Selector for Report */}
      <div className="date-range">
        <label htmlFor="start-date">Start Date: </label>
        <input
          type="date"
          name="startDate"
          value={selectedDateRange.startDate}
          onChange={handleDateRangeChange}
        />
        <label htmlFor="end-date">End Date: </label>
        <input
          type="date"
          name="endDate"
          value={selectedDateRange.endDate}
          onChange={handleDateRangeChange}
        />
      </div>

      {/* Payroll Table */}
      <div className="payroll-table">
        <h3>Payroll Details</h3>
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Days Worked</th>
              <th>Extra Days Worked</th>
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

        <div className="total-pay">
          <p>Total Amount to Pay: {totalAmountToPay}</p>
        </div>
      </div>

      {/* Payment History Report */}
      <div className="payment-history">
        <h3>Payment History</h3>
        <table>
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
  );
};

export default Payroll;
