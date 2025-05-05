import { useState } from 'react';
import './salary-calculator.css';

const SalaryCalculator = ({ onCalculate }) => {
  const [rate, setRate] = useState('');
  const [hours, setHours] = useState('');

  const calculate = () => {
    const salary = parseFloat(rate) * parseFloat(hours);
    onCalculate(salary);
  };

  return (
    <div className="salary-calculator">
      <input type="number" placeholder="Hourly Rate" value={rate} onChange={e => setRate(e.target.value)} />
      <input type="number" placeholder="Hours Worked" value={hours} onChange={e => setHours(e.target.value)} />
      <button onClick={calculate}>Calculate</button>
    </div>
  );
};

export default SalaryCalculator;
