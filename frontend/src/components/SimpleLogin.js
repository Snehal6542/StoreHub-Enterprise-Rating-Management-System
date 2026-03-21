import React, { useState } from 'react';

const SimpleLogin = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'normal'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? 
      { email: formData.email, password: formData.password } : 
      formData;
    
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          onLogin(data.user, data.token);
        } else {
          alert('Registration successful!');
          setIsLogin(true);
        }
      } else {
        alert(`${isLogin ? 'Login' : 'Registration'} failed: ${data.message || data.errors?.[0]?.msg}`);
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '28px'
        }}>
          {isLogin ? 'Login' : 'Register'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name (20-60 chars)"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="text"
                name="address"
                placeholder="Address (optional)"
                value={formData.address}
                onChange={handleChange}
                style={inputStyle}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="normal">Customer</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </>
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password (8-16 chars, uppercase + special)"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'transform 0.2s'
          }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: '#667eea', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
        
        {isLogin && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
              <strong>Test Account:</strong><br/>
              Email: admin@system.com<br/>
              Password: Admin123!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  margin: '10px 0',
  border: '2px solid #e1e5e9',
  borderRadius: '5px',
  fontSize: '16px',
  boxSizing: 'border-box',
  transition: 'border-color 0.3s',
  outline: 'none'
};

export default SimpleLogin;