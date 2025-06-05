import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyBill,
  FaRegFileAlt,
  FaUserShield,
  FaTimes,
  FaSignOutAlt,
  FaBuilding,
} from 'react-icons/fa';
import './sidebar.css';
import { useAuth } from '../context/AuthContext'; // ✅ Use context

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ Get user and logout from context

  const role = user?.role?.toUpperCase(); // Safely access role

  const handleLogout = () => {
    logout(); // ✅ Call context logout
    navigate('/login');
  };

  const adminMenu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Employees', path: '/admin/employees', icon: <FaUsers /> },
    { name: 'Payroll', path: '/admin/payroll', icon: <FaMoneyBill /> },
    { name: 'Site Managers', path: '/admin/site-managers', icon: <FaUserShield /> },
    { name: 'Reports', path: '/admin/reports', icon: <FaRegFileAlt /> },
    { name: 'Sites', path: '/admin/sites', icon: <FaBuilding /> },
  ];

  const siteManagerMenu = [
    { name: 'Employees', path: '/site-manager/employees', icon: <FaUsers /> },
    { name: 'Reports', path: '/site-manager/reports', icon: <FaRegFileAlt /> },
  ];

  const menuItems =
    role === 'ADMIN'
      ? adminMenu
      : role === 'SITE_MANAGER'
      ? siteManagerMenu
      : [];

  console.log('Sidebar Render - Role:', role);
  console.log('Sidebar Render - Menu Items:', menuItems);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-role">{role || 'GUEST'}</span>
        <button
          className="close-btn"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(({ name, path, icon }) => (
            <li key={name}>
              <NavLink
                to={path}
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                {icon} <span>{name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
