import { useState, useContext } from 'react';
//import { Link } from 'react-router-dom';
import { EmployeeContext } from '../context/EmployeeContext';
import EmployeeList from '../components/employees/EmployeeList';
import EmployeeForm from '../components/employees/EmployeeForm';
import Modal from '../components/common/Modal';
import '../pages/employees.css';


const Employees = () => {
  const { employees, loading, error, addEmployee } = useContext(EmployeeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddEmployee = async (employeeData) => {
    try {
      await addEmployee(employeeData);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error in add employee handler:', err);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
           employee.department.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="loading-container">Loading employees...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="employees-page">
      <div className="employees-header">
        <h1>Ubudasa Employees</h1>
        <div className="employees-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            className="add-employee-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Employee
          </button>
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="no-employees">
          {searchTerm ? 
            `No employees matching "${searchTerm}"` : 
            'No employees found. Add your first employee!'}
        </div>
      ) : (
        <EmployeeList employees={filteredEmployees} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Employee"
      >
        <EmployeeForm onSubmit={handleAddEmployee} />
      </Modal>
    </div>
  );
};

export default Employees;