import React, { useState, useEffect, useCallback } from 'react';

// API Helper Functions
const API_BASE_URL = 'http://localhost:5000/api/expenses'; // Adjust based on your backend URL

const getAuthToken = () => {
  return (
    window.authToken ||
    window.localStorage?.getItem('token') ||
    window.sessionStorage?.getItem('token')
  );
};

const apiHelper = {
  // Get all expenses with optional filters
  getAllExpenses: async (filters = {}) => {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });

    const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    return response.json();
  },

  // Get expense by ID
  getExpenseById: async (id) => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expense');
    }

    return response.json();
  },

  // Create new expense
  createExpense: async (expenseData) => {
    const token = getAuthToken();

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
      throw new Error('Failed to create expense');
    }

    return response.json();
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
      throw new Error('Failed to update expense');
    }

    return response.json();
  },

  // Delete expense
  deleteExpense: async (id) => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }

    return response.json();
  },

  // Bulk delete expenses
  bulkDeleteExpenses: async (ids) => {
    const token = getAuthToken();

    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error('Failed to bulk delete expenses');
    }

    return response.json();
  },

  // Get expense statistics
getExpenseStats: async (filters = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authorization token is required');
  }

  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const url = queryParams.toString()
    ? `${API_BASE_URL}/stats?${queryParams.toString()}`
    : `${API_BASE_URL}/stats`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Failed to fetch expense stats';
    throw new Error(errorMessage);
  }

  return response.json();
}};

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'expenseDate',
    sortOrder: 'desc'
  });

  // Form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    expenseDate: '',
    category: 'other',
    paymentMethod: '',
    note: ''
  });

  // Mock token - replace with actual authentication
  const [token] = useState('your-auth-token-here');

  const categories = ['food', 'transportation', 'entertainment', 'utilities', 'healthcare', 'shopping', 'education', 'other'];
  const paymentMethods = ['cash', 'credit card', 'debit card', 'bank transfer', 'digital wallet'];

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiHelper.getAllExpenses(filters);
      if (response.success) {
        setExpenses(response.data);
        setPagination(response.pagination);
      } else {
        setError('Failed to fetch expenses');
      }
    } catch (err) {
      setError('Error fetching expenses');
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const fetchStats = async () => {
    try {
      const response = await apiHelper.getExpenseStats({}, token);
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError('Error fetching statistics');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      if (editingExpense) {
        response = await apiHelper.updateExpense(editingExpense._id, formData, token);
      } else {
        response = await apiHelper.createExpense(formData, token);
      }

      if (response.success) {
        setSuccess(editingExpense ? 'Expense updated successfully' : 'Expense created successfully');
        resetForm();
        fetchExpenses();
      } else {
        setError(response.message || 'Operation failed');
      }
    } catch (err) {
      setError('Error submitting form');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    setLoading(true);
    try {
      const response = await apiHelper.deleteExpense(id, token);
      if (response.success) {
        setSuccess('Expense deleted successfully');
        fetchExpenses();
      } else {
        setError('Failed to delete expense');
      }
    } catch (err) {
      setError('Error deleting expense');
    }
    setLoading(false);
  };

  const handleBulkDelete = async () => {
    if (selectedExpenses.length === 0) return;
    if (!window.confirm(`Delete ${selectedExpenses.length} selected expenses?`)) return;

    setLoading(true);
    try {
      const response = await apiHelper.bulkDeleteExpenses(selectedExpenses, token);
      if (response.success) {
        setSuccess(`${response.deletedCount} expenses deleted successfully`);
        setSelectedExpenses([]);
        fetchExpenses();
      } else {
        setError('Failed to delete expenses');
      }
    } catch (err) {
      setError('Error deleting expenses');
    }
    setLoading(false);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      expenseDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().split('T')[0] : '',
      category: expense.category,
    
      paymentMethod: expense.paymentMethod || '',
      note: expense.note || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      expenseDate: '',
      category: 'other',
      paidBy: '',
      paymentMethod: '',
      note: ''
    });
    setEditingExpense(null);
    setShowForm(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const toggleExpenseSelection = (id) => {
    setSelectedExpenses(prev => 
      prev.includes(id) 
        ? prev.filter(expId => expId !== id)
        : [...prev, id]
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <style>{css}</style>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Expense Management System</h1>
        <div style={styles.headerActions}>
          <button 
            style={styles.primaryButton}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Expense'}
          </button>
          <button 
            style={styles.secondaryButton}
            onClick={() => {
              setShowStats(!showStats);
              if (!showStats) fetchStats();
            }}
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      {/* Statistics */}
      {showStats && stats && (
        <div style={styles.statsContainer}>
          <h3>Expense Statistics</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <h4>Total Amount</h4>
              <p style={styles.statValue}>{formatCurrency(stats.overview.totalAmount)}</p>
            </div>
            <div style={styles.statCard}>
              <h4>Total Expenses</h4>
              <p style={styles.statValue}>{stats.overview.totalExpenses}</p>
            </div>
            <div style={styles.statCard}>
              <h4>Average Amount</h4>
              <p style={styles.statValue}>{formatCurrency(stats.overview.averageAmount)}</p>
            </div>
            <div style={styles.statCard}>
              <h4>Highest Expense</h4>
              <p style={styles.statValue}>{formatCurrency(stats.overview.maxAmount)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={styles.formContainer}>
          <h3>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
          <div style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Expense Date</label>
                <input
                  type="date"
                  value={formData.expenseDate}
                  onChange={(e) => setFormData({...formData, expenseDate: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  style={styles.select}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formRow}>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  style={styles.select}
                >
                  <option value="">Select method</option>
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Note</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                style={styles.textarea}
                rows="3"
              />
            </div>

            <div style={styles.formActions}>
              <button onClick={handleSubmit} style={styles.primaryButton} disabled={loading}>
                {loading ? 'Saving...' : (editingExpense ? 'Update' : 'Create')}
              </button>
              <button onClick={resetForm} style={styles.secondaryButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.filterRow}>
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Paid by..."
            value={filters.paidBy || ''}
            onChange={(e) => handleFilterChange('paidBy', e.target.value)}
            style={styles.filterInput}
          />

          <input
            type="date"
            placeholder="Start date"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            style={styles.filterInput}
          />

          <input
            type="date"
            placeholder="End date"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            style={styles.filterInput}
          />
        </div>

        {selectedExpenses.length > 0 && (
          <div style={styles.bulkActions}>
            <span>{selectedExpenses.length} selected</span>
            <button onClick={handleBulkDelete} style={styles.dangerButton}>
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Expenses List */}
      <div style={styles.expensesContainer}>
        {loading && <div style={styles.loading}>Loading...</div>}
        
        {expenses.length === 0 && !loading && (
          <div style={styles.emptyState}>No expenses found</div>
        )}

        {expenses.map((expense) => (
          <div key={expense._id} style={styles.expenseCard}>
            <div style={styles.expenseHeader}>
              <input
                type="checkbox"
                checked={selectedExpenses.includes(expense._id)}
                onChange={() => toggleExpenseSelection(expense._id)}
                style={styles.checkbox}
              />
              <h4 style={styles.expenseTitle}>{expense.description}</h4>
              <span style={styles.expenseAmount}>{formatCurrency(expense.amount)}</span>
            </div>
            
            <div style={styles.expenseDetails}>
              <span style={styles.expenseCategory}>
                {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
              </span>
              <span>{formatDate(expense.expenseDate)}</span>
              {expense.paidBy && <span>Paid by: {expense.paidBy}</span>}
              {expense.paymentMethod && <span>via {expense.paymentMethod}</span>}
            </div>

            {expense.note && (
              <p style={styles.expenseNote}>{expense.note}</p>
            )}

            <div style={styles.expenseActions}>
              <button onClick={() => handleEdit(expense)} style={styles.editButton}>
                Edit
              </button>
              <button onClick={() => handleDelete(expense._id)} style={styles.deleteButton}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            style={styles.paginationButton}
          >
            Previous
          </button>
          <span style={styles.paginationInfo}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            style={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  title: {
    color: '#333',
    fontSize: '28px',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '10px'
  },
  primaryButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  editButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '5px'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    border: '1px solid #c3e6cb'
  },
  statsContainer: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginTop: '15px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '5px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '5px 0 0 0'
  },
  formContainer: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px'
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    backgroundColor: 'white'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    resize: 'vertical'
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  },
  filtersContainer: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  filterRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px',
    marginBottom: '10px'
  },
  filterSelect: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px'
  },
  filterInput: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px'
  },
  bulkActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    borderTop: '1px solid #ddd'
  },
  expensesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  expenseCard: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  expenseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px'
  },
  checkbox: {
    width: '16px',
    height: '16px'
  },
  expenseTitle: {
    flex: 1,
    margin: 0,
    fontSize: '18px',
    color: '#333'
  },
  expenseAmount: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#007bff'
  },
  expenseDetails: {
    display: 'flex',
    gap: '15px',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#666'
  },
  expenseCategory: {
    backgroundColor: '#e9ecef',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px'
  },
  expenseNote: {
    backgroundColor: '#f8f9fa',
    padding: '8px',
    borderRadius: '5px',
    fontSize: '14px',
    margin: '10px 0',
    fontStyle: 'italic'
  },
  expenseActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '16px',
    color: '#666'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '30px',
    padding: '20px'
  },
  paginationButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  paginationInfo: {
    fontSize: '14px',
    color: '#666'
  }
};

const css = `
  * {
    box-sizing: border-box;
  }
  
  button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
  
  .expense-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
  
  @media (max-width: 768px) {
    .form-row,
    .filter-row {
      grid-template-columns: 1fr;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .expense-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
    
    .expense-details {
      flex-direction: column;
      gap: 5px;
    }
  }
`;

export default ExpenseManagement;