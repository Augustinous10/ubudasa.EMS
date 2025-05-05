// src/components/payroll/PayrollList.jsx

import React from 'react';

const PayrollList = ({ payrollRecords, employees, onMarkAsPaid }) => {
  return (
    <div>
      <h2>Payroll Records</h2>
      <ul>
        {payrollRecords.map((record) => (
          <li key={record.id}>
            Month: {record.month}, Year: {record.year}, Status: {record.paid ? 'Paid' : 'Pending'}
            {!record.paid && (
              <button onClick={() => onMarkAsPaid(record.id)}>Mark as Paid</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PayrollList;
