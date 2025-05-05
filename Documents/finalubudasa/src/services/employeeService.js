// services/employeeService.js

let mockEmployees = [
  { id: 1, name: 'John Doe', position: 'Software Engineer', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', position: 'HR Manager', email: 'jane@example.com' }
];

export const getEmployees = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockEmployees]), 500); // return a copy to avoid mutation
  });
};

export const addEmployee = async (employee) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEmployee = { id: Date.now(), ...employee };
      mockEmployees.push(newEmployee);
      resolve(newEmployee);
    }, 500);
  });
};

export const updateEmployee = async (id, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex(emp => emp.id === id);
      if (index === -1) return reject(new Error("Employee not found"));
      mockEmployees[index] = { ...mockEmployees[index], ...updatedData };
      resolve(mockEmployees[index]);
    }, 500);
  });
};

export const deleteEmployee = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex(emp => emp.id === id);
      if (index === -1) return reject(new Error("Employee not found"));
      mockEmployees.splice(index, 1);
      resolve(true);
    }, 500);
  });
};
