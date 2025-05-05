import { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import SalaryCalculator from './SalaryCalculator';
import './payroll-form.css';

const PayrollForm = () => {
  const [form, setForm] = useState({ name: '', date: '', salary: 0 });
  const { createPayroll } = usePayroll();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await createPayroll(form);
    setForm({ name: '', date: '', salary: 0 });
  };

  const handleSalaryCalc = value => {
    setForm(prev => ({ ...prev, salary: value }));
  };

  return (
    <form className="payroll-form" onSubmit={handleSubmit}>
      <h3>Generate Payroll</h3>
      <input type="text" name="name" placeholder="Employee Name" value={form.name} onChange={handleChange} required />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <SalaryCalculator onCalculate={handleSalaryCalc} />
      <p><strong>Salary:</strong> {form.salary} RWF</p>
      <button type="submit">Submit Payroll</button>
    </form>
  );
};

export default PayrollForm;
