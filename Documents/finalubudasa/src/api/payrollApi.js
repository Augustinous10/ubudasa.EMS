import axios from 'axios';

// Base URL for the payroll API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/payroll';

const payrollApi = {
  /**
   * Fetch unpaid employees based on filters
   * Expects backend response: { unpaidEmployees: [...] }
   * @param {Object} filters - { siteManagerId, startDate, endDate }
   * @returns {Promise<Object[]>} Array of unpaid employee data
   */
  fetchUnpaid: async (filters) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/unpaid`, filters);
      // Return just the unpaidEmployees array from response.data
      return response.data.unpaidEmployees || [];
    } catch (error) {
      console.error('Error fetching unpaid employees:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Fetch payment history based on filters
   * Expects backend response: { paymentHistory: [...] }
   * @param {Object} filters - { siteManagerId, startDate, endDate }
   * @returns {Promise<Object[]>} Array of payment history records
   */
  fetchHistory: async (filters) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/history`, filters);
      // Return just the paymentHistory array from response.data
      return response.data.paymentHistory || [];
    } catch (error) {
      console.error('Error fetching payment history:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Mark selected employee payments as paid
   * Expects backend response: { message: string, records: [...] }
   * @param {Array} payments - List of payment objects to mark as paid
   * @returns {Promise<Object>} Confirmation message and updated payment records
   */
  markAsPaid: async (payments) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/mark-paid`, { payments });
      return response.data; // { message, records }
    } catch (error) {
      console.error('Error marking payments as paid:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default payrollApi;
