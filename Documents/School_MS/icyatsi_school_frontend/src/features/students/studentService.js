// Student API Service
// This service handles all API calls to the student management backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class StudentApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Helper method to get authorization headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Helper method to build query string from params
  buildQueryString(params) {
    const filtered = Object.entries(params)
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    return filtered ? `?${filtered}` : '';
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // CREATE STUDENT
  async createStudent(studentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(studentData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  // GET ALL STUDENTS with pagination and filtering
  async getAllStudents(params = {}) {
    try {
      const queryString = this.buildQueryString(params);
      const response = await fetch(`${API_BASE_URL}/students${queryString}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  // GET STUDENT BY ID
  async getStudentById(id, includePayments = false) {
    try {
      const queryString = includePayments ? '?includePayments=true' : '';
      const response = await fetch(`${API_BASE_URL}/students/${id}${queryString}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  // UPDATE STUDENT
  async updateStudent(id, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  // DELETE STUDENT
  async deleteStudent(id, force = false) {
    try {
      const queryString = force ? '?force=true' : '';
      const response = await fetch(`${API_BASE_URL}/students/${id}${queryString}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  // BULK OPERATIONS
  async bulkOperations(operationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/bulk`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(operationData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      throw error;
    }
  }

  // GET STUDENT STATISTICS
  async getStudentStatistics(params = {}) {
    try {
      const queryString = this.buildQueryString(params);
      const response = await fetch(`${API_BASE_URL}/students/statistics${queryString}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching student statistics:', error);
      throw error;
    }
  }

  // SEARCH STUDENTS
  async searchStudents(searchParams = {}) {
    try {
      const queryString = this.buildQueryString(searchParams);
      const response = await fetch(`${API_BASE_URL}/students/search${queryString}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error searching students:', error);
      throw error;
    }
  }

  // PROMOTE STUDENTS
  async promoteStudents(promotionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/promote`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(promotionData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error promoting students:', error);
      throw error;
    }
  }

  // EXPORT STUDENTS DATA
  async exportStudents(format = 'csv', params = {}) {
    try {
      const queryString = this.buildQueryString({ ...params, format });
      const response = await fetch(`${API_BASE_URL}/students/export${queryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }
      
      return response.blob();
    } catch (error) {
      console.error('Error exporting students:', error);
      throw error;
    }
  }

  // IMPORT STUDENTS DATA
  async importStudents(file, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add import options
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(`${API_BASE_URL}/students/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error importing students:', error);
      throw error;
    }
  }

  // ADVANCED FILTERING METHODS
  async getStudentsByClass(classLevel, params = {}) {
    return this.getAllStudents({ ...params, classLevel });
  }

  async getStudentsByTerm(term, params = {}) {
    return this.getAllStudents({ ...params, term });
  }

  async getStudentsByPaymentStatus(status, params = {}) {
    return this.getAllStudents({ ...params, status });
  }

  async getOverdueStudents(params = {}) {
    return this.getAllStudents({ ...params, status: 'overdue' });
  }

  // UTILITY METHODS
  async validateStudentCode(studentCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/validate-code`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ studentCode })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error validating student code:', error);
      throw error;
    }
  }

  async getDuplicateStudents(params = {}) {
    try {
      const queryString = this.buildQueryString(params);
      const response = await fetch(`${API_BASE_URL}/students/duplicates${queryString}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching duplicate students:', error);
      throw error;
    }
  }

  // BATCH OPERATIONS
  async batchCreateStudents(studentsData) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/batch`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ students: studentsData })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error batch creating students:', error);
      throw error;
    }
  }

  async batchUpdateStudents(updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/batch-update`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ updates })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error batch updating students:', error);
      throw error;
    }
  }

  // REPORTING METHODS
  async getStudentReport(reportType, params = {}) {
    try {
      const queryString = this.buildQueryString({ ...params, type: reportType });
      const response = await fetch(`${API_BASE_URL}/students/report${queryString}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error generating student report:', error);
      throw error;
    }
  }

  async getClassSummary(classLevel, term) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/class-summary`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ classLevel, term })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching class summary:', error);
      throw error;
    }
  }

  // PAYMENT RELATED METHODS
  async getPaymentSummary(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/payment-summary`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      throw error;
    }
  }

  async getOutstandingFees(params = {}) {
    try {
      const queryString = this.buildQueryString(params);
      const response = await fetch(`${API_BASE_URL}/students/outstanding-fees${queryString}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching outstanding fees:', error);
      throw error;
    }
  }

  // ANALYTICS METHODS
  async getEnrollmentTrends(params = {}) {
    try {
      const queryString = this.buildQueryString(params);
      const response = await fetch(`${API_BASE_URL}/students/enrollment-trends${queryString}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching enrollment trends:', error);
      throw error;
    }
  }

  async getPaymentAnalytics(params = {}) {
    try {
      const queryString = this.buildQueryString(params);
      const response = await fetch(`${API_BASE_URL}/students/payment-analytics${queryString}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching payment analytics:', error);
      throw error;
    }
  }

  // ARCHIVE AND RESTORE METHODS
  async archiveStudent(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}/archive`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error archiving student:', error);
      throw error;
    }
  }

  async restoreStudent(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}/restore`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error restoring student:', error);
      throw error;
    }
  }

  async getArchivedStudents(params = {}) {
    try {
      const queryString = this.buildQueryString(params);
      const response = await fetch(`${API_BASE_URL}/students/archived${queryString}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching archived students:', error);
      throw error;
    }
  }

  // COMMUNICATION METHODS
  async sendBulkNotification(studentIds, message, type = 'email') {
    try {
      const response = await fetch(`${API_BASE_URL}/students/notify`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ studentIds, message, type })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      throw error;
    }
  }

  async sendFeeReminder(studentIds, reminderType = 'overdue') {
    try {
      const response = await fetch(`${API_BASE_URL}/students/fee-reminder`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ studentIds, reminderType })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error sending fee reminder:', error);
      throw error;
    }
  }

  // CONFIGURATION METHODS
  async getClassLevels() {
    try {
      const response = await fetch(`${API_BASE_URL}/students/class-levels`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching class levels:', error);
      throw error;
    }
  }

  async getTerms() {
    try {
      const response = await fetch(`${API_BASE_URL}/students/terms`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching terms:', error);
      throw error;
    }
  }

  // ERROR HANDLING UTILITY
  handleApiError(error) {
    if (error.message.includes('401')) {
      // Token expired or invalid
      this.setToken(null);
      window.location.href = '/login';
      return;
    }
    
    // Return formatted error message
    return {
      message: error.message || 'An unexpected error occurred',
      status: error.status || 500,
      timestamp: new Date().toISOString()
    };
  }

  // HELPER METHODS FOR COMMON OPERATIONS
  formatStudentData(student) {
    return {
      ...student,
      fullName: student.fullName?.trim(),
      studentCode: student.studentCode?.toUpperCase(),
      classLevel: student.classLevel?.trim(),
      term: student.term?.trim(),
      guardianName: student.guardianName?.trim(),
      guardianPhone: student.guardianPhone?.trim(),
      guardianEmail: student.guardianEmail?.trim()?.toLowerCase(),
      outstandingFees: student.totalFees - student.feesPaid,
      paymentPercentage: student.totalFees > 0 ? 
        ((student.feesPaid / student.totalFees) * 100).toFixed(2) : 0
    };
  }

  calculatePaymentStatus(student) {
    if (student.feesPaid >= student.totalFees) {
      return 'paid';
    } else if (student.feesPaid > 0) {
      return 'partial';
    } else {
      return 'unpaid';
    }
  }

  validateStudentData(studentData) {
    const errors = [];
    
    if (!studentData.fullName || studentData.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }
    
    if (!studentData.studentCode || studentData.studentCode.trim().length < 3) {
      errors.push('Student code must be at least 3 characters long');
    }
    
    if (!studentData.classLevel) {
      errors.push('Class level is required');
    }
    
    if (!studentData.term) {
      errors.push('Term is required');
    }
    
    if (studentData.guardianPhone && !/^\+?[\d\s-()]{10,}$/.test(studentData.guardianPhone)) {
      errors.push('Invalid guardian phone number format');
    }
    
    if (studentData.guardianEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.guardianEmail)) {
      errors.push('Invalid guardian email format');
    }
    
    return errors;
  }
}

// Create and export a singleton instance
export const studentApi = new StudentApiService();

// Export the class for custom instances if needed
export { StudentApiService };

// Export common constants
export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
  GRADUATED: 'graduated'
};

export const PAYMENT_STATUS = {
  PAID: 'paid',
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  OVERDUE: 'overdue'
};

export const SORT_OPTIONS = {
  NAME_ASC: { sortBy: 'fullName', sortOrder: 'asc' },
  NAME_DESC: { sortBy: 'fullName', sortOrder: 'desc' },
  CODE_ASC: { sortBy: 'studentCode', sortOrder: 'asc' },
  CODE_DESC: { sortBy: 'studentCode', sortOrder: 'desc' },
  DATE_ASC: { sortBy: 'createdAt', sortOrder: 'asc' },
  DATE_DESC: { sortBy: 'createdAt', sortOrder: 'desc' },
  FEES_ASC: { sortBy: 'totalFees', sortOrder: 'asc' },
  FEES_DESC: { sortBy: 'totalFees', sortOrder: 'desc' }
};