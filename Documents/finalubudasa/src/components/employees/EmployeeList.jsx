import { Link } from 'react-router-dom';
import './employee-list.css'; // Make sure to import the CSS file

const EmployeeList = ({ employees }) => {
  return (
    <div className="employee-list-container">
      <h2 className="employee-list-title">Employee Directory</h2>
      <ul className="employee-list">
        {employees.map(emp => (
          <li key={emp.id} className="employee-item">
            <Link to={`/employees/${emp.id}`} className="employee-link">
              {emp.firstName} {emp.lastName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
