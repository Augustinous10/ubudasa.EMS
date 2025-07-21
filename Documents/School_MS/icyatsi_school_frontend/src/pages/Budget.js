import React, { useState, useEffect, useCallback } from 'react';

const BudgetApp = () => {
  const [budgets, setBudgets] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    startDate: '',
    endDate: '',
    note: ''
  });

  const API_BASE = 'http://localhost:5000/api';

  // Categories array for dropdown
  const categories = [
    'Utilities',
    'Food',
    'Maintenance',
    'Salaries',
    'Office Supplies',
    'Classroom Supplies',
    'Transportation',
    'Sports Equipment',
    'Library Resources',
    'Technology',
    'Health and Safety',
    'Events and Activities',
    'Scholarships',
    'Tuition Fees',
    'Other'
  ];

  // Get user from your existing authentication system
  const getAuthToken = useCallback(() => {
    // Get token from localStorage or wherever your app stores it
    return localStorage.getItem('token');
  }, []);

  const getCurrentUser = useCallback(() => {
    // Get user data from localStorage or your auth context
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }, []);

  // Load user on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, [getCurrentUser]);

  // Fetch budgets with authentication - wrapped in useCallback
  const fetchBudgets = useCallback(async () => {
    const token = getAuthToken();
    
    if (!token) {
      setError('Authentication required. Please login first.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/budgets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        setError('Authentication expired. Please login again.');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBudgets(Array.isArray(data) ? data : []);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Failed to load budgets. Please try again.');
    }
  }, [getAuthToken]);

  // Fetch comparison data with authentication - wrapped in useCallback
  const fetchComparison = useCallback(async () => {
    const token = getAuthToken();
    
    if (!token) {
      setError('Authentication required. Please login first.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/budgets/compare`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        setError('Authentication expired. Please login again.');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setComparison(Array.isArray(data) ? data : []);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching comparison:', error);
      setError('Failed to load comparison data. Please try again.');
    }
  }, [getAuthToken]);

  // Only fetch data if user is authenticated - now with proper dependencies
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchBudgets();
      fetchComparison();
    } else {
      setError('Please login to view your budgets.');
    }
  }, [user, fetchBudgets, fetchComparison, getAuthToken]); // Now includes all dependencies

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    
    if (!token) {
      alert('Authentication required. Please login first.');
      return;
    }

    setLoading(true);
    
    try {
      const url = editingBudget 
        ? `${API_BASE}/budgets/${editingBudget._id}`
        : `${API_BASE}/budgets`;
      
      const method = editingBudget ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchBudgets();
        fetchComparison();
        setShowForm(false);
        setEditingBudget(null);
        setFormData({ category: '', amount: '', startDate: '', endDate: '', note: '' });
        alert(editingBudget ? 'Budget updated successfully!' : 'Budget created successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Operation failed');
      }
    } catch (error) {
      alert('Error saving budget');
    }
    setLoading(false);
  };

  // Handle delete
  const handleDelete = async (id) => {
    const token = getAuthToken();
    
    if (!token) {
      alert('Authentication required. Please login first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const response = await fetch(`${API_BASE}/budgets/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchBudgets();
          fetchComparison();
          alert('Budget deleted successfully!');
        } else {
          alert('Failed to delete budget');
        }
      } catch (error) {
        alert('Error deleting budget');
      }
    }
  };

  // Handle edit
  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      startDate: budget.startDate?.split('T')[0] || '',
      endDate: budget.endDate?.split('T')[0] || '',
      note: budget.note || ''
    });
    setShowForm(true);
  };

  // Handle retry
  const handleRetry = () => {
    const token = getAuthToken();
    if (token) {
      fetchBudgets();
      fetchComparison();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Budget Management System</h1>
        {user && (
          <span style={styles.welcomeText}>Welcome, {user.firstName || user.name}!</span>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.errorBanner}>
          <span>{error}</span>
          <button onClick={handleRetry} style={styles.retryBtn}>
            Retry
          </button>
        </div>
      )}

      <div style={styles.actions}>
        <button 
          onClick={() => setShowForm(true)} 
          style={styles.createBtn}
          disabled={!getAuthToken()}
        >
          Create New Budget
        </button>
        {!getAuthToken() && (
          <p style={styles.loginPrompt}>Please login to create and manage budgets.</p>
        )}
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>{editingBudget ? 'Edit Budget' : 'Create Budget'}</h2>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingBudget(null);
                  setFormData({ category: '', amount: '', startDate: '', endDate: '', note: '' });
                }}
                style={styles.closeBtn}
              >
                ×
              </button>
            </div>
            <div style={styles.form}>
              {/* Replaced input with select */}
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                style={styles.input}
              >
                <option value="" disabled>
                  -- Select Category --
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
                style={styles.input}
              />
              <input
                type="date"
                placeholder="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
                style={styles.input}
              />
              <input
                type="date"
                placeholder="End Date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
                style={styles.input}
              />
              <textarea
                placeholder="Note (optional)"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                style={styles.textarea}
                rows="3"
              />
              <button onClick={handleSubmit} disabled={loading} style={styles.submitBtn}>
                {loading ? 'Saving...' : (editingBudget ? 'Update Budget' : 'Create Budget')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget List */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>All Budgets</h2>
        <div style={styles.grid}>
          {!getAuthToken() ? (
            <p style={styles.emptyState}>Please login to view your budgets.</p>
          ) : budgets.length === 0 ? (
            <p style={styles.emptyState}>No budgets found. Create your first budget!</p>
          ) : (
            budgets.map(budget => (
              <div key={budget._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{budget.category}</h3>
                  <span style={styles.amount}>${budget.amount.toFixed(2)}</span>
                </div>
                <div style={styles.cardBody}>
                  <p><strong>Start:</strong> {new Date(budget.startDate).toLocaleDateString()}</p>
                  <p><strong>End:</strong> {new Date(budget.endDate).toLocaleDateString()}</p>
                  {budget.note && <p><strong>Note:</strong> {budget.note}</p>}
                  {budget.createdBy && (
                    <p style={styles.createdBy}>
                      Created by: {budget.createdBy.firstName} {budget.createdBy.lastName}
                    </p>
                  )}
                </div>
                <div style={styles.cardActions}>
                  <button 
                    onClick={() => handleEdit(budget)} 
                    style={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(budget._id)} 
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Budget vs Expenses Comparison */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Budget vs Expenses</h2>
        <div style={styles.comparisonGrid}>
          {!getAuthToken() ? (
            <p style={styles.emptyState}>Please login to view comparison data.</p>
          ) : comparison.length === 0 ? (
            <p style={styles.emptyState}>No comparison data available.</p>
          ) : (
            comparison.map((item, index) => (
              <div key={index} style={{
                ...styles.comparisonCard,
                ...(item.overspent ? styles.overspentCard : styles.underBudgetCard)
              }}>
                <h4 style={styles.comparisonTitle}>{item.category}</h4>
                <div style={styles.comparisonData}>
                  <p><strong>Budget:</strong> ${item.budgetAmount.toFixed(2)}</p>
                  <p><strong>Actual:</strong> ${item.actualExpense.toFixed(2)}</p>
                  <p><strong>Difference:</strong> ${(item.actualExpense - item.budgetAmount).toFixed(2)}</p>
                  <div style={{
                    ...styles.statusBadge,
                    backgroundColor: item.overspent ? '#ff4444' : '#44aa44'
                  }}>
                    {item.overspent ? 'Over Budget' : 'Under Budget'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Pure CSS Styles
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#2c3e50',
    fontSize: '28px',
    margin: '0',
    fontWeight: '700'
  },
  welcomeText: {
    color: '#2c3e50',
    fontWeight: '500'
  },
  errorBanner: {
    backgroundColor: '#fff2f2',
    border: '1px solid #ffcccc',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#d63031'
  },
  retryBtn: {
    backgroundColor: '#d63031',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  actions: {
    marginBottom: '30px',
    textAlign: 'center'
  },
  createBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)',
    opacity: 1
  },
  loginPrompt: {
    color: '#7f8c8d',
    marginTop: '10px',
    fontSize: '14px'
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '0',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: '1px solid #ecf0f1',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#7f8c8d',
    padding: '0',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    padding: '25px'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '15px',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '15px',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  submitBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '15px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    width: '100%',
    transition: 'all 0.3s ease'
  },
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    color: '#2c3e50',
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: '600'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid #ecf0f1'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #ecf0f1'
  },
  cardTitle: {
    color: '#2c3e50',
    fontSize: '18px',
    margin: '0',
    fontWeight: '600'
  },
  amount: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  cardBody: {
    marginBottom: '15px'
  },
  createdBy: {
    color: '#7f8c8d',
    fontSize: '12px',
    fontStyle: 'italic',
    marginTop: '10px'
  },
  cardActions: {
    display: 'flex',
    gap: '10px'
  },
  editBtn: {
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    flex: '1'
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    flex: '1'
  },
  comparisonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  comparisonCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '2px solid #ecf0f1'
  },
  overspentCard: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5'
  },
  underBudgetCard: {
    borderColor: '#44aa44',
    backgroundColor: '#f5fff5'
  },
  comparisonTitle: {
    color: '#2c3e50',
    fontSize: '16px',
    margin: '0 0 15px 0',
    fontWeight: '600'
  },
  comparisonData: {
    fontSize: '14px',
    lineHeight: '1.6'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '10px'
  },
  emptyState: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '16px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }
};

export default BudgetApp;
