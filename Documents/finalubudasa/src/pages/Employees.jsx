// src/pages/AttendancePage.jsx
import React, { useState, useEffect } from 'react';
import './employees.css';
import { checkRecentAttendance, finalizeAttendance } from '../api/employeeApi';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/deg5swakx/upload';
const CLOUDINARY_UPLOAD_PRESET = 'employee_preset';

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
    try {
      const res = await checkRecentAttendance(phone);
      if (res.data.exists || res.data.attendedRecently) {
        const emp = res.data.employee || { name: '', phone: '', salary: 0 };
        setAutoFillEmployee({
          name: emp.name,
          phone: emp.phone,
          currentSalary: emp.salary,
        });
      } else {
        setAutoFillEmployee(null);
      }
      setShowAddForm(true);
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
      setGroupImage(e.target.files[0]);
    }
  };

  const submitAttendance = async () => {
    if (!groupImage || addedEmployees.length === 0) {
      alert('Add employees and group image first.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit attendance.');
      return;
    }

    try {
      // Upload image to Cloudinary
      const imgForm = new FormData();
      imgForm.append('file', groupImage);
      imgForm.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const cloudRes = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: imgForm,
      });

      const cloudData = await cloudRes.json();
      const groupImageUrl = cloudData.secure_url;

      if (!groupImageUrl) {
        throw new Error('Image upload failed.');
      }

      // Prepare and send attendance data
      const payload = {
        date: today,
        groupImageUrl,
        employees: addedEmployees.map(emp => ({
          phone: emp.phone,
          name: emp.name,
          salary_today: Number(emp.currentSalary),
        })),
      };

      await finalizeAttendance(payload);

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
              const updated = { ...autoFillEmployee ?? newEmployee, name: e.target.value };
              autoFillEmployee ? setAutoFillEmployee(updated) : setNewEmployee(updated);
            }}
          />
          <input
            type="text"
            placeholder="Phone"
            value={autoFillEmployee?.phone ?? newEmployee.phone}
            onChange={(e) => {
              const updated = { ...autoFillEmployee ?? newEmployee, phone: e.target.value };
              autoFillEmployee ? setAutoFillEmployee(updated) : setNewEmployee(updated);
            }}
          />
          <input
            type="number"
            placeholder="Salary (RWF)"
            value={autoFillEmployee?.currentSalary ?? newEmployee.currentSalary}
            onChange={(e) => {
              const updated = { ...autoFillEmployee ?? newEmployee, currentSalary: e.target.value };
              autoFillEmployee ? setAutoFillEmployee(updated) : setNewEmployee(updated);
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
