// AttendancePage.jsx
import React, { useState, useEffect } from 'react';
import './employees.css';
import { checkRecentAttendance, finalizeAttendance } from '../api/employeeApi';

export default function AttendancePage() {
  const [phone, setPhone] = useState('');
  const [addedEmployees, setAddedEmployees] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [today] = useState(new Date().toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', phone: '', currentSalary: '' });
  const [autoFillEmployee, setAutoFillEmployee] = useState(null);

  useEffect(() => {
    console.log('Updated addedEmployees:', addedEmployees);
  }, [addedEmployees]);

  const handleCheckRecentAttendance = async (phone) => {
    console.log('Checking attendance for phone:', phone);
    try {
      const res = await checkRecentAttendance(phone);
      console.log('Response from check-recent:', res.data);

      if (res.data.exists || res.data.attendedRecently) {
        const emp = res.data.employee || { name: '', phone: '', salary: 0 };
        setAutoFillEmployee({
          name: emp.name,
          phone: emp.phone,
          currentSalary: emp.salary,
        });
        setShowAddForm(true);
        return;
      } else {
        setAutoFillEmployee(null);
        setShowAddForm(true);
        return;
      }
    } catch (error) {
      console.error('Error checking recent attendance:', error.response?.data || error.message);
      setAutoFillEmployee(null);
      setShowAddForm(true);
    }
  };

  const addEmployee = async () => {
    if (!phone) return alert('Please enter a phone number');

    if (addedEmployees.some((emp) => emp.phone === phone)) {
      return alert('Employee already added today.');
    }

    await handleCheckRecentAttendance(phone);
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      console.log('Group image selected:', e.target.files[0]);
      setGroupImage(e.target.files[0]);
    }
  };

  const submitAttendance = async () => {
    if (!groupImage || addedEmployees.length === 0) {
      alert('Add employees and group image first.');
      return;
    }

    const formData = new FormData();
    formData.append('groupImage', groupImage);
    formData.append('date', today);
    formData.append(
      'employees',
      JSON.stringify(
        addedEmployees.map((emp) => ({
          phone: emp.phone,
          name: emp.name,
          salary_today: Number(emp.currentSalary),
        }))
      )
    );

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit attendance.');
      return;
    }

    try {
      const res = await finalizeAttendance(formData);
      console.log('Attendance submission response:', res.data);
      alert('Attendance submitted!');
      setAddedEmployees([]);
      setGroupImage(null);
      setPhone('');
      setAutoFillEmployee(null);
      setShowAddForm(false);
    } catch (err) {
      console.error('Submit Error:', err.response?.data || err.message);
      alert(`Error submitting attendance: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSaveAndAdd = () => {
    const employeeToAdd = autoFillEmployee ?? newEmployee;

    if (!employeeToAdd.name || !employeeToAdd.phone || !employeeToAdd.currentSalary) {
      return alert('Fill in all fields.');
    }

    if (addedEmployees.some((emp) => emp.phone === employeeToAdd.phone)) {
      alert('Employee already added today.');
      return;
    }

    setAddedEmployees((prev) => [...prev, employeeToAdd]);
    setAutoFillEmployee(null);
    setNewEmployee({ name: '', phone: '', currentSalary: '' });
    setPhone('');
    setShowAddForm(false);
  };

  return (
    <div className="container">
      <h1 className="heading">Today's Attendance - {today}</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={addEmployee}>Check</button>
      </div>

      {showAddForm && (
        <div className="manual-form">
          <h3>{autoFillEmployee ? 'Edit Employee Details' : 'Employee Not Found - Add New'}</h3>
          <input
            type="text"
            placeholder="Name"
            value={autoFillEmployee?.name ?? newEmployee.name}
            onChange={(e) => {
              if (autoFillEmployee) {
                setAutoFillEmployee({ ...autoFillEmployee, name: e.target.value });
              } else {
                setNewEmployee({ ...newEmployee, name: e.target.value });
              }
            }}
          />
          <input
            type="text"
            placeholder="Phone"
            value={autoFillEmployee?.phone ?? newEmployee.phone}
            onChange={(e) => {
              if (autoFillEmployee) {
                setAutoFillEmployee({ ...autoFillEmployee, phone: e.target.value });
              } else {
                setNewEmployee({ ...newEmployee, phone: e.target.value });
              }
            }}
          />
          <input
            type="number"
            placeholder="Salary (RWF)"
            value={autoFillEmployee?.currentSalary ?? newEmployee.currentSalary}
            onChange={(e) => {
              if (autoFillEmployee) {
                setAutoFillEmployee({ ...autoFillEmployee, currentSalary: e.target.value });
              } else {
                setNewEmployee({ ...newEmployee, currentSalary: e.target.value });
              }
            }}
          />
          <button onClick={handleSaveAndAdd}>Save & Add</button>
        </div>
      )}

      <div className="upload-section">
        <label>Upload Group Photo:</label>
        <input type="file" onChange={handleImageChange} accept="image/*" />
      </div>

      <h2>Added Employees:</h2>
      <ul className="employee-list">
        {addedEmployees.map((emp) => (
          <li key={emp.phone}>
            <span>{emp.name} ({emp.phone})</span>
            <span>{emp.currentSalary} RWF</span>
          </li>
        ))}
      </ul>

      <button className="finalize-btn" onClick={submitAttendance}>
        Finalize Attendance for Today
      </button>
    </div>
  );
}
