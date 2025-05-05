import { useState } from 'react';
import './employee-form.css';
const EmployeeForm = ({ employee, onSubmit }) => {
  const initialState = employee ? { ...employee } : {
    firstName: '',
    lastName: '',
    position: '',
    phoneNumber: '',
    email: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: '',
    department: '',
    profileImage: null
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const departments = [
    'Interior Design',
    '3D Wall Design',
    'Exterior Painting',
    'Kitchen & Bath',
    'Modern Ceilings',
    'Administration'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Enter a valid phone number';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (!formData.hireDate) {
      newErrors.hireDate = 'Hire date is required';
    }
    
    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a positive number';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'salary' ? (value ? Number(value) : '') : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      await onSubmit(formData);
      setLoading(false);
      
      if (!employee) {
        // Reset form if this is a new employee creation
        setFormData(initialState);
      }
    } catch (err) {
      setLoading(false);
      console.error('Error submitting employee form:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? 'input-error' : ''}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? 'input-error' : ''}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="position">Position *</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={errors.position ? 'input-error' : ''}
          />
          {errors.position && <span className="error-message">{errors.position}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={errors.department ? 'input-error' : ''}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <span className="error-message">{errors.department}</span>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number *</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+250 700000000"
            className={errors.phoneNumber ? 'input-error' : ''}
          />
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="hireDate">Hire Date *</label>
          <input
            type="date"
            id="hireDate"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            className={errors.hireDate ? 'input-error' : ''}
          />
          {errors.hireDate && <span className="error-message">{errors.hireDate}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="salary">Salary (RWF) *</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className={errors.salary ? 'input-error' : ''}
          />
          {errors.salary && <span className="error-message">{errors.salary}</span>}
        </div>
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;