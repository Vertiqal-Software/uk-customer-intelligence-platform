import React, { useState, useEffect } from 'react';

const DataSourcesManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSource, setSelectedSource] = useState(null);
  const [showAddSource, setShowAddSource] = useState(false);

  // Mock data - replace with real API calls
  const [dataSources, setDataSources] = useState({
    companies_house: {
      id: 'companies_house',
      name: 'Companies House API',
      type: 'Government',
      status: 'Connected',
      health: 'Healthy',
      last_sync: '2025-01-15T10:30:00Z',
      api_key: 'ch_live_***********4567',
      rate_limit: {
        current: 450,
        max: 600,
        window: '5 minutes',
        reset_at: '2025-01-15T10:35:00Z'
      },
      metrics: {
        requests_today: 2847,
        success_rate: 99.2,
        avg_response_time: 180,
        errors_24h: 3
      },
      endpoints: [
        { name: 'Company Search', status: 'Active', last_used: '2025-01-15T10:29:00Z' },
        { name: 'Company Profile', status: 'Active', last_used: '2025-01-15T10:28:00Z' },
        { name: 'Officers', status: 'Active', last_used: '2025-01-15T10:25:00Z' },
        { name: 'Filing History', status: 'Active', last_used: '2025-01-15T10:20:00Z' }
      ]
    },
    find_tender: {
      id: 'find_tender',
      name: 'Find a Tender Service',
      type: 'Government',
      status: 'Connected',
      health: 'Healthy',
      last_sync: '2025-01-15T10:25:00Z',
      api_key: 'ft_live_***********8901',
      rate_limit: {
        current: 150,
        max: 1000,
        window: '1 hour',
        reset_at: '2025-01-15T11:00:00Z'
      },
      metrics: {
        requests_today: 456,
        success_rate: 98.8,
        avg_response_time: 350,
        errors_24h: 2
      },
      endpoints: [
        { name: 'Search Tenders', status: 'Active', last_used: '2025-01-15T10:24:00Z' },
        { name: 'Tender Details', status: 'Active', last_used: '2025-01-15T10:22:00Z' },
        { name: 'Buyer Information', status: 'Active', last_used: '2025-01-15T10:18:00Z' }
      ]
    },
    opencorporates: {
      id: 'opencorporates',
      name: 'OpenCorporates',
      type: 'Commercial',
      status: 'Connected',
      health: 'Warning',
      last_sync: '2025-01-15T09:45:00Z',
      api_key: 'oc_live_***********2345',
      rate_limit: {
        current: 980,
        max: 1000,
        window: '1 month',
        reset_at: '2025-02-01T00:00:00Z'
      },
      metrics: {
        requests_today: 234,
        success_rate: 95.4,
        avg_response_time: 890,
        errors_24h: 12
      },
      endpoints: [
        { name: 'Company Search', status: 'Active', last_used: '2025-01-15T09:44:00Z' },
        { name: 'Company Data', status: 'Rate Limited', last_used: '2025-01-15T09:40:00Z' },
        { name: 'Officer Search', status: 'Active', last_used: '2025-01-15T09:35:00Z' }
      ]
    },
    clearbit: {
      id: 'clearbit',
      name: 'Clearbit Enrichment',
      type: 'Commercial',
      status: 'Pending',
      health: 'Setup Required',
      last_sync: null,
      api_key: null,
      rate_limit: null,
      metrics: {
        requests_today: 0,
        success_rate: 0,
        avg_response_time: 0,
        errors_24h: 0
      },
      endpoints: []
    }
  });

  const [systemHealth, setSystemHealth] = useState({
    overall_status: 'Healthy',
    data_freshness: 95.2,
    api_availability: 98.8,
    processing_queue: 23,
    daily_ingestion: 15420,
    storage_used: '2.3TB',
    storage_limit: '10TB'
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      timestamp: '2025-01-15T10:30:00Z',
      source: 'Companies House',
      action: 'Company data updated',
      details: 'TechFlow Solutions Ltd - Filing update processed',
      status: 'Success'
    },
    {
      timestamp: '2025-01-15T10:28:00Z',
      source: 'Find a Tender',
      action: 'New tender discovered',
      details: 'Digital Transformation - Education Sector (£2.3M)',
      status: 'Success'
    },
    {
      timestamp: '2025-01-15T10:25:00Z',
      source: 'OpenCorporates',
      action: 'Rate limit warning',
      details: 'Approaching monthly limit (980/1000)',
      status: 'Warning'
    },
    {
      timestamp: '2025-01-15T10:22:00Z',
      source: 'Companies House',
      action: 'Officer change detected',
      details: 'CloudTech Solutions - New director appointed',
      status: 'Success'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Connected':
      case 'Active':
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Warning':
      case 'Rate Limited':
        return 'bg-yellow-100 text-yellow-800';
      case 'Error':
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      case 'Setup Required':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'Healthy':
        return 'text-green-600';
      case 'Warning':
        return 'text-yellow-600';
      case 'Error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString('en-GB');
  };

  const testConnection = async (sourceId) => {
    // Simulate API test
    alert(`Testing connection to ${dataSources[sourceId].name}...`);
  };

  const refreshData = async (sourceId) => {
    // Simulate data refresh
    alert(`Refreshing data from ${dataSources[sourceId].name}...`);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'sources', name: 'Data Sources', icon: '🔗' },
    { id: 'monitoring', name: 'Monitoring', icon: '👁️' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Data Sources Management</h1>
                <p className="text-sm text-gray-600">Monitor and manage external data integrations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${getHealthColor(systemHealth.overall_status)}`}>
                <div className="w-3 h-3 rounded-full bg-current"></div>
                <span className="text-sm font-medium">{systemHealth.overall_status}</span>
              </div>
              <button
                onClick={() => setShowAddSource(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Data Source
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">📊</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Data Freshness</p>
                <p className="text-2xl font-bold text-green-600">{systemHealth.data_freshness}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🔗</div>
              <div>
                <p className="text-sm font-medium text-gray-600">API Availability</p>
                <p className="text-2xl font-bold text-blue-600">{systemHealth.api_availability}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">⚡</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Queue</p>
                <p className="text-2xl font-bold text-orange-600">{systemHealth.processing_queue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">💾</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Ingestion</p>
                <p className="text-2xl font-bold text-purple-600">{systemHealth.daily_ingestion.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b mb-6">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Data Sources Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Connected Data Sources</h3>
                <div className="space-y-4">
                  {Object.values(dataSources).map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${getHealthColor(source.health) === 'text-green-600' ? 'bg-green-500' : 
                            getHealthColor(source.health) === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{source.name}</h4>
                          <p className="text-sm text-gray-600">{source.type} • Last sync: {source.last_sync ? formatRelativeTime(source.last_sync) : 'Never'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(source.status)}`}>
                          {source.status}
                        </span>
                        <button
                          onClick={() => setSelectedSource(source)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.details}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.source}</p>
                          </div>
                          <span className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* System Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Storage Used</span>
                    <span className="text-sm font-medium text-gray-900">{systemHealth.storage_used} / {systemHealth.storage_limit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Refresh All Sources
                  </button>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    Test Connections
                  </button>
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                    Export Logs
                  </button>
                  <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                    View Documentation
                  </button>
                </div>
              </div>

              {/* Rate Limits Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Rate Limits</h3>
                <div className="space-y-3">
                  {Object.values(dataSources).filter(source => source.rate_limit).map((source) => (
                    <div key={source.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">{source.name}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {source.rate_limit.current}/{source.rate_limit.max}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${
                            (source.rate_limit.current / source.rate_limit.max) > 0.8 ? 'bg-red-500' :
                            (source.rate_limit.current / source.rate_limit.max) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(source.rate_limit.current / source.rate_limit.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(dataSources).map((source) => (
              <div key={source.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{source.name}</h3>
                    <p className="text-sm text-gray-600">{source.type}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(source.status)}`}>
                    {source.status}
                  </span>
                </div>

                {source.metrics && (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Requests Today</span>
                      <span className="text-sm font-medium text-gray-900">{source.metrics.requests_today.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="text-sm font-medium text-gray-900">{source.metrics.success_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Response</span>
                      <span className="text-sm font-medium text-gray-900">{source.metrics.avg_response_time}ms</span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => testConnection(source.id)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => refreshData(source.id)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => setSelectedSource(source)}
                    className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Source Card */}
            <div className="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Add Data Source</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Connect new APIs and data providers</p>
              <button
                onClick={() => setShowAddSource(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Source
              </button>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-medium text-gray-700 mb-2">Total Requests (24h)</h4>
                <div className="text-2xl font-bold text-blue-600">3,537</div>
                <div className="text-sm text-green-600">+12% from yesterday</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-medium text-gray-700 mb-2">Average Response Time</h4>
                <div className="text-2xl font-bold text-green-600">284ms</div>
                <div className="text-sm text-green-600">-5% from yesterday</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-medium text-gray-700 mb-2">Error Rate</h4>
                <div className="text-2xl font-bold text-red-600">0.8%</div>
                <div className="text-sm text-red-600">+0.2% from yesterday</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-medium text-gray-700 mb-2">Data Quality Score</h4>
                <div className="text-2xl font-bold text-purple-600">94.2%</div>
                <div className="text-sm text-green-600">+1.1% from yesterday</div>
              </div>
            </div>

            {/* Source Performance Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Source Performance</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Response</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Error</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.values(dataSources).map((source) => (
                      <tr key={source.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{source.name}</div>
                          <div className="text-sm text-gray-500">{source.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(source.status)}`}>
                            {source.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {source.metrics?.requests_today || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {source.metrics?.success_rate || 0}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {source.metrics?.avg_response_time || 0}ms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {source.last_sync ? formatRelativeTime(source.last_sync) : 'Never'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Global Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Refresh Interval</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="5">Every 5 minutes</option>
                    <option value="15">Every 15 minutes</option>
                    <option value="30">Every 30 minutes</option>
                    <option value="60">Every hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Error Notification Threshold</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="1">1% error rate</option>
                    <option value="5">5% error rate</option>
                    <option value="10">10% error rate</option>
                    <option value="20">20% error rate</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" id="auto-retry" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="auto-retry" className="ml-2 block text-sm text-gray-700">
                    Enable automatic retry for failed requests
                  </label>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" id="detailed-logging" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="detailed-logging" className="ml-2 block text-sm text-gray-700">
                    Enable detailed logging (may impact performance)
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Source Detail Modal */}
        {selectedSource && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSource.name}</h2>
                  <p className="text-gray-600">{selectedSource.type} Data Source</p>
                </div>
                <button
                  onClick={() => setSelectedSource(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Connection Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedSource.status)}`}>
                          {selectedSource.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">API Key:</span>
                        <span className="text-gray-900 font-mono">{selectedSource.api_key || 'Not configured'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Sync:</span>
                        <span className="text-gray-900">{selectedSource.last_sync ? formatRelativeTime(selectedSource.last_sync) : 'Never'}</span>
                      </div>
                    </div>
                  </div>

                  {selectedSource.rate_limit && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Rate Limits</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Usage:</span>
                          <span className="text-gray-900">{selectedSource.rate_limit.current}/{selectedSource.rate_limit.max}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Window:</span>
                          <span className="text-gray-900">{selectedSource.rate_limit.window}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Resets:</span>
                          <span className="text-gray-900">{new Date(selectedSource.rate_limit.reset_at).toLocaleString('en-GB')}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              (selectedSource.rate_limit.current / selectedSource.rate_limit.max) > 0.8 ? 'bg-red-500' :
                              (selectedSource.rate_limit.current / selectedSource.rate_limit.max) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(selectedSource.rate_limit.current / selectedSource.rate_limit.max) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {selectedSource.metrics && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Performance Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{selectedSource.metrics.requests_today}</div>
                          <div className="text-sm text-blue-700">Requests Today</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{selectedSource.metrics.success_rate}%</div>
                          <div className="text-sm text-green-700">Success Rate</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{selectedSource.metrics.avg_response_time}ms</div>
                          <div className="text-sm text-purple-700">Avg Response</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{selectedSource.metrics.errors_24h}</div>
                          <div className="text-sm text-red-700">Errors (24h)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedSource.endpoints && selectedSource.endpoints.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Endpoints</h3>
                      <div className="space-y-2">
                        {selectedSource.endpoints.map((endpoint, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{endpoint.name}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(endpoint.status)}`}>
                              {endpoint.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={() => testConnection(selectedSource.id)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Test Connection
                    </button>
                    <button
                      onClick={() => refreshData(selectedSource.id)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Refresh Data
                    </button>
                    <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Source Modal */}
        {showAddSource && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add Data Source</h2>
                  <p className="text-gray-600">Connect a new external data provider</p>
                </div>
                <button
                  onClick={() => setShowAddSource(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'D&B Hoovers', type: 'Commercial', description: 'Business intelligence and company data' },
                  { name: 'LinkedIn Sales Navigator', type: 'Commercial', description: 'Professional network insights' },
                  { name: 'Experian Business', type: 'Commercial', description: 'Credit and financial data' },
                  { name: 'Google Places API', type: 'Commercial', description: 'Location and business details' },
                  { name: 'Custom API', type: 'Custom', description: 'Configure your own data source' },
                  { name: 'CSV Upload', type: 'Manual', description: 'Upload data files manually' }
                ].map((source, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium text-gray-800">{source.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{source.type}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => setShowAddSource(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Configure Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSourcesManagement;