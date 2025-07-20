import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
// import apiHelper from './apiHelper'; // Import the separated API helper
import './Income.css'; // Import your CSS styles
import apiHelper from '../features/Income/incomeApi';

const IncomeManagementApp = () => {
  // State management
  const [incomes, setIncomes] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'receivedDate',
    sortOrder: 'desc',
    method: '',
  });
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    receivedDate: new Date().toISOString().split('T')[0],
    student: '',
    method: 'Cash',
    note: '',
    category: 'fees',
    reference: '',
    status: 'Confirmed'
  });

  // Constants
  const validMethods = ['Cash', 'Bank', 'MOMO', 'Other'];
  const validStatuses = ['Pending', 'Confirmed', 'Cancelled'];

  // API calls - Define these functions before useEffect hooks
 const fetchStudents = async () => {
  try {
    const res = await apiHelper.students.getAll();
    const data = res.data || res;
    setStudents(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Failed to fetch students', err);
    setStudents([]); // fallback to empty array to prevent `.map` error
  }
};

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiHelper.income.getAll(filters);
      setIncomes(response.data || response);
      if (response.pagination) {
        setPagination(response.pagination);
      } else {
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await apiHelper.income.getStatistics();
      setStatistics(response.data || response);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  }, []);

  // Effects - Now the functions are defined before being used
  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Form handlers
  const handleSubmit = async () => {
    if (!formData.source || !formData.amount) {
      alert('Please fill in required fields');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingIncome) {
        await apiHelper.income.update(editingIncome._id, submitData);
      } else {
        await apiHelper.income.create(submitData);
      }

      setShowModal(false);
      setEditingIncome(null);
      resetForm();
      fetchIncomes();
      fetchStatistics();
    } catch (error) {
      console.error('Failed to save income:', error);
      alert('Failed to save income record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income record?')) return;

    setLoading(true);
    try {
      await apiHelper.income.delete(id);
      fetchIncomes();
      fetchStatistics();
    } catch (error) {
      console.error('Failed to delete income:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setFormData({
      source: income.source,
      amount: income.amount.toString(),
      receivedDate: income.receivedDate.split('T')[0],
      student: income.student?._id || '',
      method: income.method,
      note: income.note || '',
      category: income.category,
      reference: income.reference || '',
      status: income.status
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      source: '',
      amount: '',
      receivedDate: new Date().toISOString().split('T')[0],
      student: '',
      method: 'Cash',
      note: '',
      category: 'fees',
      reference: '',
      status: 'Confirmed'
    });
  };

  const handlePageChange = (page) => {
    if (page < 1 || (pagination && page > pagination.totalPages)) return;
    setFilters(prev => ({ ...prev, page }));
  };

  // Utility functions
  const filteredIncomes = incomes.filter(income =>
    income.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Component JSX
  return (
    <div className="income-management-container">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="header-card">
          <div className="header-content">
            <div>
              <h1 className="main-title">Income Management</h1>
              <p className="subtitle">Track and manage all income records</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingIncome(null);
                setShowModal(true);
              }}
              className="add-button"
            >
              <Plus size={20} />
              Add Income
            </button>
          </div>

          {/* Statistics Cards */}
          {statistics && (
            <div className="stats-grid">
              <div className="stat-card green">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Total Amount</p>
                    <p className="stat-value">
                      {formatCurrency(statistics.overall?.totalAmount || 0)}
                    </p>
                  </div>
                  <DollarSign size={32} className="stat-icon" />
                </div>
              </div>

              <div className="stat-card blue">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Total Records</p>
                    <p className="stat-value">
                      {statistics.overall?.totalRecords || 0}
                    </p>
                  </div>
                  <TrendingUp size={32} className="stat-icon" />
                </div>
              </div>

              <div className="stat-card purple">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">Average Amount</p>
                    <p className="stat-value">
                      {formatCurrency(statistics.overall?.averageAmount || 0)}
                    </p>
                  </div>
                  <Users size={32} className="stat-icon" />
                </div>
              </div>

              <div className="stat-card orange">
                <div className="stat-content">
                  <div>
                    <p className="stat-label">This Month</p>
                    <p className="stat-value">
                      {statistics.byTime?.length > 0
                        ? formatCurrency(statistics.byTime[statistics.byTime.length - 1]?.totalAmount || 0)
                        : '$0.00'}
                    </p>
                  </div>
                  <Calendar size={32} className="stat-icon" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="filters-card">
          <div className="filters-content">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search by source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={filters.method}
              onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value, page: 1 }))}
              className="filter-select"
            >
              <option value="">All Methods</option>
              {validMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value, page: 1 }))}
              className="filter-select"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Income Table */}
        <div className="table-card">
          <div className="table-container">
            <table className="income-table">
              <thead className="table-header">
                <tr>
                  <th className="table-th">Source</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Method</th>
                  <th className="table-th">Date</th>
                  <th className="table-th">Student</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="loading-cell">
                      <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <span className="loading-text">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredIncomes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-cell">No income records found</td>
                  </tr>
                ) : (
                  filteredIncomes.map((income) => (
                    <tr key={income._id} className="table-row">
                      <td className="table-cell">
                        <div className="cell-primary">{income.source}</div>
                        <div className="cell-secondary">{income.category}</div>
                      </td>
                      <td className="table-cell">
                        <div className="amount-cell">{formatCurrency(income.amount)}</div>
                      </td>
                      <td className="table-cell">
                        <span className={`method-badge ${income.method.toLowerCase()}`}>
                          {income.method}
                        </span>
                      </td>
                      <td className="table-cell">{formatDate(income.receivedDate)}</td>
                      <td className="table-cell">
                        {income.student ? (
                          <div className="cell-primary">{income.student.fullName}</div>
                        ) : (
                          <span className="cell-secondary">N/A</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className={`status-badge ${income.status.toLowerCase()}`}>
                          {income.status}
                        </span>
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => handleEdit(income)}
                          className="action-button edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(income._id)}
                          className="action-button delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </div>
              <div className="pagination-buttons">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="pagination-btn"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`pagination-btn ${
                      pagination.currentPage === idx + 1 ? 'active' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal for Add/Edit Income */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="modal-title">{editingIncome ? 'Edit Income' : 'Add Income'}</h2>

              <div className="form-fields">
                <div className="form-field">
                  <label className="form-label">Source *</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Received Date *</label>
                  <input
                    type="date"
                    value={formData.receivedDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, receivedDate: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Student</label>
                  <select
                    value={formData.student}
                    onChange={(e) => setFormData(prev => ({ ...prev, student: e.target.value }))}
                    className="form-input"
                  >
                    <option value="">Select a student</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.fullName || student.name || student.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Method</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                    className="form-input"
                  >
                    {validMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="form-input"
                  >
                    {validStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Reference</label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Note</label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                    rows={3}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingIncome(null);
                    resetForm();
                  }}
                  className="cancel-button"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingIncome ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeManagementApp;