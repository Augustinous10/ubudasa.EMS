import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './main-layout.css';

// ✅ Import icons
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyBill,
  FaCalendarCheck,
  FaUserShield,
  FaRegFileAlt,
  FaBuilding,
} from 'react-icons/fa';

const MainLayout = () => {
  const { user } = useAuth();

  // ✅ Define sidebar links based on role
  const getSidebarLinks = () => {
    if (!user || !user.role) return [];

    if (user.role === 'ADMIN') {
      return [
        { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { to: '/employees', label: 'Employees', icon: <FaUsers /> },
        { to: '/payroll', label: 'Payroll', icon: <FaMoneyBill /> },
        { to: '/attendance', label: 'Attendance', icon: <FaCalendarCheck /> },
        { to: '/site-manager', label: 'Site Manager', icon: <FaUserShield /> },
        // { to: '/daily-report', label: 'Reports', icon: <FaRegFileAlt /> },
        { to: '/admin/sites', label: 'Sites', icon: <FaBuilding /> },
      ];
    }

    if (user.role === 'SITE_MANAGER') {
      return [
        { to: '/site-manager/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { to: '/employees', label: 'Employees', icon: <FaUsers /> },
        { to: '/daily-report', label: 'Reports', icon: <FaRegFileAlt /> },
      ];
    }

    return [];
  };

  const sidebarLinks = getSidebarLinks();
  const shouldShowSidebar = sidebarLinks.length > 0;

  return (
    <div className="main-layout">
      <Header />
      <div className="content-wrapper">
        {shouldShowSidebar && (
          <div className="sidebar">
            <ul className="sidebar-links">
              {sidebarLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      isActive ? 'active-link' : ''
                    }
                  >
                    {link.icon && <span className="sidebar-icon">{link.icon}</span>}
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
