// components/EmployeeForm.js
import React, { useState } from 'react';
import API from '../utils/axiosInstance';

const EmployeeForm = ({ onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    defaultSalary: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/employees', formData);
      onEmployeeAdded(response.data.employee);
      setFormData({ name: '', phone: '', defaultSalary: '' });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
      <input name="defaultSalary" value={formData.defaultSalary} onChange={handleChange} placeholder="Default Salary" required />
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default EmployeeForm;
