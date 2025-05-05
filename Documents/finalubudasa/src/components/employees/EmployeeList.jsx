import { Link } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import './employee-list.css';

const EmployeeList = () => {
  const { employees } = useEmployees();

  return (
    <div className="employee-list">
      <h3>All Employees</h3>
      <ul>
        {employees.map(emp => (
          <li key={emp.id}>
            <Link to={`/employees/${emp.id}`}>
              <strong>{emp.name}</strong> – {emp.position} – {emp.email}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
