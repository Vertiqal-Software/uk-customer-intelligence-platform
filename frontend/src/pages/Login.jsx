import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    email: 'test@example.com',
    password: 'SecurePass123',
    first_name: '',
    last_name: '',
    company_name: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const navigate = useNavigate();
  const { refreshUser } = useAuth(); // used to sync context before navigate

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await apiService.login(formData.email, formData.password);
      } else {
        result = await apiService.register(formData);
      }

      if (result.success) {
        const { access_token, user } = result.data || {};
        if (access_token && user) {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('user', JSON.stringify(user));
          await refreshUser();
          navigate('/dashboard', { replace: true });
        } else {
          setError('Invalid login response from server.');
        }
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const togglePasswordVisibility = () => setPasswordVisible((v) => !v);

  const handlePasswordKeyEvent = (e) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockOn(!!e.getModifierState('CapsLock'));
    }
  };

  const noop = (e) => e.preventDefault();

  const errorProps = error
    ? { 'aria-invalid': 'true', 'aria-errormessage': 'form-error' }
    : {};

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">UK</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">UK Customer Intelligence</h1>
            <p className="text-gray-600 mt-2">The ultimate single pane of glass for customer intelligence</p>
          </div>

          {/* Auth mode switch */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(true)}
              disabled={loading}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(false)}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>

          {/* Enterprise SSO / Social sign-in placeholders */}
          <div className="space-y-3 mb-6">
            <button
              onClick={noop}
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
              aria-label="Sign in with Microsoft"
            >
              <span aria-hidden="true" className="h-2.5 w-2.5 bg-[#F25022] inline-block"></span>
              <span aria-hidden="true" className="h-2.5 w-2.5 bg-[#7FBA00] inline-block"></span>
              <span aria-hidden="true" className="h-2.5 w-2.5 bg-[#00A4EF] inline-block"></span>
              <span aria-hidden="true" className="h-2.5 w-2.5 bg-[#FFB900] inline-block"></span>
              <span className="ml-1">Sign in with Microsoft</span>
            </button>

            <button
              onClick={noop}
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
              aria-label="Enterprise SSO"
            >
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden="true"></span>
              <span>Enterprise SSO</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-400">or</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Error announcement region for a11y */}
            {error && (
              <div
                id="form-error"
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                {...errorProps}
              />
            </div>

            {/* Password with show/hide + CapsLock */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                {isLogin && (
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="appearance-none relative block w-full pr-24 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyUp={handlePasswordKeyEvent}
                  onKeyDown={handlePasswordKeyEvent}
                  onMouseUp={handlePasswordKeyEvent}
                  disabled={loading}
                  {...errorProps}
                />

                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                  aria-pressed={passwordVisible}
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {passwordVisible ? 'Hide' : 'Show'}
                </button>
              </div>

              {capsLockOn && (
                <p className="mt-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1" role="status" aria-live="polite">
                  Caps Lock is on.
                </p>
              )}
            </div>

            {/* Sign-up only fields */}
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      required
                      autoComplete="given-name"
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="First name"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={loading}
                      {...errorProps}
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      required
                      autoComplete="family-name"
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Last name"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={loading}
                      {...errorProps}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    required
                    autoComplete="organization"
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your company name"
                    value={formData.company_name}
                    onChange={handleChange}
                    disabled={loading}
                    {...errorProps}
                  />
                </div>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Demo creds panel */}
          {isLogin && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
              <p className="text-xs text-blue-700">Email: test@example.com</p>
              <p className="text-xs text-blue-700">Password: SecurePass123</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              <br />
              GDPR Compliant • UK Data Protection Act 2018
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
