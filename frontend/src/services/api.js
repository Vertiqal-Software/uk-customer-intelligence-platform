// Enhanced API service for UK Customer Intelligence Platform
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    // Set base URL for all requests
    axios.defaults.baseURL = API_BASE_URL;

    // Request interceptor to add auth headers
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

    // Response interceptor for error handling
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle authentication errors
        if (error.response?.status === 401) {
          this.clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper method for handling API responses
  async handleRequest(requestPromise) {
    try {
      const response = await requestPromise;
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'An error occurred';
      return { success: false, error: message, status: error.response?.status };
    }
  }

  // =================== AUTHENTICATION ===================
  async login(email, password) {
    return this.handleRequest(
      axios.post('/api/auth/login', { email, password })
    );
  }

  async register(userData) {
    return this.handleRequest(
      axios.post('/api/auth/register', userData)
    );
  }

  async getCurrentUser() {
    return this.handleRequest(
      axios.get('/api/auth/me')
    );
  }

  // NEW: Forgot / Reset password
  async forgotPasswordRequest(email) {
    return this.handleRequest(
      axios.post('/api/auth/forgot-password', { email })
    );
  }

  async resetPassword(token, new_password) {
    return this.handleRequest(
      axios.post('/api/auth/reset-password', { token, new_password })
    );
  }

  // =================== COMPANIES ===================
  async searchCompanies(query, limit = 20) {
    return this.handleRequest(
      axios.get('/api/companies/search', {
        params: { q: query, limit }
      })
    );
  }

  async getCompanyDetails(companyNumber) {
    return this.handleRequest(
      axios.get(`/api/companies/${companyNumber}`)
    );
  }

  async addToMonitoring(companyNumber) {
    return this.handleRequest(
      axios.post(`/api/companies/${companyNumber}/monitor`)
    );
  }

  async removeFromMonitoring(companyNumber) {
    return this.handleRequest(
      axios.delete(`/api/companies/${companyNumber}/monitor`)
    );
  }

  async getMonitoredCompanies(page = 1, limit = 20) {
    return this.handleRequest(
      axios.get('/api/companies/monitored', {
        params: { page, limit }
      })
    );
  }

  // =================== DASHBOARD ===================
  async getDashboardData() {
    return this.handleRequest(
      axios.get('/api/dashboard')
    );
  }

  // =================== ALERTS ===================
  async getAlerts(page = 1, limit = 20, severity = null, unreadOnly = false) {
    const params = { page, limit };
    if (severity) params.severity = severity;
    if (unreadOnly) params.unread_only = true;

    return this.handleRequest(
      axios.get('/api/alerts', { params })
    );
  }

  async markAlertRead(alertId) {
    return this.handleRequest(
      axios.post(`/api/alerts/${alertId}/read`)
    );
  }

  async markAllAlertsRead() {
    return this.handleRequest(
      axios.post('/api/alerts/mark-all-read')
    );
  }

  // =================== HEALTH & SYSTEM ===================
  async getHealthStatus() {
    return this.handleRequest(
      axios.get('/api/health')
    );
  }

  // =================== USER PREFERENCES ===================
  async updateUserPreferences(preferences) {
    return this.handleRequest(
      axios.put('/api/user/preferences', preferences)
    );
  }

  async getUserPreferences() {
    return this.handleRequest(
      axios.get('/api/user/preferences')
    );
  }

  // =================== FUTURE FEATURES ===================
  async getCompanyNews(companyId, page = 1, limit = 10) {
    return this.handleRequest(
      axios.get(`/api/companies/${companyId}/news`, {
        params: { page, limit }
      })
    );
  }

  async getCompanyFinancials(companyId) {
    return this.handleRequest(
      axios.get(`/api/companies/${companyId}/financials`)
    );
  }

  async getAIInsights(companyId) {
    return this.handleRequest(
      axios.get(`/api/companies/${companyId}/ai-insights`)
    );
  }

  async getCompanyPeople(companyId) {
    return this.handleRequest(
      axios.get(`/api/companies/${companyId}/people`)
    );
  }

  async generateGoldenCircleMessage(companyId, messageType = 'email') {
    return this.handleRequest(
      axios.post(`/api/companies/${companyId}/golden-circle-message`, {
        message_type: messageType
      })
    );
  }

  async exportCompanyData(companyIds, format = 'csv') {
    return this.handleRequest(
      axios.post('/api/export/companies', {
        company_ids: companyIds,
        format
      }, {
        responseType: 'blob'
      })
    );
  }

  async bulkAddToMonitoring(companyNumbers) {
    return this.handleRequest(
      axios.post('/api/companies/bulk-monitor', {
        company_numbers: companyNumbers
      })
    );
  }

  async bulkRemoveFromMonitoring(companyNumbers) {
    return this.handleRequest(
      axios.post('/api/companies/bulk-unmonitor', {
        company_numbers: companyNumbers
      })
    );
  }

  async getWebhooks() {
    return this.handleRequest(
      axios.get('/api/webhooks')
    );
  }

  async createWebhook(webhookData) {
    return this.handleRequest(
      axios.post('/api/webhooks', webhookData)
    );
  }

  async deleteWebhook(webhookId) {
    return this.handleRequest(
      axios.delete(`/api/webhooks/${webhookId}`)
    );
  }

  // =================== UTILITY METHODS ===================
  getToken() {
    return localStorage.getItem('access_token');
  }

  getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  clearAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  async uploadFile(file, endpoint) {
    const formData = new FormData();
    formData.append('file', file);

    return this.handleRequest(
      axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    );
  }

  async downloadFile(endpoint, filename) {
    try {
      const response = await axios.get(endpoint, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  searchWithDebounce = this.debounce(async (query, callback) => {
    if (query.length < 2) {
      callback({ success: true, data: { companies: [] } });
      return;
    }

    const result = await this.searchCompanies(query);
    callback(result);
  }, 300);

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  requestQueue = [];
  maxConcurrentRequests = 5;
  activeRequests = 0;

  async queueRequest(requestFunction) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFunction, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.activeRequests >= this.maxConcurrentRequests || this.requestQueue.length === 0) {
      return;
    }

    this.activeRequests++;
    const { requestFunction, resolve, reject } = this.requestQueue.shift();

    try {
      const result = await requestFunction();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.activeRequests--;
      this.processQueue();
    }
  }

  cache = new Map();
  cacheExpiry = new Map();

  async getCached(key, fetchFunction, ttl = 300000) {
    const now = Date.now();
    if (this.cache.has(key) && this.cacheExpiry.get(key) > now) {
      return this.cache.get(key);
    }

    const result = await fetchFunction();
    this.cache.set(key, result);
    this.cacheExpiry.set(key, now + ttl);

    return result;
  }

  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  async searchCompaniesWithCache(query) {
    const cacheKey = `search_${query}`;
    return this.getCached(cacheKey, () => this.searchCompanies(query), 600000);
  }

  async getCompanyDetailsWithCache(companyNumber) {
    const cacheKey = `company_${companyNumber}`;
    return this.getCached(cacheKey, () => this.getCompanyDetails(companyNumber), 300000);
  }
}

const apiService = new ApiService();

export const authAPI = {
  isAuthenticated: () => apiService.isAuthenticated(),
  getToken: () => apiService.getToken(),
  getUser: () => apiService.getUser(),
  logout: () => apiService.clearAuth()
};

export const dashboardAPI = {
  getDashboardData: () => apiService.getDashboardData()
};

export const systemAPI = {
  getHealth: () => apiService.getHealthStatus()
};

export default apiService;
