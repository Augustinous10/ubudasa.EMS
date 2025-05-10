import './payroll-summary.css';

const PayrollSummary = ({ records }) => {
  const totalRecords = records.length;
  const totalPaid = records.filter(record => record.status === 'Paid').length;
  const totalUnpaid = totalRecords - totalPaid;

  const totalAmount = records.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const paidAmount = records
    .filter(r => r.status === 'Paid')
    .reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const unpaidAmount = totalAmount - paidAmount;

  return (
    <div className="payroll-summary">
      <h2>Payroll Summary</h2>
      <div className="summary-cards">
        <div className="card total">
          <h3>Total Records</h3>
          <p>{totalRecords}</p>
        </div>
        <div className="card paid">
          <h3>Paid</h3>
          <p>{totalPaid} ({paidAmount.toLocaleString()} RWF)</p>
        </div>
        <div className="card unpaid">
          <h3>Unpaid</h3>
          <p>{totalUnpaid} ({unpaidAmount.toLocaleString()} RWF)</p>
        </div>
      </div>
    </div>
  );
};

export default PayrollSummary;
