import React, { useState } from 'react';

const styles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    background: #000000;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in {
    animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .input-glow {
    transition: all 0.3s ease;
  }
  .input-glow:focus {
    box-shadow: 0 0 15px rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05) !important;
  }
  .btn-hover {
    transition: all 0.3s ease;
  }
  .btn-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255,255,255,0.15);
  }
  .login-container {
    position: relative;
  }
  .bg-animation {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 0;
    background: 
      radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.05), transparent 40%),
      radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.04), transparent 40%),
      radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.03), transparent 40%);
    animation: pulseBg 15s ease-in-out infinite alternate;
    pointer-events: none;
  }
  @keyframes pulseBg {
    0% { transform: scale(1) translate(0px, 0px); }
    100% { transform: scale(1.1) translate(20px, -20px); }
  }
  .glass-panel {
    background: rgba(26, 26, 26, 0.6) !important;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: none !important;
    box-shadow: 0 15px 35px rgba(0,0,0,0.5) !important;
  }
`;

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
    <>
      <style>{styles}</style>
      <div className="login-container" style={{ minHeight: '100vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
        <div className="bg-animation"></div>
        <div className="fade-in glass-panel" style={{ position: 'relative', zIndex: 1, padding: '40px', borderRadius: '15px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#ffffff',
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
                className="input-glow"
                required
                style={inputStyle}
              />
              <input
                type="text"
                name="address"
                placeholder="Address (optional)"
                value={formData.address}
                onChange={handleChange}
                className="input-glow"
                style={inputStyle}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-glow"
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
            className="input-glow"
            required
            style={inputStyle}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password (8-16 chars, uppercase + special)"
            value={formData.password}
            onChange={handleChange}
            className="input-glow"
            required
            style={inputStyle}
          />
          
          <button type="submit" className="btn-hover" style={{
            width: '100%',
            padding: '12px',
            background: '#ffffff',
            color: '#000000',
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
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#aaaaaa' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: '#ffffff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
        
        {isLogin && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#2a2a2a', borderRadius: '5px' }}>
            <p style={{ margin: '0', fontSize: '14px', color: '#cccccc' }}>
              <strong style={{ color: '#ffffff' }}>Test Account:</strong><br/>
              Email: admin@system.com<br/>
              Password: Admin123!
            </p>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  margin: '10px 0',
  border: 'none',
  background: 'rgba(0, 0, 0, 0.4)',
  color: '#ffffff',
  borderRadius: '5px',
  fontSize: '16px',
  boxSizing: 'border-box',
  transition: 'border-color 0.3s',
  outline: 'none'
};

export default SimpleLogin;