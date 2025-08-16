// Authentication service for UK Customer Intelligence Platform
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('access_token');
    this.user = this.getStoredUser();
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    // Request interceptor to add auth token
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
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
          this.logout();
          window.location.href = '/login';
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
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  isAuthenticated() {
    return !!this.getToken() && !!this.getStoredUser();
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      const { access_token, user } = response.data;

      // Store authentication data
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      this.token = access_token;
      this.user = user;

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      return { success: false, error: message };
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);

      const { access_token, user } = response.data;

      // Store authentication data
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      this.token = access_token;
      this.user = user;

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      return { success: false, error: message };
    }
  }

  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
      const { user, tenant } = response.data;
      
      // Update stored user data
      const updatedUser = { ...user, tenant };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.user = updatedUser;
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to get user info';
      return { success: false, error: message };
    }
  }

  logout() {
    // Clear stored authentication data
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    
    this.token = null;
    this.user = null;
  }

  // Helper method to get user info without API call
  getUser() {
    return this.user || this.getStoredUser();
  }

  // Helper method to get tenant info
  getTenant() {
    const user = this.getUser();
    return user?.tenant || null;
  }

  // Helper method to check if user has specific permissions
  hasPermission(permission) {
    const user = this.getUser();
    const tenant = this.getTenant();
    
    // Basic permission checking based on subscription tier
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
        return true; // Basic permissions for all users
    }
  }

  // Helper method to get subscription limits
  getSubscriptionLimits() {
    const tenant = this.getTenant();
    if (!tenant) return null;

    const limits = {
      basic: {
        companies: 10,
        alerts: 50,
        api_calls_per_hour: 100
      },
      professional: {
        companies: 100,
        alerts: 500,
        api_calls_per_hour: 500
      },
      enterprise: {
        companies: 1000,
        alerts: 5000,
        api_calls_per_hour: 2000
      }
    };

    return limits[tenant.subscription_tier] || limits.basic;
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;