import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaClipboardList, FaMoneyBill, FaCog } from 'react-icons/fa';  // Updated to FaTachometerAlt
import './sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/"><FaTachometerAlt /> Dashboard</Link></li>
          <li><Link to="/employees"><FaUsers /> Employees</Link></li>
          <li><Link to="/attendance"><FaClipboardList /> Attendance</Link></li>
          <li><Link to="/payroll"><FaMoneyBill /> Payroll</Link></li>
        </ul>
      </nav>
      <div className="settings">
        <Link to="/settings"><FaCog /> Settings</Link> {/* Settings button at the bottom */}
      </div>
    </aside>
  );
};

export default Sidebar;
