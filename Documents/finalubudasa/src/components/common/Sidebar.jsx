import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaMoneyBill,
  FaRegFileAlt,
  FaUserShield,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const handleLogout = () => {
    console.log('Logging out...');
    // Add logout logic here
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="close-btn" onClick={closeSidebar}>
          <FaTimes />
        </button>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/" onClick={closeSidebar}>
                <FaTachometerAlt /> <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/employees" onClick={closeSidebar}>
                <FaUsers /> <span>Employees</span>
              </Link>
            </li>
            <li>
              <Link to="/attendance" onClick={closeSidebar}>
                <FaClipboardList /> <span>Attendance</span>
              </Link>
            </li>
            <li>
              <Link to="/payroll" onClick={closeSidebar}>
                <FaMoneyBill /> <span>Payroll</span>
              </Link>
            </li>
            <li>
              <Link to="/daily-report" onClick={closeSidebar}>
                <FaRegFileAlt /> <span>Daily Report</span>
              </Link>
            </li>
            <li>
              <Link to="/site-manager" onClick={closeSidebar}>
                <FaUserShield /> <span>Site Manager</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
