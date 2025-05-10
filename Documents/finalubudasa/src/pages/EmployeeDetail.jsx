import { useParams } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import EmployeeProfile from '../components/employees/EmployeeProfile';

const EmployeeDetail = () => {
  const { id } = useParams();
  const { employees } = useEmployees();

  const employee = employees.find(emp => emp.id.toString() === id);

  if (!employee) {
    return <p>Employee not found.</p>;  // Optional: handle invalid ID
  }

  return <EmployeeProfile employee={employee} />;
};

export default EmployeeDetail;
