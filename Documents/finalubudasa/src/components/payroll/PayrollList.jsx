// src/components/payroll/PayrollList.jsx
import React from 'react';
import './payroll-list.css'; // Make sure to import the CSS

const PayrollList = ({ payrollRecords, onMarkAsPaid }) => {
  // 5 sample employees
  const employees = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Michael Johnson' },
    { id: 4, name: 'Emily Davis' },
    { id: 5, name: 'Daniel Lee' }
  ];

  return (
    <div className="payroll-list-container">
      <h2 className="payroll-list-title">Payroll Records</h2>
      
      {payrollRecords.length === 0 ? (
        <div className="no-records-message">
          No payroll records available for the selected year. Please generate a payroll.
        </div>
      ) : (
        <ul className="payroll-list">
          {payrollRecords.map((record) => (
            <li key={record.id} className="payroll-item">
              <div className="payroll-details">
                <p>
                  <strong>Month:</strong> {record.month}, <strong>Year:</strong> {record.year}
                </p>
                <p><strong>Status:</strong> {record.paid ? 'Paid' : 'Pending'}</p>
                <p>
                  <strong>Employee:</strong> {employees.find(emp => emp.id === record.employeeId)?.name || 'N/A'}
                </p>
              </div>
              
              {/* Conditionally render the "Mark as Paid" button */}
              {!record.paid && (
                <button 
                  className="mark-paid-btn" 
                  onClick={() => onMarkAsPaid(record.id)}
                  aria-label={`Mark payroll for ${record.month} ${record.year} as paid`}
                >
                  Mark as Paid
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PayrollList;
