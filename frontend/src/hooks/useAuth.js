// Authentication service + React context for UK Customer Intelligence Platform
// This file preserves the existing class-based API (default export `authService`)
// and adds `<AuthProvider>` + `useAuth()` for components like ProtectedRoute.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('access_token');
    this.user = this.getStoredUser();
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          this.logout();
          // Force user back to login if a protected call 401s
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getStoredUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated() {
    return !!this.getToken() && !!this.getStoredUser();
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const { access_token, user } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      this.token = access_token;
      this.user = user;

      return { success: true, user };
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Login failed';
      return { success: false, error: message };
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
      const { access_token, user } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      this.token = access_token;
      this.user = user;

      return { success: true, user };
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Registration failed';
      return { success: false, error: message };
    }
  }

  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
      const { user, tenant } = response.data;

      const updatedUser = { ...user, tenant };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.user = updatedUser;

      return { success: true, user: updatedUser };
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Failed to get user info';
      return { success: false, error: message };
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.token = null;
    this.user = null;
  }

  getUser() {
    return this.user || this.getStoredUser();
  }

  getTenant() {
    const user = this.getUser();
    return user?.tenant || null;
  }

  hasPermission(permission) {
    const user = this.getUser();
    const tenant = this.getTenant();
    if (!user || !tenant) return false;

    const tier = tenant.subscription_tier;
    switch (permission) {
      case 'advanced_analytics':
        return ['professional', 'enterprise'].includes(tier);
      case 'ai_insights':
        return tier === 'enterprise';
      case 'bulk_operations':
        return ['professional', 'enterprise'].includes(tier);
      case 'api_access':
        return tier === 'enterprise';
      default:
        return true; // basic features available to all
    }
  }

  getSubscriptionLimits() {
    const tenant = this.getTenant();
    if (!tenant) return null;

    const limits = {
      basic: { companies: 10, alerts: 50, api_calls_per_hour: 100 },
      professional: { companies: 100, alerts: 500, api_calls_per_hour: 500 },
      enterprise: { companies: 1000, alerts: 5000, api_calls_per_hour: 2000 },
    };

    return limits[tenant.subscription_tier] || limits.basic;
  }
}

// Keep existing singleton default export for backward compatibility
const authService = new AuthService();
export default authService;

// ─────────────────────────────────────────────────────────────────────────────
// React Context so App.jsx/ProtectedRoute can read auth state.
// ─────────────────────────────────────────────────────────────────────────────
const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  hasRole: () => true,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(false);

  // Sync when localStorage changes (multi-tab)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'user' || e.key === 'access_token') {
        setUser(authService.getUser());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await authService.getCurrentUser();
      if (res.success) setUser(res.user);
      else if (res.error) {
        // If /me fails due to auth, ensure state reflects logged-out
        if (!authService.isAuthenticated()) setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => {
    const isAuthenticated = authService.isAuthenticated();
    const hasRole = (requiredRole) => {
      if (!requiredRole) return true;
      const u = authService.getUser();
      return u?.role ? u.role === requiredRole : true;
    };
    return { user, loading, isAuthenticated, hasRole, refreshUser };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
