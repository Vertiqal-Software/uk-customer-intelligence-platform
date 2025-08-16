import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import apiService from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleKeyEvent = (e) => {
    if (typeof e.getModifierState === 'function') {
      setCapsLockOn(!!e.getModifierState('CapsLock'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await apiService.resetPassword(token, password);
    setLoading(false);

    if (res.success) {
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } else {
      const msg = res.error || 'Reset failed. The link may have expired.';
      setError(msg.includes('Network Error')
        ? 'Network error — check API URL/CORS and backend reachability.'
        : msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">UK</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Set a new password</h1>
            <p className="text-gray-600 mt-2">Choose a strong password you haven’t used before.</p>
          </div>

          {error && (
            <div id="reset-error" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          {done ? (
            <div role="status" aria-live="polite" className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
              Password updated. Redirecting to sign in…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="pw1" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  id="pw1"
                  name="pw1"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={handleKeyEvent}
                  onKeyDown={handleKeyEvent}
                  onMouseUp={handleKeyEvent}
                  aria-errormessage="reset-error"
                  aria-invalid={!!error}
                  disabled={loading}
                />
                {capsLockOn && (
                  <p className="mt-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1" role="status" aria-live="polite">
                    Caps Lock is on.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="pw2" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  id="pw2"
                  name="pw2"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Re-enter your new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  aria-errormessage="reset-error"
                  aria-invalid={!!error}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700">Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
