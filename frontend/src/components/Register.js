import React, { useState } from 'react';
import { authAPI } from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: #000000;
  }

  .register-page {
    min-height: 100vh;
    background: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    position: relative;
    padding: 20px;
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

  .register-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    background: rgba(26, 26, 26, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: none;
    border-radius: 24px;
    padding: 48px 40px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.5);
    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .register-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,0,0,0.4);
    border: none;
    border-radius: 50px;
    padding: 5px 14px;
    font-size: 11px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 20px;
    font-family: 'JetBrains Mono', monospace;
  }

  .register-badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ffffff;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.8); }
  }

  .register-title {
    font-size: 30px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }

  .register-subtitle {
    font-size: 14px;
    color: #aaaaaa;
    font-weight: 400;
    margin-bottom: 36px;
  }

  .register-subtitle a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .register-subtitle a:hover {
    color: #cccccc;
  }

  .error-banner {
    border: none;
    border-radius: 12px;
    padding: 12px 16px;
    color: #fca5a5;
    font-size: 13px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .field-group {
    margin-bottom: 18px;
  }

  .field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #cccccc;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 8px;
    font-family: 'JetBrains Mono', monospace;
  }

  .field-wrap {
    position: relative;
  }

  .field-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    pointer-events: none;
    opacity: 0.6;
  }

  .field-icon.top {
    top: 16px;
    transform: none;
  }

  .register-input,
  .register-textarea,
  .register-select {
    width: 100%;
    background: rgba(0,0,0,0.4);
    border: none;
    border-radius: 12px;
    padding: 12px 14px 12px 42px;
    font-size: 14px;
    font-family: 'Sora', sans-serif;
    color: #ffffff;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
    appearance: none;
  }

  .register-input::placeholder,
  .register-textarea::placeholder {
    color: #888888;
  }

  .register-input:focus,
  .register-textarea:focus,
  .register-select:focus {
    background: rgba(255,255,255,0.05);
    box-shadow: 0 0 15px rgba(255,255,255,0.1);
    outline: none;
  }

  .register-input.has-error,
  .register-textarea.has-error,
  .register-select.has-error {
    border-color: rgba(239,68,68,0.5);
    background: rgba(239,68,68,0.05);
  }

  .register-textarea {
    height: 80px;
    resize: none;
    padding-top: 12px;
  }

  .register-select {
    cursor: pointer;
    color: #ffffff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }

  .register-select option {
    background: #1a1a1a;
    color: #ffffff;
  }

  .field-error {
    margin-top: 6px;
    font-size: 12px;
    color: #f87171;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .char-count {
    text-align: right;
    font-size: 11px;
    color: #475569;
    margin-top: 4px;
    font-family: 'JetBrains Mono', monospace;
  }

  .char-count.warn { color: #f59e0b; }
  .char-count.over { color: #ef4444; }

  .divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 24px 0;
  }

  .submit-btn {
    width: 100%;
    padding: 14px;
    background: #ffffff;
    color: #000000;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    letter-spacing: 0.01em;
  }

  .submit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.05);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .submit-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(255,255,255,0.2);
  }

  .submit-btn:hover::before { opacity: 1; }

  .submit-btn:active { transform: translateY(0); }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .btn-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'normal'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20–60 characters';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(formData.password)) {
      newErrors.password = 'Password must be 8–16 characters with uppercase & special character';
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

    setLoading(true);
    try {
      const response = await authAPI.register(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onRegister(response.data.user);
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const addrLen = formData.address.length;
  const addrClass = addrLen > 380 ? 'char-count over' : addrLen > 300 ? 'char-count warn' : 'char-count';

  return (
    <>
      <style>{styles}</style>
      <div className="register-page">
        <div className="bg-animation"></div>
        <div className="register-card">

          <div className="register-badge">
            <span className="dot" />
            New Account
          </div>

          <h1 className="register-title">Create your account</h1>
          <p className="register-subtitle">
            Already have one? <a href="/login">Sign in here</a>
          </p>

          {errors.general && (
            <div className="error-banner">
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="field-group">
              <label className="field-label">Full Name</label>
              <div className="field-wrap">
                <span className="field-icon">👤</span>
                <input
                  type="text"
                  className={`register-input${errors.name ? ' has-error' : ''}`}
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  required
                />
              </div>
              {errors.name
                ? <div className="field-error">⚠ {errors.name}</div>
                : <div className="char-count">{formData.name.length} / 60 chars (min 20)</div>
              }
            </div>

            {/* Email */}
            <div className="field-group">
              <label className="field-label">Email Address</label>
              <div className="field-wrap">
                <span className="field-icon">✉️</span>
                <input
                  type="email"
                  className={`register-input${errors.email ? ' has-error' : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  required
                />
              </div>
              {errors.email && <div className="field-error">⚠ {errors.email}</div>}
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <span className="field-icon">🔒</span>
                <input
                  type="password"
                  className={`register-input${errors.password ? ' has-error' : ''}`}
                  placeholder="8–16 chars, 1 uppercase, 1 special"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  required
                />
              </div>
              {errors.password && <div className="field-error">⚠ {errors.password}</div>}
            </div>

            {/* Address */}
            <div className="field-group">
              <label className="field-label">Address</label>
              <div className="field-wrap">
                <span className="field-icon top">📍</span>
                <textarea
                  className={`register-textarea${errors.address ? ' has-error' : ''}`}
                  placeholder="Your full address"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  required
                  style={{ paddingLeft: '42px' }}
                />
              </div>
              {errors.address
                ? <div className="field-error">⚠ {errors.address}</div>
                : <div className={addrClass}>{addrLen} / 400</div>
              }
            </div>

            {/* Role */}
            <div className="field-group">
              <label className="field-label">Account Type</label>
              <div className="field-wrap">
                <span className="field-icon">🏷️</span>
                <select
                  className="register-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="normal">Customer</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </div>
            </div>

            <div className="divider" />

            <button type="submit" className="submit-btn" disabled={loading}>
              <span className="btn-inner">
                {loading ? (
                  <>
                    <span className="spinner" />
                    Creating account…
                  </>
                ) : (
                  <>Create Account →</>
                )}
              </span>
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default Register;