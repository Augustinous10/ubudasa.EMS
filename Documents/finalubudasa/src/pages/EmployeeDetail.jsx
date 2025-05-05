import { useParams } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import MainLayout from '../layouts/MainLayout';
import EmployeeProfile from '../components/employees/EmployeeProfile';

const EmployeeDetail = () => {
  const { id } = useParams();
  const { employees } = useEmployees();

  const employee = employees.find(emp => emp.id.toString() === id);

  return (
    <MainLayout>
      <EmployeeProfile employee={employee} />
    </MainLayout>
  );
};

export default EmployeeDetail;
