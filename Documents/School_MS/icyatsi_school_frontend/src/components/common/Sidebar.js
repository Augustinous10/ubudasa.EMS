import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  DollarSign,
  Settings,
  User,
} from 'lucide-react';
import '../layout/MainLayout.css';

const Sidebar = ({ isOpen, user }) => {
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    ];

    const roleMenus = {
  admin: [
    ...baseItems,
    { id: 'users', label: 'Users', icon: Users, href: '/users' },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap, href: '/teachers' },
    { id: 'students', label: 'Students', icon: BookOpen, href: '/students' },
    { id: 'classes', label: 'Classes', icon: Calendar, href: '/classes' },
    { id: 'finance', label: 'Finance', icon: DollarSign, href: '/finance' },
    { id: 'termConfig', label: 'Term Config', icon: Calendar, href: '/term-config' },
    { id: 'employeeManager', label: 'Employee Manager', icon: Users, href: '/employee-manager' },
    { id: 'advanceRequests', label: 'Advance Requests', icon: DollarSign, href: '/advance-requests' }, // ✅ New
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ],
  head_teacher: [
    ...baseItems,
    { id: 'teachers', label: 'Teachers', icon: GraduationCap, href: '/teachers' },
    { id: 'students', label: 'Students', icon: BookOpen, href: '/students' },
    { id: 'classes', label: 'Classes', icon: Calendar, href: '/classes' },
    { id: 'payrolls', label: 'Payroll', icon: DollarSign, href: '/payrolls' },
    { id: 'termConfig', label: 'Term Config', icon: Calendar, href: '/term-config' },
    { id: 'incomes', label: 'Incomes', icon: DollarSign, href: '/incomes' },
    { id: 'advanceRequests', label: 'Advance Requests', icon: DollarSign, href: '/advance-requests' }, // ✅ New
  ],
  accountant: [
    ...baseItems,
    { id: 'finance', label: 'Finance', icon: DollarSign, href: '/finance' },
    { id: 'students', label: 'Students', icon: BookOpen, href: '/students' },
    { id: 'payrolls', label: 'Payroll', icon: DollarSign, href: '/payrolls' },
    { id: 'employeeManager', label: 'Employee Manager', icon: Users, href: '/employee-manager' },
    { id: 'incomes', label: 'Incomes', icon: DollarSign, href: '/incomes' },
    { id: 'advanceRequests', label: 'Advance Requests', icon: DollarSign, href: '/advance-requests' }, // ✅ New
    { id: 'payments', label: 'Payments', icon: DollarSign, href: '/payments' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ],
  cashier: [
    ...baseItems,
    { id: 'payments', label: 'Payments', icon: DollarSign, href: '/payments' },
    { id: 'students', label: 'Students', icon: BookOpen, href: '/students' },
  ],
};

    return roleMenus[user?.role] || baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map(({ id, label, icon: Icon, href }) => (
            <li key={id} className="nav-item">
              <NavLink
                to={href}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                {isOpen && <span className="nav-text">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {isOpen && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <div className="user-details">
              <div className="user-name">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName || ''}`
                  : 'User'}
              </div>
              <div className="user-role">{user?.role || 'Role'}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
