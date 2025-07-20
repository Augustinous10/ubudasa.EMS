import React, { useEffect, useState } from 'react';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../features/Employee/employeeApi';
import './EmployeeManager.css';

const initialFormState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  department: '',
  role: 'Teacher',
  employmentType: 'Full-Time',
  startDate: '',
  salary: '',
};

const roles = ['Teacher', 'Cook', 'Cleaner', 'Security', 'Driver', 'Other'];
const employmentTypes = ['Full-Time', 'Part-Time', 'Contract'];

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getEmployees();
       console.log('Fetched employees:', res);  // <-- Add this line
      if (res.success) {
        setEmployees(res.data || []);
      } else {
        setError('Failed to load employees');
      }
    } catch (err) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateEmployee(editingId, form);
      } else {
        await createEmployee(form);
      }
      setForm(initialFormState);
      setEditingId(null);
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const startEdit = (emp) => {
    setEditingId(emp._id);
    setForm({
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      phoneNumber: emp.phoneNumber || '',
      email: emp.email || '',
      department: emp.department || '',
      role: emp.role || 'Teacher',
      employmentType: emp.employmentType || 'Full-Time',
      startDate: emp.startDate ? emp.startDate.slice(0, 10) : '',
      salary: emp.salary || '',
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialFormState);
    setError('');
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    setError('');
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const filteredAndSortedEmployees = employees
    .filter(
      (emp) =>
        emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      if (sortOrder === 'asc') {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="employee-manager">
      <div className="header">
        <h1>Employee Management</h1>
        <button className="add-employee-btn" onClick={() => setShowForm(true)}>
          ➕ Add Employee
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="stats-card">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{employees.length}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {employees.filter((emp) => emp.employmentType === 'Full-Time').length}
            </div>
            <div className="stat-label">Full-Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {employees.filter((emp) => emp.employmentType === 'Part-Time').length}
            </div>
            <div className="stat-label">Part-Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {employees.filter((emp) => emp.role === 'Teacher').length}
            </div>
            <div className="stat-label">Teachers</div>
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sort-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="firstName">Sort by First Name</option>
            <option value="lastName">Sort by Last Name</option>
            <option value="department">Sort by Department</option>
            <option value="role">Sort by Role</option>
            <option value="startDate">Sort by Start Date</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <form onSubmit={handleSubmit} className="employee-form">
            <h3>{editingId ? 'Edit Employee' : 'Add New Employee'}</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter first name"
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter last name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  placeholder="Enter department"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange} required>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Employment Type</label>
                <select
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                >
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Enter salary amount"
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('firstName')}>
                First Name {sortBy === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('lastName')}>
                Last Name {sortBy === 'lastName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('phoneNumber')}>Phone</th>
              <th onClick={() => handleSort('email')}>Email</th>
              <th onClick={() => handleSort('department')}>
                Department {sortBy === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('role')}>
                Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('employmentType')}>Type</th>
              <th onClick={() => handleSort('startDate')}>
                Start Date {sortBy === 'startDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('salary')}>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedEmployees.length === 0 ? (
              <tr>
                <td colSpan="10">
                  <div className="empty-state">
                    <div className="empty-state-icon">👥</div>
                    <h3>No employees found</h3>
                    <p>
                      {searchTerm
                        ? `No employees match "${searchTerm}"`
                        : 'Start by adding your first employee'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedEmployees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.firstName}</td>
                  <td>{emp.lastName}</td>
                  <td>{emp.phoneNumber}</td>
                  <td>{emp.email || '-'}</td>
                  <td>{emp.department || '-'}</td>
                  <td>{emp.role}</td>
                  <td>{emp.employmentType}</td>
                  <td>{emp.startDate ? emp.startDate.slice(0, 10) : '-'}</td>
                  <td>${emp.salary}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => startEdit(emp)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(emp._id)} className="btn-delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManager;
