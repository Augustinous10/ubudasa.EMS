import React, { useState, useCallback, useEffect } from 'react';
import './students.css'; // Pure CSS import
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign,
  BookOpen,
  Phone,
  User,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Save,
  RefreshCw
} from 'lucide-react';

// Mock API service
const API_BASE_URL = 'http://localhost:5000/api';

const apiService = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  async put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  }
};

// Statistics Dashboard Component
const StatsDashboard = ({ summary }) => {
  const stats = [
    {
      title: 'Total Students',
      value: summary?.totalStudents || 0,
      icon: Users,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Paid Students',
      value: summary?.paidStudents || 0,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Unpaid Students',
      value: summary?.unpaidStudents || 0,
      icon: AlertCircle,
      color: 'text-red-600 bg-red-100'
    },
    {
      title: 'Partial Payments',
      value: summary?.partialStudents || 0,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Total Fees',
      value: `$${summary?.totalFees?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Total Paid',
      value: `$${summary?.totalPaid?.toLocaleString() || 0}`,
      icon: TrendingUp,
      color: 'text-indigo-600 bg-indigo-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Student Form Component
const StudentForm = ({ student, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    studentCode: '',
    classLevel: '',
    term: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    previousSchool: '',
    medicalInfo: '',
    emergencyContact: '',
    customFees: '',
    ...student
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.studentCode?.trim()) newErrors.studentCode = 'Student code is required';
    if (!formData.classLevel?.trim()) newErrors.classLevel = 'Class level is required';
    if (!formData.term?.trim()) newErrors.term = 'Term is required';
    
    if (formData.guardianPhone && !/^\+?[\d\s-()]{10,}$/.test(formData.guardianPhone)) {
      newErrors.guardianPhone = 'Invalid phone number format';
    }
    
    if (formData.guardianEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guardianEmail)) {
      newErrors.guardianEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {student ? 'Edit Student' : 'Add New Student'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Code *
                </label>
                <input
                  type="text"
                  name="studentCode"
                  value={formData.studentCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.studentCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter student code"
                />
                {errors.studentCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.studentCode}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Level *
                  </label>
                  <select
                    name="classLevel"
                    value={formData.classLevel}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.classLevel ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select class</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                  </select>
                  {errors.classLevel && (
                    <p className="text-red-500 text-sm mt-1">{errors.classLevel}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Term *
                  </label>
                  <select
                    name="term"
                    value={formData.term}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.term ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select term</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                  {errors.term && (
                    <p className="text-red-500 text-sm mt-1">{errors.term}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Guardian Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guardian Name
                </label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter guardian name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guardian Phone
                </label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.guardianPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter guardian phone"
                />
                {errors.guardianPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.guardianPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guardian Email
                </label>
                <input
                  type="email"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.guardianEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter guardian email"
                />
                {errors.guardianEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.guardianEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter emergency contact"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous School
                </label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter previous school"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Fees
                </label>
                <input
                  type="number"
                  name="customFees"
                  value={formData.customFees}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter custom fees amount"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Information
              </label>
              <textarea
                name="medicalInfo"
                value={formData.medicalInfo}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter medical information"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Student Card Component
const StudentCard = ({ student, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{student.fullName}</h3>
          <p className="text-gray-600">{student.studentCode}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.paymentStatus)}`}>
          {student.paymentStatus}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <BookOpen className="h-4 w-4 mr-2" />
          <span>{student.classLevel} - {student.term}</span>
        </div>
        
        {student.guardianName && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>{student.guardianName}</span>
          </div>
        )}
        
        {student.guardianPhone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{student.guardianPhone}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="h-4 w-4 mr-2" />
          <span>${student.feesPaid} / ${student.totalFees}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Payment Progress</span>
          <span>{student.paymentPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${student.paymentPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onView(student)}
          className="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </button>
        <button
          onClick={() => onEdit(student)}
          className="flex-1 px-3 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors flex items-center justify-center space-x-1"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(student)}
          className="flex-1 px-3 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center space-x-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

// Student Detail Modal
const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900">{student.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Code</label>
                <p className="text-gray-900">{student.studentCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Level</label>
                <p className="text-gray-900">{student.classLevel}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Term</label>
                <p className="text-gray-900">{student.term}</p>
              </div>
              {student.dateOfBirth && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="text-gray-900">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                </div>
              )}
              {student.gender && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <p className="text-gray-900">{student.gender}</p>
                </div>
              )}
            </div>
          </div>

          {/* Guardian Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.guardianName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
                  <p className="text-gray-900">{student.guardianName}</p>
                </div>
              )}
              {student.guardianPhone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Guardian Phone</label>
                  <p className="text-gray-900">{student.guardianPhone}</p>
                </div>
              )}
              {student.guardianEmail && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Guardian Email</label>
                  <p className="text-gray-900">{student.guardianEmail}</p>
                </div>
              )}
              {student.address && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="text-gray-900">{student.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fee Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Fees</label>
                <p className="text-gray-900 text-lg font-semibold">${student.totalFees}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fees Paid</label>
                <p className="text-gray-900 text-lg font-semibold">${student.feesPaid}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Outstanding</label>
                <p className="text-gray-900 text-lg font-semibold">${student.outstandingFees}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Payment Progress</span>
                <span>{student.paymentPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${student.paymentPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(student.previousSchool || student.medicalInfo || student.emergencyContact) && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                {student.previousSchool && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Previous School</label>
                    <p className="text-gray-900">{student.previousSchool}</p>
                  </div>
                )}
                {student.emergencyContact && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                    <p className="text-gray-900">{student.emergencyContact}</p>
                  </div>
                )}
                {student.medicalInfo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Medical Information</label>
                    <p className="text-gray-900">{student.medicalInfo}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const StudentManagementApp = () => {
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    classLevel: '',
    term: '',
    status: '',
    page: 1,
    limit: 12
  });
  
  const [showFilters, setShowFilters] = useState(false);

// Fetch students
const fetchStudents = useCallback(async (newFilters = filters) => {
  setLoading(true);
  setError(null);

  try {
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await apiService.get(`/students?${queryParams.toString()}`);
    setStudents(response.students || []);
    setSummary(response.summary);
    setPagination(response.pagination);
  } catch (err) {
    setError('Failed to fetch students');
    console.error('Error fetching students:', err);
  } finally {
    setLoading(false);
  }
}, [filters]); // Include filters here as dependency if used inside

// Load initial data or whenever fetchStudents changes
useEffect(() => {
  fetchStudents();
}, [fetchStudents]);
  // Handle search
  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(newFilters);
    fetchStudents(newFilters);
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value, page: 1 };
    setFilters(newFilters);
    fetchStudents(newFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchStudents(newFilters);
  };

  // Handle student creation
  const handleCreateStudent = async (studentData) => {
    try {
      await apiService.post('/students', studentData);
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      console.error('Error creating student:', err);
      throw err;
    }
  };

  // Handle student update
  const handleUpdateStudent = async (studentData) => {
    try {
      await apiService.put(`/students/${editingStudent._id}`, studentData);
      setShowForm(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      console.error('Error updating student:', err);
      throw err;
    }
  };

  // Handle student deletion
  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.fullName}?`)) {
      try {
        await apiService.delete(`/students/${student._id}`);
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        setError('Failed to delete student');
      }
    }
  };

  // Handle edit
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  // Handle view
  const handleViewStudent = (student) => {
    setViewingStudent(student);
  };

  // Clear filters
  const clearFilters = () => {
    const newFilters = {
      search: '',
      classLevel: '',
      term: '',
      status: '',
      page: 1,
      limit: 12
    };
    setFilters(newFilters);
    fetchStudents(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Student Management System</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Student</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Dashboard */}
        <StatsDashboard summary={summary} />

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
              
              {(filters.classLevel || filters.term || filters.status) && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Level
                  </label>
                  <select
                    value={filters.classLevel}
                    onChange={(e) => handleFilterChange('classLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Classes</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Term
                  </label>
                  <select
                    value={filters.term}
                    onChange={(e) => handleFilterChange('term', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Terms</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Students Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading students...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">
              {filters.search || filters.classLevel || filters.term || filters.status
                ? 'Try adjusting your filters'
                : 'Get started by adding your first student'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {students.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                onView={handleViewStudent}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages)].map((_, index) => {
                const page = index + 1;
                const isActive = page === pagination.currentPage;
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <StudentForm
          student={editingStudent}
          onSave={editingStudent ? handleUpdateStudent : handleCreateStudent}
          onCancel={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
        />
      )}

      {viewingStudent && (
        <StudentDetailModal
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentManagementApp;