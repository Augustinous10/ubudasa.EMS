// components/EmployeeList.js
import React, { useEffect, useState } from 'react';
import API from '../utils/axiosInstance';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await API.get('/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <ul>
      {employees.map((emp) => (
        <li key={emp._id}>
          {emp.name} - {emp.phone} - {emp.currentSalary}
        </li>
      ))}
    </ul>
  );
};

export default EmployeeList;
