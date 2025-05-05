import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/employees">Employees</Link></li>
          <li><Link to="/attendance">Attendance</Link></li>
          <li><Link to="/payroll">Payroll</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
