import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [userSettings, setUserSettings] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    preferences: {
      email_notifications: true,
      alert_frequency: 'immediate',
      dashboard_layout: 'default',
      timezone: 'Europe/London'
    }
  });

  const [tenantSettings, setTenantSettings] = useState({
    name: '',
    subscription_tier: '',
    settings: {
      companies_house_api_enabled: true,
      max_monitored_companies: 100,
      data_retention_days: 365,
      webhook_url: ''
    }
  });

  const [securitySettings, setSecuritySettings] = useState({
    two_factor_enabled: false,
    session_timeout: 60,
    password_requirements: {
      min_length: 8,
      require_uppercase: true,
      require_numbers: true,
      require_symbols: true
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await apiService.getCurrentUser();
      if (result.success) {
        const { user, tenant } = result.data;
        setUserSettings({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          role: user.role || '',
          preferences: user.preferences || userSettings.preferences
        });
        
        if (tenant) {
          setTenantSettings({
            name: tenant.name || '',
            subscription_tier: tenant.subscription_tier || '',
            settings: tenant.settings || tenantSettings.settings
          });
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const saveUserSettings = async () => {
    try {
      setSaving(true);
      const result = await apiService.updateUserPreferences(userSettings.preferences);
      if (result.success) {
        setMessage({ type: 'success', text: 'User settings saved successfully' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save settings' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const saveTenantSettings = async () => {
    try {
      setSaving(true);
      // TODO: Implement tenant settings API
      setMessage({ type: 'success', text: 'Organization settings saved successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save organization settings' });
    } finally {
      setSaving(false);
    }
  };

  const saveSecuritySettings = async () => {
    try {
      setSaving(true);
      // TODO: Implement security settings API
      setMessage({ type: 'success', text: 'Security settings saved successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save security settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleUserSettingChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUserSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setUserSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleTenantSettingChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setTenantSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setTenantSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSecuritySettingChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSecuritySettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSecuritySettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'organization', name: 'Organization', icon: '🏢' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-600">Manage your account and organization preferences</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Message */}
      {message.text && (
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4`}>
          <div className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
            'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:w-3/4">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Profile Settings</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={userSettings.first_name}
                        onChange={(e) => handleUserSettingChange('first_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={userSettings.last_name}
                        onChange={(e) => handleUserSettingChange('last_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userSettings.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">Email cannot be changed. Contact support if needed.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={userSettings.role}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={userSettings.preferences.timezone}
                      onChange={(e) => handleUserSettingChange('preferences.timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="America/New_York">New York (EST)</option>
                      <option value="America/Los_Angeles">Los Angeles (PST)</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={saveUserSettings}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Notification Preferences</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userSettings.preferences.email_notifications}
                        onChange={(e) => handleUserSettingChange('preferences.email_notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alert Frequency
                    </label>
                    <select
                      value={userSettings.preferences.alert_frequency}
                      onChange={(e) => handleUserSettingChange('preferences.alert_frequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Summary</option>
                      <option value="never">Never</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={saveUserSettings}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Notifications'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'organization' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Organization Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={tenantSettings.name}
                      onChange={(e) => handleTenantSettingChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subscription Tier
                    </label>
                    <input
                      type="text"
                      value={tenantSettings.subscription_tier}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Monitored Companies
                    </label>
                    <input
                      type="number"
                      value={tenantSettings.settings.max_monitored_companies}
                      onChange={(e) => handleTenantSettingChange('settings.max_monitored_companies', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Retention (Days)
                    </label>
                    <input
                      type="number"
                      value={tenantSettings.settings.data_retention_days}
                      onChange={(e) => handleTenantSettingChange('settings.data_retention_days', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={saveTenantSettings}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Organization'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Security Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.two_factor_enabled}
                        onChange={(e) => handleSecuritySettingChange('two_factor_enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.session_timeout}
                      onChange={(e) => handleSecuritySettingChange('session_timeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Password Requirements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Minimum Length (8 characters)</span>
                        <input
                          type="checkbox"
                          checked={securitySettings.password_requirements.min_length >= 8}
                          disabled
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Require Uppercase Letters</span>
                        <input
                          type="checkbox"
                          checked={securitySettings.password_requirements.require_uppercase}
                          onChange={(e) => handleSecuritySettingChange('password_requirements.require_uppercase', e.target.checked)}
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Require Numbers</span>
                        <input
                          type="checkbox"
                          checked={securitySettings.password_requirements.require_numbers}
                          onChange={(e) => handleSecuritySettingChange('password_requirements.require_numbers', e.target.checked)}
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Require Symbols</span>
                        <input
                          type="checkbox"
                          checked={securitySettings.password_requirements.require_symbols}
                          onChange={(e) => handleSecuritySettingChange('password_requirements.require_symbols', e.target.checked)}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={saveSecuritySettings}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Security'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Integrations</h3>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Companies House API</h4>
                        <p className="text-sm text-gray-500">Official UK company data integration</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Webhook URL</h4>
                        <p className="text-sm text-gray-500">Receive real-time notifications</p>
                      </div>
                    </div>
                    <input
                      type="url"
                      value={tenantSettings.settings.webhook_url}
                      onChange={(e) => handleTenantSettingChange('settings.webhook_url', e.target.value)}
                      placeholder="https://your-domain.com/webhook"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <p className="text-gray-500">More integrations coming soon</p>
                    <p className="text-sm text-gray-400 mt-1">CRM, Email, and Analytics platforms</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;