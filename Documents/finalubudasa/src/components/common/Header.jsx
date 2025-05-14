import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import {
  FaBars,
  FaCog,
  FaSignOutAlt,
  FaPaintBrush,
  FaTimes,
  FaUsers,
  FaClipboardList,
  FaMoneyBill,
  FaRegFileAlt,
  FaTachometerAlt,
  FaUserShield // ✅ Added icon for Site Manager
} from 'react-icons/fa';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleLogout = () => {
    console.log('User logged out');
  };

  return (
    <header className="header">
      <div className="left-section">
        <button className="hamburger" onClick={toggleDrawer}>
          <FaBars />
        </button>
        <h1 className="logo">Ubudasa EMS</h1>
      </div>

      <div className="profile-container">
        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className="profile-pic"
          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <ul className="dropdown">
            <li><FaCog /> Settings</li>
            <li><FaPaintBrush /> Customize</li>
            <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
          </ul>
        )}
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="mobile-drawer">
          <button className="close-drawer" onClick={toggleDrawer}>
            <FaTimes />
          </button>
          <nav className="drawer-nav">
            <Link to="/" onClick={toggleDrawer}>
              <FaTachometerAlt /> <span>Dashboard</span>
            </Link>
            <Link to="/employees" onClick={toggleDrawer}>
              <FaUsers /> <span>Employees</span>
            </Link>
            <Link to="/attendance" onClick={toggleDrawer}>
              <FaClipboardList /> <span>Attendance</span>
            </Link>
            <Link to="/payroll" onClick={toggleDrawer}>
              <FaMoneyBill /> <span>Payroll</span>
            </Link>
            <Link to="/daily-report" onClick={toggleDrawer}>
              <FaRegFileAlt /> <span>Daily Report</span>
            </Link>
            <Link to="/site-manager" onClick={toggleDrawer}>
              <FaUserShield /> <span>Site Manager</span> {/* ✅ New */}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
