import { useState, useContext } from 'react';
//import { Link } from 'react-router-dom';
import { PayrollContext } from '../context/PayrollContext';
import { EmployeeContext } from '../context/EmployeeContext';
import PayrollList from '../components/payroll/PayrollList';
import PayrollForm from '../components/payroll/PayrollForm';
import Modal from '../components/common/Modal';
import './payroll.css';


const Payroll = () => {
  const { payrollRecords, loading, error, generateMonthlyPayroll, markPayrollAsPaid } = useContext(PayrollContext);
  const { employees } = useContext(EmployeeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  
  // Get unique years from payroll records
  const availableYears = [...new Set(payrollRecords.map(record => record.year))];
  if (!availableYears.includes(new Date().getFullYear())) {
    availableYears.push(new Date().getFullYear());
  }
  availableYears.sort((a, b) => b - a); // Sort descending
  
  const handleGeneratePayroll = async (formData) => {
    try {
      await generateMonthlyPayroll(formData.month, formData.year);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error in generate payroll handler:', err);
    }
  };
  
  const handleMarkAsPaid = async (payrollId) => {
    try {
      await markPayrollAsPaid(payrollId);
    } catch (err) {
      console.error('Error marking payroll as paid:', err);
    }
  };
  
  const filteredRecords = payrollRecords
    .filter(record => record.year === filterYear)
    .sort((a, b) => b.month - a.month); // Sort by month descending
  
  if (loading && payrollRecords.length === 0) {
    return <div className="loading-container">Loading payroll records...</div>;
  }
  
  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="payroll-page">
      <div className="payroll-header">
        <h1>Payroll Management</h1>
        <div className="payroll-actions">
          <div className="year-filter-container">
            <label htmlFor="yearFilter">Year:</label>
            <select
              id="yearFilter"
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="year-filter"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button 
            className="generate-payroll-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Generate New Payroll
          </button>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="no-payroll">
          No payroll records found for {filterYear}. Generate a new monthly payroll.
        </div>
      ) : (
        <PayrollList 
          payrollRecords={filteredRecords} 
          employees={employees}
          onMarkAsPaid={handleMarkAsPaid}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Monthly Payroll"
      >
        <PayrollForm onSubmit={handleGeneratePayroll} />
      </Modal>
    </div>
  );
};

export default Payroll;