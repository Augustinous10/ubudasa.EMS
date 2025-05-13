import { Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaMoneyBill,
  FaCog,
  FaRegFileAlt,
  FaUserTie // ✅ Icon for Site Managers
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <Link to="/">
              <FaTachometerAlt /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/employees">
              <FaUsers /> Employees
            </Link>
          </li>
          <li>
            <Link to="/site-managers">
              <FaUserTie /> Site Managers {/* ✅ New Link */}
            </Link>
          </li>
          <li>
            <Link to="/attendance">
              <FaClipboardList /> Attendance
            </Link>
          </li>
          <li>
            <Link to="/payroll">
              <FaMoneyBill /> Payroll
            </Link>
          </li>
          <li>
            <Link to="/daily-report">
              <FaRegFileAlt /> Daily Report
            </Link>
          </li>
        </ul>
      </nav>
      <div className="settings">
        <Link to="/settings">
          <FaCog /> Settings
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
