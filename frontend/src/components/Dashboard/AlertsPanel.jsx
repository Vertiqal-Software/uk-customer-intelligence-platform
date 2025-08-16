import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, X, Filter, Search } from 'lucide-react';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockAlerts = [
      {
        id: 1,
        title: 'High-value customer at risk',
        message: 'Tesco PLC showing declining engagement metrics',
        severity: 'high',
        type: 'customer',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        source: 'Customer Analytics'
      },
      {
        id: 2,
        title: 'Payment delay detected',
        message: 'Marks & Spencer payment 15 days overdue',
        severity: 'medium',
        type: 'financial',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isRead: false,
        source: 'Finance Module'
      },
      {
        id: 3,
        title: 'New opportunity identified',
        message: 'ASDA expanding digital infrastructure - potential £2M deal',
        severity: 'low',
        type: 'opportunity',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isRead: true,
        source: 'Opportunity Engine'
      },
      {
        id: 4,
        title: 'Contract renewal reminder',
        message: 'Sainsbury\'s contract expires in 30 days',
        severity: 'medium',
        type: 'contract',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isRead: false,
        source: 'Contract Management'
      },
      {
        id: 5,
        title: 'System performance warning',
        message: 'API response times increased by 25%',
        severity: 'low',
        type: 'system',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isRead: true,
        source: 'System Monitor'
      }
    ];
    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
  }, []);

  // Filter alerts based on search and filters
  useEffect(() => {
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(alert => alert.type === selectedType);
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, selectedSeverity, selectedType]);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const markAsRead = (alertId) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Alerts & Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} new
              </span>
            )}
          </h2>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="customer">Customer</option>
            <option value="financial">Financial</option>
            <option value="opportunity">Opportunity</option>
            <option value="contract">Contract</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No alerts match your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded-r-lg transition-all duration-200 hover:shadow-md ${getSeverityColor(alert.severity)} ${
                  !alert.isRead ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium ${!alert.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {alert.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {alert.source} • {formatTimestamp(alert.timestamp)}
                        </span>
                        {!alert.isRead && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="ml-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredAlerts.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Alerts ({alerts.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;