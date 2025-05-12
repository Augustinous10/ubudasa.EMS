// EmployeeContext.js (If you need it)
// This is a sample implementation if you don't already have one

import React, { createContext, useState, useContext } from 'react';

// Create the context
const EmployeeContext = createContext();

// Custom hook for using the employee context
export const useEmployee = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  
  // Add a new employee
  const addEmployee = (employee) => {
    const newEmployee = {
      id: employee.id || Date.now().toString(),
      name: employee.name,
      status: employee.status || 'inactive',
      // Add any other employee properties here
    };
    
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  };
  
  // Update an employee
  const updateEmployee = (id, updates) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === id ? { ...emp, ...updates } : emp)
    );
  };
  
  // Delete an employee
  const deleteEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };
  
  // Get all employees
  const getAllEmployees = () => {
    return employees;
  };
  
  // Get employee by ID
  const getEmployeeById = (id) => {
    return employees.find(emp => emp.id === id);
  };
  
  // Value to provide through the context
  const value = {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getAllEmployees,
    getEmployeeById
  };
  
  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeContext;