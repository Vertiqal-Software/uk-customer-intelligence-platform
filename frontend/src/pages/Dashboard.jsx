import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyOverview from '../components/Dashboard/CompanyOverview';
import CompanyDetails from '../components/Dashboard/CompanyDetails';
import { dashboardAPI, systemAPI, authAPI } from '../services/api';

const AlertsPanel = ({ alerts, stats, onMarkAsRead, onDismissAlert }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Alerts
          {stats.unread_alerts > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              {stats.unread_alerts} unread
            </span>
          )}
        </h3>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${
                !alert.is_read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{alert.title}</h4>
                <div className="flex space-x-2">
                  {!alert.is_read && (
                    <button
                      onClick={() => onMarkAsRead(alert.id)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => onDismissAlert(alert.id)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{alert.company_name}</span>
                <span>{new Date(alert.created_at).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5v-5zM4 7v10a2 2 0 002 2h10M4 7V5a2 2 0 012-2h10a2 2 0 012 2v2M4 7l8 8 8-8" />
            </svg>
          </div>
          <p className="text-gray-500">No alerts yet</p>
          <p className="text-xs text-gray-400 mt-1">We'll notify you of important company changes</p>
        </div>
      )}
    </div>
  );
};

const WatchedCompaniesPanel = ({ companies, onCompanySelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Monitored Companies</h3>
      
      {companies.length > 0 ? (
        <div className="space-y-3">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => onCompanySelect({
                company_number: company.company_number,
                company_name: company.company_name,
                company_status: company.status || 'active'
              })}
              className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{company.company_name}</h4>
                  <p className="text-sm text-gray-600">#{company.company_number}</p>
                  
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      company.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {company.status || 'active'}
                    </span>
                    
                    {company.last_check && (
                      <span className="text-xs text-gray-500">
                        Checked: {new Date(company.last_check).toLocaleDateString('en-GB')}
                      </span>
                    )}
                  </div>
                </div>
                
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  View →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-gray-500">No companies being monitored</p>
          <p className="text-xs text-gray-400 mt-1">Search for companies and add them to monitoring</p>
        </div>
      )}
    </div>
  );
};

const StatsCards = ({ stats }) => {
  const statItems = [
    {
      title: 'Monitored Companies',
      value: stats.total_watched_companies || 0,
      icon: '🏢',
      color: 'blue'
    },
    {
      title: 'Unread Alerts',
      value: stats.unread_alerts || 0,
      icon: '🔔',
      color: stats.unread_alerts > 0 ? 'red' : 'gray'
    },
    {
      title: 'Organization',
      value: stats.tenant_name || 'Unknown',
      icon: '🏛️',
      color: 'green',
      isText: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">{stat.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-2xl font-bold ${
                stat.color === 'blue' ? 'text-blue-600' :
                stat.color === 'red' ? 'text-red-600' :
                stat.color === 'green' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {stat.isText ? stat.value : stat.value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadDashboardData();
    loadSystemHealth();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await dashboardAPI.getDashboardData();
      setDashboardData(data);
      
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        authAPI.logout();
        navigate('/login');
        return;
      }
      
      setError('Failed to load dashboard. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSystemHealth = async () => {
    try {
      const health = await systemAPI.getHealth();
      setSystemHealth(health);
    } catch (err) {
      console.error('Failed to load system health:', err);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
  };

  const handleMarkAsRead = async (alertId) => {
    // TODO: Implement mark as read API call
    console.log('Mark alert as read:', alertId);
  };

  const handleDismissAlert = async (alertId) => {
    // TODO: Implement dismiss alert API call
    console.log('Dismiss alert:', alertId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentUser = dashboardData?.user;
  const stats = dashboardData?.stats || {};
  const watchedCompanies = dashboardData?.watched_companies || [];
  const recentAlerts = dashboardData?.recent_alerts || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  UK Customer Intelligence Platform
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {currentUser?.first_name} {currentUser?.last_name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {systemHealth && (
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    systemHealth.services?.companies_house === 'ready' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    Companies House {systemHealth.services?.companies_house === 'ready' ? 'Connected' : 'Limited'}
                  </span>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Search and Details (3/4 width) */}
          <div className="lg:col-span-3 space-y-8">
            <CompanyOverview onCompanySelect={handleCompanySelect} />
            
            {selectedCompany && (
              <CompanyDetails 
                selectedCompany={selectedCompany}
              />
            )}
          </div>

          {/* Right Column - Monitoring and Alerts (1/4 width) */}
          <div className="lg:col-span-1 space-y-6">
            <WatchedCompaniesPanel 
              companies={watchedCompanies}
              onCompanySelect={handleCompanySelect}
            />
            
            <AlertsPanel 
              alerts={recentAlerts}
              stats={stats}
              onMarkAsRead={handleMarkAsRead}
              onDismissAlert={handleDismissAlert}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <p>© 2025 UK Customer Intelligence Platform</p>
              <span>•</span>
              <span>Tenant: {stats.tenant_name}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>Version 1.0.0</span>
              {systemHealth && (
                <>
                  <span>•</span>
                  <span>Multi-Tenant • AI-Powered • GDPR-Compliant</span>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;