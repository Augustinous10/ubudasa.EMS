import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, Eye, DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';
import './payment.css'; // Import your CSS styles

// API Helper Functions
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const authHeader = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

const apiHelper = {
  createPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  getAllPayments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/payments?${queryString}`, {
      headers: {
        ...authHeader(),
      },
    });
    return response.json();
  },

  updatePayment: async (id, paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  deletePayment: async (id) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeader(),
      },
    });
    return response.json();
  },

  getPaymentStatistics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/payments/statistics?${queryString}`, {
      headers: {
        ...authHeader(),
      },
    });
    return response.json();
  },

  searchPayments: async (query, params = {}) => {
    const queryString = new URLSearchParams({ q: query, ...params }).toString();
    const response = await fetch(`${API_BASE_URL}/payments/search?${queryString}`, {
      headers: {
        ...authHeader(),
      },
    });
    return response.json();
  },
};

export const getAllStudents = async () => {
  try {
    const res = await fetch('/api/students', {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`, // add token here if needed
      }
    });
    const data = await res.json();
    return data;  // returns { students: [...], summary: {...}, ... }
  } catch (error) {
    return { success: false, message: 'Error fetching students' };
  }
};
// Payment Form Component
const PaymentForm = ({ payment, onSubmit, onCancel, isEditing = false, students = [] }) => {
  const [formData, setFormData] = useState({
    student: payment?.student?._id || '',
    amount: payment?.amount || '',
    paymentDate: payment?.paymentDate ? payment.paymentDate.split('T')[0] : '',
    method: payment?.method || 'cash',
    receiptNumber: payment?.receiptNumber || '',
    note: payment?.note || '',
    category: payment?.category || 'fees',
    reference: payment?.reference || '',
    currency: payment?.currency || 'USD',
  });

  const paymentMethods = ['cash', 'bank_transfer', 'cheque', 'credit_card', 'debit_card', 'mobile_money', 'other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, amount: parseFloat(formData.amount) });
  };

  return (
    <div className="payment-form">
      <div className="form-row">
        <div className="form-group">
          <label>Student</label>
                          <select name="student" value={formData.student} onChange={handleChange} required>
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.fullName}
                    </option>
                  ))}
                </select>
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Payment Date</label>
          <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Payment Method</label>
          <select name="method" value={formData.method} onChange={handleChange}>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Receipt Number</label>
          <input
            type="text"
            name="receiptNumber"
            value={formData.receiptNumber}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="fees" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Currency</label>
          <input type="text" name="currency" value="RWF" readOnly />
        </div>
      </div>

      <div className="form-group">
        <label>Note</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows="3"
          placeholder="Optional note"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          {isEditing ? 'Update Payment' : 'Create Payment'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

// Payment Table Component
const PaymentTable = ({ payments, onEdit, onDelete, onView, loading }) => {
  if (loading) {
    return <div className="loading">Loading payments...</div>;
  }

  return (
    <div className="table-container">
      <table className="payments-table">
        <thead>
          <tr>
            <th>Receipt #</th>
            <th>Student</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Method</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.receiptNumber || 'N/A'}</td>
              <td>
                {payment.student?.fullName || 'Unknown'}
                <br />
                <small>{payment.student?.studentCode}</small>
              </td>
              <td>${payment.amount.toFixed(2)}</td>
              <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
              <td>
                <span className="method-badge">{payment.method.replace('_', ' ').toUpperCase()}</span>
              </td>
              <td>{payment.category}</td>
              <td>
                <div className="action-buttons">
                  <button className="btn-icon" onClick={() => onView(payment)} title="View Details">
                    <Eye size={16} />
                  </button>
                  <button className="btn-icon" onClick={() => onEdit(payment)} title="Edit Payment">
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => onDelete(payment._id)}
                    title="Delete Payment"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Statistics Component
const StatisticsPanel = ({ statistics }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <DollarSign size={24} />
        </div>
        <div className="stat-number">${statistics?.overall?.totalAmount?.toFixed(2) || '0.00'}</div>
        <div className="stat-label">Total Revenue</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">
          <Users size={24} />
        </div>
        <div className="stat-number">{statistics?.overall?.totalPayments || 0}</div>
        <div className="stat-label">Total Payments</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">
          <TrendingUp size={24} />
        </div>
        <div className="stat-number">${statistics?.overall?.averageAmount?.toFixed(2) || '0.00'}</div>
        <div className="stat-label">Average Payment</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">
          <Calendar size={24} />
        </div>
        <div className="stat-number">{new Date().toLocaleDateString()}</div>
        <div className="stat-label">Last Updated</div>
      </div>
    </div>
  );
};

// Main Payment Management Component
const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [payments, setPayments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);

  const [filters] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'create', // create, edit, view
    payment: null,
  });

useEffect(() => {
  const fetchStudents = async () => {
    const res = await getAllStudents();
    console.log('Students API response:', res);
    if (res && res.students) {
      setStudents(res.students);
    } else {
      console.error('Failed to load students:', res?.message || 'No students data');
    }
  };
  fetchStudents();
}, []);

  // Load payments - memoized with useCallback
  const loadPayments = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit: 10, ...filters };
        const result = await apiHelper.getAllPayments(params);
        if (result.success) {
          setPayments(result.data);
          setPagination(
            result.pagination || {
              currentPage: page,
              totalPages: 1,
              totalItems: result.data.length,
              hasNextPage: false,
            }
          );
        }
      } catch (error) {
        console.error('Error loading payments:', error);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Load statistics
  const loadStatistics = useCallback(async () => {
    try {
      const result = await apiHelper.getPaymentStatistics();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }, []);

  // Search payments
  const handleSearch = useCallback(async () => {
    const query = searchQuery.trim();

    if (!query) {
      loadPayments();
      return;
    }

    setLoading(true);

    try {
      const result = await apiHelper.searchPayments(query);
      if (result?.success) {
        setPayments(result.data);
        setPagination(
          result.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: result.data.length,
            hasNextPage: false,
          }
        );
      } else {
        alert(result?.message || 'Failed to fetch search results');
      }
    } catch (error) {
      console.error('Error searching payments:', error);
      alert('An error occurred while searching for payments');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, loadPayments]);

  // Handle payment creation/update
  const handlePaymentSubmit = async (paymentData) => {
    try {
      let result;
      if (modalState.type === 'edit') {
        result = await apiHelper.updatePayment(modalState.payment._id, paymentData);
      } else {
        result = await apiHelper.createPayment(paymentData);
      }

      if (result.success) {
        setModalState({ isOpen: false, type: 'create', payment: null });
        loadPayments();
        if (activeTab === 'statistics') {
          loadStatistics();
        }
      } else {
        alert(result.message || 'Error processing payment');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Error processing payment');
    }
  };

  // Handle payment deletion
  const handleDelete = async (paymentId) => {
    if (!paymentId || paymentId.length !== 24) {
      alert('Invalid payment ID.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this payment?')) return;

    try {
      const result = await apiHelper.deletePayment(paymentId);
      if (result.success) {
        loadPayments();
        if (activeTab === 'statistics') {
          loadStatistics();
        }
      } else {
        alert(result.message || 'Error deleting payment');
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('Error deleting payment');
    }
  };

  // Handle pagination
  const handlePagination = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Initialize data when tab changes or page changes
  useEffect(() => {
    if (activeTab === 'list') {
      loadPayments(pagination.currentPage);
    } else if (activeTab === 'statistics') {
      loadStatistics();
    }
  }, [activeTab, loadPayments, loadStatistics, pagination.currentPage]);

  return (
    <div className="payment-management">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>Payment Management System</h1>
          <p>Manage student payments efficiently and securely</p>
        </div>

        {/* Navigation */}
        <div className="nav-tabs">
          <button className={`nav-tab ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
            Payment List
          </button>
          <button
            className={`nav-tab ${activeTab === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistics')}
          >
            Statistics
          </button>
        </div>

        {/* Payment List Tab */}
        {activeTab === 'list' && (
          <div className="tab-content active">
            <div className="content-header">
              <div className="search-section">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button className="search-btn" onClick={handleSearch}>
                    <Search size={20} />
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setModalState({ isOpen: true, type: 'create', payment: null })}
              >
                <Plus size={20} />
                New Payment
              </button>
            </div>

            <PaymentTable
              payments={payments}
              onEdit={(payment) => setModalState({ isOpen: true, type: 'edit', payment })}
              onDelete={handleDelete}
              onView={(payment) => setModalState({ isOpen: true, type: 'view', payment })}
              loading={loading}
            />

            {/* Pagination */}
            <div className="pagination">
              <button disabled={pagination.currentPage === 1} onClick={() => handlePagination(pagination.currentPage - 1)}>
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button disabled={!pagination.hasNextPage} onClick={() => handlePagination(pagination.currentPage + 1)}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="tab-content active">
            <h2>Payment Statistics</h2>
            <StatisticsPanel statistics={statistics} />
          </div>
        )}

        {/* Modal */}
        {modalState.isOpen && (
          <div className="modal active">
            <div className="modal-content">
              <div className="modal-header">
                <h3>
                  {modalState.type === 'create' && 'Create New Payment'}
                  {modalState.type === 'edit' && 'Edit Payment'}
                  {modalState.type === 'view' && 'Payment Details'}
                </h3>
                <button className="close-btn" onClick={() => setModalState({ isOpen: false, type: 'create', payment: null })}>
                  ×
                </button>
              </div>

              {modalState.type === 'view' ? (
                <div className="payment-details">
                  <p>
                    <strong>Student:</strong> {modalState.payment?.student?.fullName}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${modalState.payment?.amount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(modalState.payment?.paymentDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Method:</strong> {modalState.payment?.method.replace('_', ' ').toUpperCase()}
                  </p>
                  <p>
                    <strong>Receipt:</strong> {modalState.payment?.receiptNumber || 'N/A'}
                  </p>
                  <p>
                    <strong>Note:</strong> {modalState.payment?.note || 'N/A'}
                  </p>
                </div>
              ) : (
                <PaymentForm
                  payment={modalState.payment}
                  onSubmit={handlePaymentSubmit}
                  onCancel={() => setModalState({ isOpen: false, type: 'create', payment: null })}
                  isEditing={modalState.type === 'edit'}
                  students={students}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;