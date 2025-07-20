import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Plus, Edit, Trash2, DollarSign, Eye, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react';
import './Payrolls.css'; // Import the CSS file

// Enhanced API module with better error handling
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token') || 
         localStorage.getItem('authToken') || 
         localStorage.getItem('accessToken') ||
         sessionStorage.getItem('token') ||
         sessionStorage.getItem('authToken');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleApiResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Authentication failed. Please login again.');
    }
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
  
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    throw new Error('Response is not JSON');
  }
};

// API functions
const api = {
  getPayrolls: async () => {
    const response = await fetch(`${API_BASE_URL}/payrolls`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  getEmployees: async () => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  getTerms: async () => {
    const response = await fetch(`${API_BASE_URL}/term-configs`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  createPayroll: async (payrollData) => {
    const response = await fetch(`${API_BASE_URL}/payrolls`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payrollData),
    });
    return await handleApiResponse(response);
  },

  updatePayroll: async (id, payrollData) => {
    const response = await fetch(`${API_BASE_URL}/payrolls/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payrollData),
    });
    return await handleApiResponse(response);
  },

  deletePayroll: async (id) => {
    const response = await fetch(`${API_BASE_URL}/payrolls/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  markAsPaid: async (id) => {
    const response = await fetch(`${API_BASE_URL}/payrolls/${id}/mark-paid`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  }
};

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
        <span>{message}</span>
        <button onClick={onClose} className="toast-close">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <RefreshCw className="spin-animation" size={20} />
  </div>
);

// Main Payroll component
const EnhancedPayrolls = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [termsList, setTermsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Form and modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPayroll, setViewingPayroll] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    employee: '',
    term: '',
    status: '',
    department: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Form data
  const [formData, setFormData] = useState({
    employee: '',
    termId: '',
    department: '',
    payPeriodStart: '',
    payPeriodEnd: '',
    baseSalary: '',
    allowances: '',
    deductions: '',
    paymentDate: '',
    notes: '',
  });

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      employee: '',
      termId: '',
      department: '',
      payPeriodStart: '',
      payPeriodEnd: '',
      baseSalary: '',
      allowances: '',
      deductions: '',
      paymentDate: '',
      notes: '',
    });
    setEditingPayroll(null);
  };

  // Helper function to get employee details by ID
  const getEmployeeDetails = useCallback((employeeId) => {
    const employee = employeesList.find(emp => (emp._id || emp.id) === employeeId);
    return employee || {};
  }, [employeesList]);

  // Fetch data functions
  const fetchDropdownData = useCallback(async () => {
    try {
      const [empRes, termsRes] = await Promise.all([
        api.getEmployees(),
        api.getTerms()
      ]);
      console.log('Employees API response:', empRes);
      console.log('Terms API response:', termsRes);
      
      setEmployeesList(empRes.data || []);
      setTermsList(termsRes.data || []);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      showToast('Failed to load dropdown data', 'error');
    }
  }, []);

  const fetchPayrolls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPayrolls();
      console.log('Payrolls API response:', res);
      setPayrolls(res.data || []);
      showToast('Payrolls loaded successfully');
    } catch (err) {
      console.error('Error fetching payrolls:', err);
      setError('Failed to fetch payrolls');
      showToast('Failed to fetch payrolls', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter payrolls based on filters
  useEffect(() => {
    const filtered = payrolls.filter((p) => {

      const employeeId = typeof p.employee === 'object' ? (p.employee._id || p.employee.id) : p.employee;
const employeeDetails = getEmployeeDetails(employeeId);

      const empName = `${employeeDetails.firstName || ''} ${employeeDetails.lastName || ''}`.toLowerCase();
      const empDepartment = employeeDetails.department || p.employee?.department || p.department || '';
      const termId = typeof p.termId === 'object' ? p.termId?._id || '' : p.termId || '';
      const status = p.status || '';
      const searchTerm = filters.search.trim().toLowerCase();

      const matchesSearch =
        !searchTerm ||
        empName.includes(searchTerm) ||
        empDepartment.toLowerCase().includes(searchTerm);

const matchesEmployee = !filters.employee || employeeId === filters.employee;
      const matchesTerm = !filters.term || termId === filters.term;
      const matchesStatus = !filters.status || status === filters.status;
      const matchesDepartment =
        !filters.department ||
        empDepartment.toLowerCase().includes(filters.department.toLowerCase());

      return (
        matchesSearch &&
        matchesEmployee &&
        matchesTerm &&
        matchesStatus &&
        matchesDepartment
      );
    });

    setFilteredPayrolls(filtered);
    setCurrentPage(1);
  }, [payrolls, filters, getEmployeeDetails]);

  // Initial data loading
  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  useEffect(() => {
    if (employeesList.length > 0) {
      fetchPayrolls();
    }
  }, [employeesList, fetchPayrolls]);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employee || !formData.termId || !formData.baseSalary) {
      showToast('Please fill in required fields: Employee, Term, Base Salary', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        baseSalary: Number(formData.baseSalary),
        allowances: Number(formData.allowances) || 0,
        deductions: Number(formData.deductions) || 0,
      };

      if (editingPayroll) {
        await api.updatePayroll(editingPayroll._id, payload);
        showToast('Payroll updated successfully!');
      } else {
        await api.createPayroll(payload);
        showToast('Payroll created successfully!');
      }
      
      resetForm();
      setIsModalOpen(false);
      await fetchPayrolls();
    } catch (err) {
      console.error('Error saving payroll:', err);
      showToast(err.message || 'Failed to save payroll', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete payroll
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payroll?')) return;
    
    setLoading(true);
    try {
      await api.deletePayroll(id);
      showToast('Payroll deleted successfully!');
      await fetchPayrolls();
    } catch (err) {
      console.error('Error deleting payroll:', err);
      showToast('Failed to delete payroll', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Mark as paid
  const handleMarkAsPaid = async (id) => {
    setLoading(true);
    try {
      await api.markAsPaid(id);
      showToast('Payroll marked as paid!');
      await fetchPayrolls();
    } catch (err) {
      console.error('Error marking as paid:', err);
      showToast('Failed to mark as paid', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Edit payroll
  const handleEdit = (payroll) => {
    setFormData({
      
      employee: typeof payroll.employee === 'object' ? (payroll.employee._id || payroll.employee.id) : payroll.employee || '',

      termId: payroll.termId?._id || payroll.termId || '',
      department: payroll.department || '',
      payPeriodStart: payroll.payPeriodStart ? payroll.payPeriodStart.split('T')[0] : '',
      payPeriodEnd: payroll.payPeriodEnd ? payroll.payPeriodEnd.split('T')[0] : '',
      baseSalary: payroll.baseSalary || '',
      allowances: payroll.allowances || '',
      deductions: payroll.deductions || '',
      paymentDate: payroll.paymentDate ? payroll.paymentDate.split('T')[0] : '',
      notes: payroll.notes || '',
    });

    setEditingPayroll(payroll);
    setIsModalOpen(true);
  };

  // View payroll details
  const handleView = (payroll) => {
    setViewingPayroll(payroll);
    setIsViewModalOpen(true);
  };

  // Pagination
  const paginatedPayrolls = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredPayrolls.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPayrolls, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredPayrolls.length / rowsPerPage);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="payroll-container">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="payroll-header">
        <h1>Payroll Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} />
          Create New Payroll
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Payrolls</h3>
          <div className="value">{filteredPayrolls.length}</div>
        </div>
        <div className="summary-card">
          <h3>Paid</h3>
          <div className="value">
            {filteredPayrolls.filter(p => p.status === 'paid').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Unpaid</h3>
          <div className="value">
            {filteredPayrolls.filter(p => p.status !== 'paid').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Total Amount</h3>
          <div className="value">
            {formatCurrency(filteredPayrolls.reduce((sum, p) => sum + (p.netPay || 0), 0))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search by name or department..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Employee</label>
            <select
              className="filter-input"
              value={filters.employee}
              onChange={(e) => handleFilterChange('employee', e.target.value)}
            >
              <option value="">All Employees</option>
              {employeesList.map((emp) => (
                <option key={emp._id || emp.id} value={emp._id || emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Term</label>
            <select
              className="filter-input"
              value={filters.term}
              onChange={(e) => handleFilterChange('term', e.target.value)}
            >
              <option value="">All Terms</option>
              {termsList.map((term) => (
                <option key={term._id || term.id} value={term._id || term.id}>
                  {term.term}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select
              className="filter-input"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="filters-actions">
          <button
            className="btn btn-secondary"
            onClick={fetchPayrolls}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <select
            className="filter-input"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="payroll-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Base Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="loading-cell">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : paginatedPayrolls.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data-cell">
                    No payrolls found
                  </td>
                </tr>
              ) : (
                paginatedPayrolls.map((payroll) => {
                  const employeeDetails = getEmployeeDetails(payroll.employee?._id || payroll.employee?.id);
                  return (
                    <tr key={payroll._id}>
                      <td>
                        {`${employeeDetails.firstName || ''} ${employeeDetails.lastName || ''}`.trim() || 'N/A'}
                      </td>
                      <td>{employeeDetails.phoneNumber || 'N/A'}</td>
                      <td>{employeeDetails.department || payroll.employee?.department || payroll.department || 'N/A'}</td>
                      <td>{formatCurrency(payroll.baseSalary)}</td>
                      <td>{formatCurrency(payroll.allowances)}</td>
                      <td>{formatCurrency(payroll.deductions)}</td>
                      <td>{formatCurrency(payroll.netPay)}</td>
                      <td>
                        <span className={`status-badge status-${payroll.status}`}>
                          {payroll.status || 'unpaid'}
                        </span>
                      </td>
                      <td>
                        <div className="actions-buttons">
                          <button
                            className="btn-icon btn-view"
                            onClick={() => handleView(payroll)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(payroll)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(payroll._id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          {payroll.status !== 'paid' && (
                            <button
                              className="btn-icon btn-pay"
                              onClick={() => handleMarkAsPaid(payroll._id)}
                              title="Mark as Paid"
                            >
                              <DollarSign size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPayroll ? 'Edit Payroll' : 'Create New Payroll'}
      >
        <form onSubmit={handleSubmit} className="payroll-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Employee *</label>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="">Select Employee</option>
                {employeesList.map((emp) => (
                  <option key={emp._id || emp.id} value={emp._id || emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Term *</label>
              <select
                name="termId"
                value={formData.termId}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="">Select Term</option>
                {termsList.map((term) => (
                  <option key={term._id || term.id} value={term._id || term.id}>
                    {term.term}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter department"
              />
            </div>

            <div className="form-group">
              <label>Base Salary *</label>
              <input
                type="number"
                name="baseSalary"
                value={formData.baseSalary}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter base salary"
              />
            </div>

            <div className="form-group">
              <label>Allowances</label>
              <input
                type="number"
                name="allowances"
                value={formData.allowances}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter allowances"
              />
            </div>

            <div className="form-group">
              <label>Deductions</label>
              <input
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter deductions"
              />
            </div>

            <div className="form-group">
              <label>Pay Period Start</label>
              <input
                type="date"
                name="payPeriodStart"
                value={formData.payPeriodStart}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Pay Period End</label>
              <input
                type="date"
                name="payPeriodEnd"
                value={formData.payPeriodEnd}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Payment Date</label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group form-group-full">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter any notes"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingPayroll ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Payroll Details"
      >
        {viewingPayroll && (
          <div className="payroll-details">
            <div className="details-grid">
              <div className="detail-item">
                <label>Employee</label>
                <span>
                  {(() => {
                    const employeeDetails = getEmployeeDetails(viewingPayroll.employee?._id || viewingPayroll.employee?.id);
                    return `${employeeDetails.firstName || ''} ${employeeDetails.lastName || ''}`.trim() || 'N/A';
                  })()}
                </span>
              </div>
              <div className="detail-item">
                <label>Phone Number</label>
                <span>
                  {(() => {
                    const employeeDetails = getEmployeeDetails(viewingPayroll.employee?._id || viewingPayroll.employee?.id);
                    return employeeDetails.phoneNumber || 'N/A';
                  })()}
                </span>
              </div>
              <div className="detail-item">
                <label>Department</label>
                <span>
                  {(() => {
                    const employeeDetails = getEmployeeDetails(viewingPayroll.employee?._id || viewingPayroll.employee?.id);
                    return employeeDetails.department || viewingPayroll.employee?.department || viewingPayroll.department || 'N/A';
                  })()}
                </span>
              </div>
              <div className="detail-item">
                <label>Base Salary</label>
                <span>{formatCurrency(viewingPayroll.baseSalary)}</span>
              </div>
              <div className="detail-item">
                <label>Allowances</label>
                <span>{formatCurrency(viewingPayroll.allowances)}</span>
              </div>
              <div className="detail-item">
                <label>Deductions</label>
                <span>{formatCurrency(viewingPayroll.deductions)}</span>
              </div>
              <div className="detail-item">
                <label>Net Pay</label>
                <span>{formatCurrency(viewingPayroll.netPay)}</span>
              </div>
              <div className="detail-item">
                <label>Status</label>
                <span className={`status-badge status-${viewingPayroll.status}`}>
                  {viewingPayroll.status || 'unpaid'}
                </span>
              </div>
              

              {viewingPayroll.payPeriodStart && (
                <div className="detail-item">
                  <label>Pay Period Start</label>
                  <span>{new Date(viewingPayroll.payPeriodStart).toLocaleDateString()}</span>
                </div>
              )}
              {viewingPayroll.payPeriodEnd && (
                <div className="detail-item">
                  <label>Pay Period End</label>
                  <span>{new Date(viewingPayroll.payPeriodEnd).toLocaleDateString()}</span>
                </div>
              )}
              {viewingPayroll.paymentDate && (
                <div className="detail-item">
                  <label>Payment Date</label>
                  <span>{new Date(viewingPayroll.paymentDate).toLocaleDateString()}</span>
                </div>
              )}
              {viewingPayroll.notes && (
                <div className="detail-item detail-item-full">
                  <label>Notes</label>
                  <span>{viewingPayroll.notes}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EnhancedPayrolls;