import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FaUserShield,
  FaBuilding
} from 'react-icons/fa';

import api from '../../api/axios';   // Your axios instance
import { useAuth } from '../../context/AuthContext'; // Adjust path to your context

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const { logout } = useAuth();  // Get logout from context

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleLogout = async () => {
    try {
      // Call your API logout endpoint (adjust URL if needed)
      await api.post('/users/logout'); 

      // Clear auth data and update context
      logout();

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still force logout client side in case of error
      logout();
      navigate('/login');
    }
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
            <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <FaSignOutAlt /> Logout
            </li>
          </ul>
        )}
      </div>

      {drawerOpen && (
        <div className="mobile-drawer">
          <button className="close-drawer" onClick={toggleDrawer}>
            <FaTimes />
          </button>
          <nav className="drawer-nav">
            <Link to="/" onClick={toggleDrawer}><FaTachometerAlt /> <span>Dashboard</span></Link>
            <Link to="/employees" onClick={toggleDrawer}><FaUsers /> <span>Employees</span></Link>
            <Link to="/attendance" onClick={toggleDrawer}><FaClipboardList /> <span>Attendance</span></Link>
            <Link to="/payroll" onClick={toggleDrawer}><FaMoneyBill /> <span>Payroll</span></Link>
            <Link to="/daily-report" onClick={toggleDrawer}><FaRegFileAlt /> <span>Daily Report</span></Link>
            <Link to="/sites" onClick={toggleDrawer}><FaBuilding /> <span>Sites</span></Link>
            <Link to="/site-manager" onClick={toggleDrawer}><FaUserShield /> <span>Site Manager</span></Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
