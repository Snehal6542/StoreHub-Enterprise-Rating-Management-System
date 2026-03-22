import React, { useState } from 'react';
import { authAPI } from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: #000000;
  }

  .login-page {
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

  .login-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
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

  .login-badge {
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

  .login-badge .dot {
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

  .login-title {
    font-size: 30px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }

  .login-subtitle {
    font-size: 14px;
    color: #aaaaaa;
    font-weight: 400;
    margin-bottom: 36px;
  }

  .login-subtitle a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .login-subtitle a:hover {
    color: #cccccc;
  }

  .error-banner {
    background: rgba(239,68,68,0.15);
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

  .login-input {
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

  .login-input::placeholder {
    color: #888888;
  }

  .login-input:focus {
    background: rgba(255,255,255,0.05);
    box-shadow: 0 0 15px rgba(255,255,255,0.1);
    outline: none;
  }

  .login-input.has-error {
    border-color: rgba(239,68,68,0.5);
    background: rgba(239,68,68,0.05);
  }

  .forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 6px;
  }

  .forgot-link {
    font-size: 12px;
    color: #aaaaaa;
    text-decoration: none;
    font-family: 'JetBrains Mono', monospace;
    transition: color 0.2s;
  }

  .forgot-link:hover {
    color: #ffffff;
  }

  .divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 28px 0;
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

  .register-prompt {
    text-align: center;
    margin-top: 24px;
    font-size: 13px;
    color: #475569;
  }

  .register-prompt a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }

  .register-prompt a:hover {
    color: #cccccc;
  }
`;

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">
        <div className="bg-animation"></div>
        <div className="login-card">

          <div className="login-badge">
            <span className="dot" />
            Welcome Back
          </div>

          <h1 className="login-title">Sign in to your account</h1>
          <p className="login-subtitle">
            Don't have one? <a href="/register">Create account</a>
          </p>

          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="field-group">
              <label className="field-label">Email Address</label>
              <div className="field-wrap">
                <span className="field-icon">✉️</span>
                <input
                  type="email"
                  className={`login-input${error ? ' has-error' : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (error) setError('');
                  }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <span className="field-icon">🔒</span>
                <input
                  type="password"
                  className={`login-input${error ? ' has-error' : ''}`}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (error) setError('');
                  }}
                  required
                />
              </div>
              <div className="forgot-row">
                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
              </div>
            </div>

            <div className="divider" />

            <button type="submit" className="submit-btn" disabled={loading}>
              <span className="btn-inner">
                {loading ? (
                  <>
                    <span className="spinner" />
                    Signing in…
                  </>
                ) : (
                  <>Sign In →</>
                )}
              </span>
            </button>

          </form>

          <p className="register-prompt">
            New here? <a href="/register">Create a free account</a>
          </p>

        </div>
      </div>
    </>
  );
};

export default Login;