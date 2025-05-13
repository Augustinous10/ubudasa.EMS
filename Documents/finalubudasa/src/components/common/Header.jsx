import React, { useState } from 'react';
import './header.css';
import { FaCog, FaSignOutAlt, FaPaintBrush } from 'react-icons/fa';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
  };

  return (
    <header className="header">
      {/* Replace text with image logo */}
      <img
        src="/logo.png" // Make sure this file is in your public/ directory
        alt="Ubudasa EMS Logo"
        className="logo-img"
      />

      <div className="profile-container">
        <img
          src="https://i.pravatar.cc/40" // Placeholder avatar
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
    </header>
  );
};

export default Header;
