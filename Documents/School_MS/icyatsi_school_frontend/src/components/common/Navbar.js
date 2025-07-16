import React, { useState } from 'react';
import {
  School,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import '../layout/MainLayout.css';

const Navbar = ({ user, onToggleSidebar, isSidebarOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="navbar-brand">
          <School className="brand-icon" />
          <span className="brand-text">School Management</span>
        </div>
      </div>

      <div className="navbar-center">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search students, teachers, classes..."
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-menu-container">
          <button
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <User size={16} />
            </div>
            <span className="user-name">{user?.name || 'User'}</span>
            <ChevronDown size={16} />
          </button>

          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-header">
                <div className="user-avatar large">
                  <User size={20} />
                </div>
                <div className="user-info">
                  <div className="user-name">{user?.name || 'User'}</div>
                  <div className="user-role">{user?.role || 'User'}</div>
                </div>
              </div>
              
              <div className="user-menu-items">
                <button className="user-menu-item">
                  <User size={16} />
                  Profile
                </button>
                <button className="user-menu-item">
                  <Settings size={16} />
                  Settings
                </button>
                <button className="user-menu-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
