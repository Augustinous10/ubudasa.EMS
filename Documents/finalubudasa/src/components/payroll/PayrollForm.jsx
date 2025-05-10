// src/components/payroll/PayrollForm.jsx
import { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import SalaryCalculator from './SalaryCalculator';
import './payroll-form.css';

const PayrollForm = () => {
  const [form, setForm] = useState({ name: '', date: '', salary: 0 });
  const { createPayroll } = usePayroll();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPayroll(form);
    setForm({ name: '', date: '', salary: 0 });
  };

  const handleSalaryCalc = (value) => {
    setForm((prev) => ({ ...prev, salary: value }));
  };

  return (
    <form className="payroll-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Generate Payroll</h3>
      <div className="form-field">
        <label htmlFor="name">Employee Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="date">Payroll Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>
      <SalaryCalculator onCalculate={handleSalaryCalc} />
      <p className="salary-info">
        <strong>Salary:</strong> {form.salary} RWF
      </p>
      <button type="submit" className="submit-btn">
        Submit Payroll
      </button>
    </form>
  );
};

export default PayrollForm;
