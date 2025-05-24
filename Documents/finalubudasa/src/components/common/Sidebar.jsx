import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyBill,
  FaRegFileAlt,
  FaUserShield,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const adminMenu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Employees', path: '/admin/employees', icon: <FaUsers /> },
    { name: 'Payroll', path: '/admin/payroll', icon: <FaMoneyBill /> },
    { name: 'Site Managers', path: '/admin/site-managers', icon: <FaUserShield /> },
    { name: 'Reports', path: '/admin/reports', icon: <FaRegFileAlt /> },
  ];

  const siteManagerMenu = [
    { name: 'Employees', path: '/site-manager/employees', icon: <FaUsers /> },
    { name: 'Reports', path: '/site-manager/reports', icon: <FaRegFileAlt /> },
  ];

  const menuItems = role === 'ADMIN' ? adminMenu : siteManagerMenu;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="close-btn" onClick={closeSidebar}><FaTimes /></button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link to={item.path} onClick={closeSidebar}>
                {item.icon} <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
