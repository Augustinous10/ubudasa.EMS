import React, { useState, useEffect, useCallback } from 'react';

// API Helper Functions
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust to your backend URL

const apiHelper = {
  getAuthToken: () => {
    const token = window.authToken ||
                  window.localStorage?.getItem('token') ||
                  window.sessionStorage?.getItem('token') ||
                  '';
    return token;
  },

  getAuthHeaders: () => {
    const token = apiHelper.getAuthToken();
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Get all employees for dropdown
  getEmployees: async () => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'GET',
      headers: apiHelper.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    const json = await response.json();
    return json.data || json;
  },

  // Request advance (accountant only)
  requestAdvance: async (advanceData) => {
    const response = await fetch(`${API_BASE_URL}/advances`, {
      method: 'POST',
      headers: apiHelper.getAuthHeaders(),
      body: JSON.stringify(advanceData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to request advance');
    }
    return response.json();
  },

  // Approve/Reject advance (head teacher only)
  approveAdvance: async (advanceId, status) => {
    const response = await fetch(`${API_BASE_URL}/advances/${advanceId}/approve`, {
      method: 'PUT',
      headers: apiHelper.getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update advance status');
    }
    return response.json();
  },

  // List all advances (accessible to any authenticated user)
  listAdvances: async () => {
    const response = await fetch(`${API_BASE_URL}/advances`, {
      method: 'GET',
      headers: apiHelper.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch advances');
    }
    return response.json();
  }
};

// Main App Component
const AdvanceRequestApp = () => {
  // TEMPORARY: Role selector for testing - replace this with your actual auth system
  const [currentUserRole, setCurrentUserRole] = useState(window.userRole || 'accountant');
  
  const [activeTab, setActiveTab] = useState('list');
  const [advances, setAdvances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Use the state instead of directly accessing window.userRole
  const userRole = currentUserRole;

  // Form data for advance requests
  const [formData, setFormData] = useState({
    employeeId: '',
    amountRequested: '',
    reason: '',
    month: '',
    year: ''
  });

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Always load advances list
      const advancesData = await apiHelper.listAdvances();
      setAdvances(Array.isArray(advancesData) ? advancesData : []);

      // Only load employees if user is accountant (they need it for the form)
      if (userRole === 'accountant') {
        const employeesData = await apiHelper.getEmployees();
        setEmployees(Array.isArray(employeesData) ? employeesData : []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadAdvances = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiHelper.listAdvances();
      setAdvances(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setAdvances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmitAdvance = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Prepare data with correct keys expected by backend
      const submitData = {
        employee: formData.employeeId,
        amountRequested: parseFloat(formData.amountRequested),
        reason: formData.reason,
        month: formData.month,
        year: parseInt(formData.year, 10)
      };

      // Validate required fields on client side
      if (!submitData.employee || !submitData.amountRequested || !submitData.month || !submitData.year) {
        setError('Please fill all required fields: Employee, Amount, Month, and Year');
        setLoading(false);
        return;
      }

      await apiHelper.requestAdvance(submitData);
      setSuccess('Advance request submitted successfully!');
      setFormData({
        employeeId: '',
        amountRequested: '',
        reason: '',
        month: '',
        year: ''
      });
      loadAdvances();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (advanceId, status) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await apiHelper.approveAdvance(advanceId, status);
      setSuccess(`Advance ${status} successfully!`);
      loadAdvances();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getEmployeeName = (employee) => {
    if (!employee) return 'Unknown Employee';

    if (typeof employee === 'string') {
      const found = employees.find(emp => String(emp._id) === String(employee));
      return found ? `${found.firstName} ${found.lastName}` : 'Unknown Employee';
    }

    if (typeof employee === 'object' && employee.firstName && employee.lastName) {
      return `${employee.firstName} ${employee.lastName}`;
    }

    return 'Unknown Employee';
  };

  // Determine role display name
  const getRoleDisplayName = (role) => {
    switch(role) {
      case 'accountant': return 'Accountant';
      case 'head_teacher': return 'Head Teacher';
      default: return role;
    }
  };

  return (
    <div className="app-container">
      <style>{`
        * {
          margin: 0; padding: 0; box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          color: #333;
        }
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2c3e50;
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        .header p {
          color: #7f8c8d;
          font-size: 1.1rem;
        }
        .role-selector {
          margin: 20px 0;
          padding: 15px;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          text-align: center;
        }
        .role-selector select {
          margin-left: 10px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
          background: white;
          border-radius: 10px;
          padding: 5px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .tab {
          padding: 12px 24px;
          margin: 0 5px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .tab.active {
          background: #3498db;
          color: white;
        }
        .tab:hover {
          background: #ecf0f1;
        }
        .tab.active:hover {
          background: #2980b9;
        }
        .content-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .form-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e6ed;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          background: white;
        }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3498db;
        }
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        .form-group select {
          cursor: pointer;
        }
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-right: 10px;
        }
        .btn-primary {
          background: #3498db;
          color: white;
        }
        .btn-primary:hover {
          background: #2980b9;
        }
        .btn-success {
          background: #27ae60;
          color: white;
        }
        .btn-success:hover {
          background: #219a52;
        }
        .btn-danger {
          background: #e74c3c;
          color: white;
        }
        .btn-danger:hover {
          background: #c0392b;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .alert {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .alert-error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
        }
        .advances-grid {
          display: grid;
          gap: 20px;
          margin-top: 20px;
        }
        .advance-card {
          border: 1px solid #e0e6ed;
          border-radius: 10px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        .advance-card:hover {
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        .advance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .employee-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
        }
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-pending {
          background: #fff3cd;
          color: #856404;
        }
        .status-approved {
          background: #d4edda;
          color: #155724;
        }
        .status-rejected {
          background: #f8d7da;
          color: #721c24;
        }
        .advance-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        .detail-item {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
        }
        .detail-label {
          font-size: 0.85rem;
          color: #6c757d;
          margin-bottom: 4px;
        }
        .detail-value {
          font-weight: 600;
          color: #2c3e50;
        }
        .amount {
          font-size: 1.3rem;
          color: #27ae60;
        }
        .actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        .role-indicator {
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          margin-bottom: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          color: white;
        }
        .role-accountant {
          background: #3498db;
        }
        .role-head_teacher {
          background: #e74c3c;
        }
        .access-denied {
          text-align: center;
          padding: 40px;
          color: #e74c3c;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
        }
        @media (max-width: 768px) {
          .app-container {
            padding: 10px;
          }
          .header h1 {
            font-size: 2rem;
          }
          .tabs {
            flex-direction: column;
          }
          .tab {
            margin: 2px 0;
          }
          .content-section {
            padding: 20px;
          }
          .advance-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .actions {
            flex-direction: column;
          }
          .btn {
            margin-right: 0;
            margin-bottom: 10px;
          }
        }
      `}</style>

      <div className="header">
        <h1>Employee Advance Management</h1>
        <p>Request and manage employee advance payments</p>
        
        {/* TEMPORARY: Role selector for testing */}
        <div className="role-selector">
          
          <select 
            value={currentUserRole} 
            onChange={(e) => setCurrentUserRole(e.target.value)}
          >
            <option value="accountant">Accountant</option>
            <option value="head_teacher">Head Teacher</option>
          </select>
          
        </div>
        
        <div className={`role-indicator role-${userRole}`}>
          Current Role: {getRoleDisplayName(userRole)}
        </div>
      </div>

      <div className="tabs">
        {/* View Advances tab - Available to ALL roles */}
        <button
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          View Advances
        </button>
        
        {/* Request Advance tab - ONLY for accountants */}
        {userRole === 'accountant' && (
          <button
            className={`tab ${activeTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveTab('request')}
          >
            Request Advance
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="content-section">
        {/* Request Advance Form - ONLY for accountants */}
        {activeTab === 'request' && (
          <>
            {userRole === 'accountant' ? (
              <div className="form-container">
                <h2>Request New Advance</h2>

                <div className="form-group">
                  <label>Select Employee</label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose an employee...</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName} ({employee.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount Requested</label>
                  <input
                    type="number"
                    name="amountRequested"
                    value={formData.amountRequested}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Month</label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Month</option>
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map((m, i) => (
                      <option key={i} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="Enter Year"
                    min="2000"
                    max="2100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Explain the reason for this advance request..."
                    rows="4"
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={loading}
                  onClick={handleSubmitAdvance}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            ) : (
              <div className="access-denied">
                <h3>Access Denied</h3>
                <p>Only accountants can request advances.</p>
              </div>
            )}
          </>
        )}

        {/* View Advances List - Available to ALL roles */}
        {activeTab === 'list' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <h2>Advance Requests</h2>
              <button
                onClick={loadAdvances}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {loading && advances.length === 0 ? (
              <div className="loading">Loading advances...</div>
            ) : (
              <div className="advances-grid">
                {advances.length === 0 ? (
                  <div
                    style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}
                  >
                    No advance requests found.
                  </div>
                ) : (
                  advances.map((advance) => (
                    <div key={advance._id} className="advance-card">
                      <div className="advance-header">
                        <div className="employee-name">
                          {getEmployeeName(advance.employee)}
                        </div>
                        <div className={`status-badge status-${advance.status}`}>
                          {advance.status}
                        </div>
                      </div>

                      <div className="advance-details">
                        <div className="detail-item">
                          <div className="detail-label">Amount</div>
                          <div className="detail-value amount">
                            {formatCurrency(advance.amountRequested)}
                          </div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-label">Request Date</div>
                          <div className="detail-value">
                            {formatDate(advance.createdAt)}
                          </div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-label">Month</div>
                          <div className="detail-value">{advance.month || 'N/A'}</div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-label">Year</div>
                          <div className="detail-value">{advance.year || 'N/A'}</div>
                        </div>
                        {advance.approvalDate && (
                          <div className="detail-item">
                            <div className="detail-label">
                              {advance.status === 'approved' ? 'Approval Date' : 'Decision Date'}
                            </div>
                            <div className="detail-value">
                              {formatDate(advance.approvalDate)}
                            </div>
                          </div>
                        )}
                        {advance.approvedBy && (
                          <div className="detail-item">
                            <div className="detail-label">
                              {advance.status === 'approved' ? 'Approved By' : 'Rejected By'}
                            </div>
                            <div className="detail-value">
                              {advance.approvedBy.firstName} {advance.approvedBy.lastName}
                            </div>
                          </div>
                        )}
                      </div>

                      {advance.reason && (
                        <div className="detail-item" style={{ marginBottom: '15px' }}>
                          <div className="detail-label">Reason</div>
                          <div className="detail-value">{advance.reason}</div>
                        </div>
                      )}

                      {/* Approval/Rejection Actions - ONLY for head teachers on pending requests */}
                      {advance.status === 'pending' && userRole === 'head_teacher' && (
                        <div className="actions">
                          <button
                            onClick={() => handleApprovalAction(advance._id, 'approved')}
                            className="btn btn-success"
                            disabled={loading}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApprovalAction(advance._id, 'rejected')}
                            className="btn btn-danger"
                            disabled={loading}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvanceRequestApp;