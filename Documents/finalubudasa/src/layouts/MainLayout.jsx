import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './main-layout.css';

const MainLayout = () => {
  const { user } = useAuth();

  // Define sidebar links based on role
  const getSidebarLinks = () => {
    if (!user || !user.role) return [];

    if (user.role === 'ADMIN') {
      return [
        { to: '/admin/dashboard', label: 'Dashboard' },
        { to: '/employees', label: 'Employees' },
        { to: '/payroll', label: 'Payroll' },
        { to: '/attendance', label: 'Attendance' },
        { to: '/site-manager', label: 'Site Manager Page' },
        { to: '/daily-report', label: 'Reports' },
      ];
    }

    if (user.role === 'SITE_MANAGER') {
      return [
        { to: '/site-manager/dashboard', label: 'Dashboard' },
        { to: '/employees', label: 'Employees' },
        { to: '/daily-report', label: 'Reports' },
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
                    {link.label}
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
