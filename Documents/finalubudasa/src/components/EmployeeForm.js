import React, { useState } from 'react';
import { createAttendance, finalizeAttendance } from '../api/attendanceAPI';

function EmployeeForm() {
  const [employees, setEmployees] = useState([{ name: '', salary: '', status: '' }]);
  const [groupImage, setGroupImage] = useState(null);
  const [isFinalized, setIsFinalized] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...employees];
    updated[index][field] = value;
    setEmployees(updated);
  };

  const addEmployee = () => {
    setEmployees([...employees, { name: '', salary: '', status: '' }]);
  };

  const handleImageChange = (e) => {
    setGroupImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('groupImage', groupImage);
    formData.append('employees', JSON.stringify(employees));

    try {
      const res = await createAttendance(formData);
      alert('Attendance created');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Error submitting attendance');
    }
  };

  const handleFinalize = async () => {
    const formData = new FormData();
    formData.append('groupImage', groupImage);
    formData.append('employees', JSON.stringify(employees));

    try {
      const res = await finalizeAttendance(formData);
      alert('Attendance finalized!');
      setIsFinalized(true);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to finalize');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Employee Attendance</h2>

      {employees.map((emp, idx) => (
        <div key={idx} className="mb-4 border p-2 rounded">
          <input
            className="block w-full mb-2"
            type="text"
            placeholder="Employee Name"
            value={emp.name}
            onChange={(e) => handleChange(idx, 'name', e.target.value)}
          />
          <input
            className="block w-full mb-2"
            type="number"
            placeholder="Salary"
            value={emp.salary}
            onChange={(e) => handleChange(idx, 'salary', e.target.value)}
          />
          <select
            className="block w-full"
            value={emp.status}
            onChange={(e) => handleChange(idx, 'status', e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </div>
      ))}

      <button onClick={addEmployee} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">+ Add Employee</button>

      <div className="mb-4">
        <label>Upload Group Image:</label>
        <input type="file" onChange={handleImageChange} />
      </div>

      <div className="flex gap-4">
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Save Attendance</button>
        <button onClick={handleFinalize} className="bg-red-600 text-white px-4 py-2 rounded">Finalize</button>
      </div>

      {isFinalized && <p className="mt-4 text-green-700 font-semibold">✅ Attendance finalized and submitted!</p>}
    </div>
  );
}

export default EmployeeForm;
