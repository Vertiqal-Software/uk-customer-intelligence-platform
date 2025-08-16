import React, { useState, useEffect } from 'react';

const NotificationsManagement = () => {
  const [activeTab, setActiveTab] = useState('center');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all'
  });

  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Mock notifications data
      const mockNotifications = [
        {
          id: 'notif_001',
          type: 'company_update',
          title: 'New Filing Alert',
          message: 'TechFlow Solutions Ltd has filed new annual accounts',
          priority: 'medium',
          status: 'unread',
          timestamp: '2025-01-15T10:30:00Z',
          action_url: '/company/08123456',
          icon: '📄',
          metadata: {
            company_name: 'TechFlow Solutions Ltd',
            filing_type: 'Annual Accounts'
          }
        },
        {
          id: 'notif_002',
          type: 'tender_opportunity',
          title: 'New Tender Match',
          message: 'Found tender opportunity matching your criteria: Digital Transformation - Education Sector',
          priority: 'high',
          status: 'unread',
          timestamp: '2025-01-15T09:45:00Z',
          action_url: '/tenders/T001',
          icon: '💼',
          metadata: {
            tender_value: '£2.3M',
            deadline: '2025-02-15'
          }
        },
        {
          id: 'notif_003',
          type: 'system',
          title: 'Data Sync Complete',
          message: 'Daily data synchronization completed successfully',
          priority: 'low',
          status: 'read',
          timestamp: '2025-01-15T08:00:00Z',
          action_url: '/data-sources',
          icon: '🔄',
          metadata: {
            records_processed: 15420,
            duration: '2 minutes'
          }
        },
        {
          id: 'notif_004',
          type: 'email_campaign',
          title: 'Campaign Results Ready',
          message: 'Your email campaign "Q1 Outreach" has completed with 67% open rate',
          priority: 'medium',
          status: 'read',
          timestamp: '2025-01-14T16:20:00Z',
          action_url: '/email-campaigns/camp_001',
          icon: '📧',
          metadata: {
            open_rate: '67%',
            click_rate: '12%'
          }
        },
        {
          id: 'notif_005',
          type: 'security',
          title: 'Login from New Device',
          message: 'New login detected from Chrome on Windows',
          priority: 'high',
          status: 'read',
          timestamp: '2025-01-14T14:15:00Z',
          action_url: '/settings/security',
          icon: '🔒',
          metadata: {
            device: 'Chrome on Windows',
            location: 'London, UK'
          }
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      // Mock preferences data
      const mockPreferences = {
        email_notifications: {
          company_updates: true,
          tender_opportunities: true,
          system_alerts: false,
          email_campaigns: true,
          security_alerts: true,
          weekly_digest: true
        },
        push_notifications: {
          company_updates: false,
          tender_opportunities: true,
          system_alerts: false,
          email_campaigns: false,
          security_alerts: true,
          weekly_digest: false
        },
        frequency: {
          immediate: ['tender_opportunities', 'security_alerts'],
          daily: ['company_updates', 'email_campaigns'],
          weekly: ['system_alerts']
        },
        quiet_hours: {
          enabled: true,
          start_time: '22:00',
          end_time: '08:00',
          timezone: 'Europe/London'
        }
      };
      setPreferences(mockPreferences);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: 'read' }
          : notif
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, status: 'read' }))
    );
  };

  const deleteNotification = async (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const updatePreference = (category, type, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value
      }
    }));
  };

  const savePreferences = async () => {
    try {
      // Mock save operation
      console.log('Saving preferences:', preferences);
      alert('Notification preferences saved successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences');
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'company_update': return 'text-blue-600';
      case 'tender_opportunity': return 'text-purple-600';
      case 'system': return 'text-gray-600';
      case 'email_campaign': return 'text-green-600';
      case 'security': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filters.type !== 'all' && notif.type !== filters.type) return false;
    if (filters.status !== 'all' && notif.status !== filters.status) return false;
    if (filters.priority !== 'all' && notif.priority !== filters.priority) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const tabs = [
    { id: 'center', name: 'Notification Center', icon: '🔔', count: unreadCount },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'templates', name: 'Email Templates', icon: '📧' },
    { id: 'history', name: 'History', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600">Manage your notifications and preferences</p>
            </div>
            {activeTab === 'center' && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'center' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="company_update">Company Updates</option>
                    <option value="tender_opportunity">Tender Opportunities</option>
                    <option value="system">System</option>
                    <option value="email_campaign">Email Campaigns</option>
                    <option value="security">Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
                    notification.status === 'unread' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`text-2xl ${getTypeColor(notification.type)}`}>
                        {notification.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                          {notification.status === 'unread' && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{notification.message}</p>
                        {notification.metadata && (
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {Object.entries(notification.metadata).map(([key, value]) => (
                              <span key={key}>
                                <span className="font-medium">{key.replace('_', ' ')}:</span> {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 ml-4">
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      <div className="flex space-x-2">
                        {notification.status === 'unread' && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => window.open(notification.action_url, '_blank')}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5v-5zM9 7h6m0 10v-3M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M9 7H6a1 1 0 00-1 1v4a1 1 0 001 1h3" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No notifications found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-8">
            {/* Email Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Email Notifications</h3>
              <div className="space-y-4">
                {Object.entries(preferences.email_notifications || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Receive email notifications for {key.replace('_', ' ')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updatePreference('email_notifications', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Push Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Push Notifications</h3>
              <div className="space-y-4">
                {Object.entries(preferences.push_notifications || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Receive push notifications for {key.replace('_', ' ')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updatePreference('push_notifications', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Quiet Hours</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Quiet Hours</h4>
                    <p className="text-sm text-gray-600">Disable notifications during specified hours</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.quiet_hours?.enabled}
                      onChange={(e) => updatePreference('quiet_hours', 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {preferences.quiet_hours?.enabled && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={preferences.quiet_hours?.start_time}
                        onChange={(e) => updatePreference('quiet_hours', 'start_time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        value={preferences.quiet_hours?.end_time}
                        onChange={(e) => updatePreference('quiet_hours', 'end_time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={savePreferences}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Email Templates</h3>
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p>Email template editor coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Notification History</h3>
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>Notification history and analytics coming soon</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsManagement;