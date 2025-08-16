import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import existing components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompanyDetail from './pages/CompanyDetail';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import UserManagement from './pages/UserManagement';
import { AuthProvider, useAuth } from './hooks/useAuth';

// NEW: password reset pages
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// NEW: CRM pages
import Prospects from './pages/Prospects';
import Pipeline from './pages/Pipeline';
import Integrations from './pages/Integrations';

// NEW: Common providers/components
import { ToastProvider } from './components/Common/ToastProvider';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// API Service Class (preserved from original)
class ApiService {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    const response = await axios.post('/api/auth/login', { email, password });
    return { success: true, data: response.data };
  }

  async register(userData) {
    const response = await axios.post('/api/auth/register', userData);
    return { success: true, data: response.data };
  }

  async getCurrentUser() {
    const response = await axios.get('/api/auth/me');
    return { success: true, data: response.data };
  }

  async searchCompanies(query) {
    const response = await axios.get(`/api/companies/search?q=${encodeURIComponent(query)}`);
    return { success: true, data: response.data };
  }

  async getCompanyDetails(companyNumber) {
    const response = await axios.get(`/api/companies/${companyNumber}`);
    return { success: true, data: response.data };
  }

  async addToMonitoring(companyNumber) {
    const response = await axios.post(`/api/companies/${companyNumber}/monitor`);
    return { success: true, data: response.data };
  }

  async removeFromMonitoring(companyNumber) {
    const response = await axios.delete(`/api/companies/${companyNumber}/monitor`);
    return { success: true, data: response.data };
  }

  async getMonitoredCompanies() {
    const response = await axios.get('/api/companies/monitored');
    return { success: true, data: response.data };
  }

  async getDashboardData() {
    const response = await axios.get('/api/dashboard');
    return { success: true, data: response.data };
  }

  async getAlerts(page = 1) {
    const response = await axios.get(`/api/alerts?page=${page}`);
    return { success: true, data: response.data };
  }

  async markAlertRead(alertId) {
    const response = await axios.post(`/api/alerts/${alertId}/read`);
    return { success: true, data: response.data };
  }

  async updateUserPreferences(preferences) {
    // TODO: Implement in backend
    return { success: true, data: {} };
  }

  async getUserPreferences() {
    // TODO: Implement in backend
    return { success: true, data: {} };
  }
}

const apiService = new ApiService();

// Make apiService available globally for other components
window.apiService = apiService;

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/company/:companyNumber"
                element={
                  <ProtectedRoute>
                    <CompanyDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Admin-only routes */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UserManagement />
                  </ProtectedRoute>
                }
              />

              {/* NEW: CRM routes */}
              <Route
                path="/prospects"
                element={
                  <ProtectedRoute>
                    <Prospects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pipeline"
                element={
                  <ProtectedRoute>
                    <Pipeline />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/integrations"
                element={
                  <ProtectedRoute>
                    <Integrations />
                  </ProtectedRoute>
                }
              />

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch-all route for 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
                      <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
                      <a
                        href="/dashboard"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Go to Dashboard
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
