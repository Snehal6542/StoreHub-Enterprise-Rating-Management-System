import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'normal'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20-60 characters';
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(formData.password)) {
      newErrors.password = 'Password must be 8-16 characters with uppercase and special character';
    }
    
    if (formData.address.length > 400) {
      newErrors.address = 'Address must be max 400 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await authAPI.register(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onRegister(response.data.user);
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Registration failed' });
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>Register</h2>
      {errors.general && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.general}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Full Name (20-60 characters)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
            required
          />
          {errors.name && <div style={{ color: 'red', fontSize: '12px' }}>{errors.name}</div>}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
            required
          />
          {errors.email && <div style={{ color: 'red', fontSize: '12px' }}>{errors.email}</div>}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Password (8-16 chars, uppercase + special)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
            required
          />
          {errors.password && <div style={{ color: 'red', fontSize: '12px' }}>{errors.password}</div>}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <textarea
            placeholder="Address (max 400 characters)"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={{ width: '100%', padding: '8px', height: '60px' }}
            required
          />
          {errors.address && <div style={{ color: 'red', fontSize: '12px' }}>{errors.address}</div>}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="normal">Customer</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;