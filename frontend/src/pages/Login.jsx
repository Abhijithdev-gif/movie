import React, { useState } from 'react';
import { Film, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      if (isLoginTab) {
        const res = await loginUser(username, password);
        onLoginSuccess(res.user);
      } else {
        const res = await registerUser(username, password, email);
        onLoginSuccess(res.user);
      }
    } catch (err) {
      const data = err.response?.data;
      let errMsg = 'Authentication failed. Please check your credentials.';

      if (typeof data === 'string') {
        errMsg = data;
      } else if (data?.detail) {
        errMsg = data.detail;
      } else if (data?.username) {
        errMsg = Array.isArray(data.username) ? data.username[0] : data.username;
      } else if (data?.password) {
        errMsg = Array.isArray(data.password) ? data.password[0] : data.password;
      } else if (data?.non_field_errors) {
        errMsg = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
      } else if (err.message) {
        errMsg = err.message;
      }

      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Try logging in with demo user or registering it if missing
      try {
        const res = await loginUser('demouser', 'demo1234');
        onLoginSuccess(res.user);
      } catch {
        const res = await registerUser('demouser', 'demo1234', 'demo@watchlist.app');
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError('Demo login failed. Please register manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon" style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }}>
            <Film size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Movie Watchlist</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            {isLoginTab ? 'Sign in to access your collection' : 'Create an account to track movies'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`}
            onClick={() => { setIsLoginTab(true); setError(''); }}
          >
            <LogIn size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Sign In
          </button>
          <button
            className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`}
            onClick={() => { setIsLoginTab(false); setError(''); }}
          >
            <UserPlus size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Register
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {!isLoginTab && (
            <div className="form-group">
              <label className="form-label">Email Address (Optional)</label>
              <input
                type="email"
                className="form-input"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }} disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : isLoginTab ? (
              <>
                <LogIn size={18} /> Sign In
              </>
            ) : (
              <>
                <UserPlus size={18} /> Create Account
              </>
            )}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0 1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <Sparkles size={16} color="#fbbf24" /> Quick Demo Account Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
