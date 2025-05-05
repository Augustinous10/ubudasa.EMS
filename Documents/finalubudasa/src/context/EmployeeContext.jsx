import { createContext, useState, useEffect, useContext } from 'react';
//import employeeService from '../services/employeeService';

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // const response = await employeeService.getAllEmployees();

      // Mock data for development
      const mockEmployees = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          position: 'Senior Painter',
          phoneNumber: '+250 789123456',
          email: 'john.doe@example.com',
          hireDate: '2022-01-15',
          salary: 85000,
          department: 'Interior Design',
          profileImage: null
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          position: '3D Design Specialist',
          phoneNumber: '+250 789789456',
          email: 'jane.smith@example.com',
          hireDate: '2022-03-10',
          salary: 92000,
          department: '3D Wall Design',
          profileImage: null
        },
        {
          id: 3,
          firstName: 'David',
          lastName: 'Mugabo',
          position: 'Kitchen Designer',
          phoneNumber: '+250 789123789',
          email: 'david.mugabo@example.com',
          hireDate: '2022-05-20',
          salary: 78000,
          department: 'Kitchen & Bath',
          profileImage: null
        }
      ];

      setEmployees(mockEmployees);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setLoading(false);
      console.error('Error fetching employees:', err);
    }
  };

  const addEmployee = async (employeeData) => {
    try {
      setLoading(true);
      // const newEmployee = await employeeService.createEmployee(employeeData);

      const newEmployee = {
        id: employees.length + 1,
        ...employeeData
      };

      setEmployees([...employees, newEmployee]);
      setLoading(false);
      return newEmployee;
    } catch (err) {
      setError('Failed to add employee');
      setLoading(false);
      console.error('Error adding employee:', err);
      throw err;
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      setLoading(true);
      // const updatedEmployee = await employeeService.updateEmployee(id, employeeData);

      const updatedEmployees = employees.map(emp =>
        emp.id === id ? { ...emp, ...employeeData } : emp
      );

      setEmployees(updatedEmployees);
      setLoading(false);
      return updatedEmployees.find(emp => emp.id === id);
    } catch (err) {
      setError('Failed to update employee');
      setLoading(false);
      console.error('Error updating employee:', err);
      throw err;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      setLoading(true);
      // await employeeService.deleteEmployee(id);

      const filteredEmployees = employees.filter(emp => emp.id !== id);
      setEmployees(filteredEmployees);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Failed to delete employee');
      setLoading(false);
      console.error('Error deleting employee:', err);
      throw err;
    }
  };

  const getEmployeeById = (id) => {
    return employees.find(emp => emp.id === Number(id)) || null;
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        error,
        fetchEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

// ✅ Add and export this custom hook:
export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};
