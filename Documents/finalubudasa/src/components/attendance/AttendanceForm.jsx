import { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import './attendance-form.css';

const AttendanceForm = () => {
  const [form, setForm] = useState({ name: '', date: '' });
  const { markAttendance } = useAttendance();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await markAttendance(form);
    setForm({ name: '', date: '' });
  };

  return (
    <form className="attendance-form" onSubmit={handleSubmit}>
      <h3>Mark Attendance</h3>
      <input type="text" name="name" placeholder="Employee Name" value={form.name} onChange={handleChange} required />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AttendanceForm;
