import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaMoneyBill,
  FaCog,
  FaRegFileAlt,
  FaTimes,
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="close-btn" onClick={closeSidebar}>
          <FaTimes />
        </button>
      </div>
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
            <Link to="/settings" onClick={closeSidebar}>
              <FaCog /> <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
