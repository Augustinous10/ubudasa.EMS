import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import { FaBars, FaCog, FaSignOutAlt, FaPaintBrush, FaTimes } from 'react-icons/fa';

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
          <button className="close-drawer" onClick={toggleDrawer}><FaTimes /></button>
          <nav className="drawer-nav">
            <Link to="/" onClick={toggleDrawer}>Dashboard</Link>
            <Link to="/employees" onClick={toggleDrawer}>Employees</Link>
            <Link to="/attendance" onClick={toggleDrawer}>Attendance</Link>
            <Link to="/payroll" onClick={toggleDrawer}>Payroll</Link>
            <Link to="/daily-report" onClick={toggleDrawer}>Daily Report</Link>
            <Link to="/settings" onClick={toggleDrawer}>Settings</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
