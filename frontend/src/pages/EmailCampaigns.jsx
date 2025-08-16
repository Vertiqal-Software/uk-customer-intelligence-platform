import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const EmailCampaigns = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    template: '',
    recipients: 'all_contacts',
    send_time: 'now',
    scheduled_date: '',
    tags: []
  });

  const [campaignStats, setCampaignStats] = useState({
    total_campaigns: 0,
    active_campaigns: 0,
    total_sent: 0,
    avg_open_rate: 0,
    avg_click_rate: 0,
    avg_reply_rate: 0
  });

  useEffect(() => {
    loadCampaigns();
    loadTemplates();
    loadCampaignStats();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      // Mock campaigns data - replace with real API call
      const mockCampaigns = [
        {
          id: '1',
          name: 'Q1 Cybersecurity Outreach',
          subject: 'Protect Your Business with Advanced Cybersecurity',
          status: 'completed',
          type: 'broadcast',
          created_date: '2025-01-10T09:00:00Z',
          sent_date: '2025-01-12T10:00:00Z',
          scheduled_date: null,
          recipients_count: 1250,
          delivered_count: 1198,
          opened_count: 359,
          clicked_count: 72,
          replied_count: 18,
          unsubscribed_count: 5,
          bounced_count: 52,
          tags: ['cybersecurity', 'outreach', 'q1'],
          template: 'cybersecurity_template',
          created_by: 'Sarah Johnson'
        },
        {
          id: '2',
          name: 'Healthcare IT Solutions Follow-up',
          subject: 'Following up on our healthcare IT discussion',
          status: 'active',
          type: 'sequence',
          created_date: '2025-01-14T11:30:00Z',
          sent_date: '2025-01-15T09:00:00Z',
          scheduled_date: null,
          recipients_count: 89,
          delivered_count: 87,
          opened_count: 34,
          clicked_count: 8,
          replied_count: 3,
          unsubscribed_count: 1,
          bounced_count: 2,
          tags: ['healthcare', 'follow-up', 'warm'],
          template: 'healthcare_followup',
          created_by: 'John Smith'
        },
        {
          id: '3',
          name: 'Education Sector Newsletter - February',
          subject: 'Latest trends in educational technology',
          status: 'scheduled',
          type: 'newsletter',
          created_date: '2025-01-15T16:20:00Z',
          sent_date: null,
          scheduled_date: '2025-02-01T09:00:00Z',
          recipients_count: 543,
          delivered_count: 0,
          opened_count: 0,
          clicked_count: 0,
          replied_count: 0,
          unsubscribed_count: 0,
          bounced_count: 0,
          tags: ['education', 'newsletter', 'february'],
          template: 'newsletter_template',
          created_by: 'Sarah Johnson'
        },
        {
          id: '4',
          name: 'Government Contract Opportunities',
          subject: 'New tender opportunities in your sector',
          status: 'draft',
          type: 'broadcast',
          created_date: '2025-01-16T14:45:00Z',
          sent_date: null,
          scheduled_date: null,
          recipients_count: 0,
          delivered_count: 0,
          opened_count: 0,
          clicked_count: 0,
          replied_count: 0,
          unsubscribed_count: 0,
          bounced_count: 0,
          tags: ['government', 'tenders', 'opportunities'],
          template: 'tender_opportunities',
          created_by: 'Michael Brown'
        }
      ];

      setCampaigns(mockCampaigns);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    // Mock email templates
    const mockTemplates = [
      { id: 'cybersecurity_template', name: 'Cybersecurity Solutions' },
      { id: 'healthcare_followup', name: 'Healthcare Follow-up' },
      { id: 'newsletter_template', name: 'Monthly Newsletter' },
      { id: 'tender_opportunities', name: 'Tender Opportunities' },
      { id: 'introduction_template', name: 'Company Introduction' }
    ];
    setTemplates(mockTemplates);
  };

  const loadCampaignStats = async () => {
    // Mock campaign statistics
    setCampaignStats({
      total_campaigns: 24,
      active_campaigns: 3,
      total_sent: 15420,
      avg_open_rate: 24.8,
      avg_click_rate: 4.2,
      avg_reply_rate: 2.1
    });
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      // Mock campaign creation
      const mockNewCampaign = {
        id: Date.now().toString(),
        ...newCampaign,
        status: newCampaign.send_time === 'now' ? 'active' : 'scheduled',
        created_date: new Date().toISOString(),
        sent_date: newCampaign.send_time === 'now' ? new Date().toISOString() : null,
        recipients_count: 0,
        delivered_count: 0,
        opened_count: 0,
        clicked_count: 0,
        replied_count: 0,
        unsubscribed_count: 0,
        bounced_count: 0,
        created_by: 'Current User'
      };

      setCampaigns(prev => [mockNewCampaign, ...prev]);
      setNewCampaign({
        name: '',
        subject: '',
        template: '',
        recipients: 'all_contacts',
        send_time: 'now',
        scheduled_date: '',
        tags: []
      });
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create campaign:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'broadcast': return '📢';
      case 'sequence': return '🔄';
      case 'newsletter': return '📰';
      default: return '📧';
    }
  };

  const calculateMetrics = (campaign) => {
    if (campaign.delivered_count === 0) return { open_rate: 0, click_rate: 0, reply_rate: 0 };
    
    return {
      open_rate: ((campaign.opened_count / campaign.delivered_count) * 100).toFixed(1),
      click_rate: ((campaign.clicked_count / campaign.delivered_count) * 100).toFixed(1),
      reply_rate: ((campaign.replied_count / campaign.delivered_count) * 100).toFixed(1)
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'all') return true;
    return campaign.status === activeTab;
  });

  const tabs = [
    { id: 'all', name: 'All Campaigns', count: campaigns.length },
    { id: 'active', name: 'Active', count: campaigns.filter(c => c.status === 'active').length },
    { id: 'scheduled', name: 'Scheduled', count: campaigns.filter(c => c.status === 'scheduled').length },
    { id: 'completed', name: 'Completed', count: campaigns.filter(c => c.status === 'completed').length },
    { id: 'draft', name: 'Drafts', count: campaigns.filter(c => c.status === 'draft').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading email campaigns...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Email Campaigns</h1>
                <p className="text-sm text-gray-600">Create and manage email marketing campaigns</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/email-sequences')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Email Sequences
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📧</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-blue-600">{campaignStats.total_campaigns}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🚀</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{campaignStats.active_campaigns}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📤</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-purple-600">{campaignStats.total_sent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👀</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
                <p className="text-2xl font-bold text-orange-600">{campaignStats.avg_open_rate}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👆</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Click Rate</p>
                <p className="text-2xl font-bold text-indigo-600">{campaignStats.avg_click_rate}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">💬</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Reply Rate</p>
                <p className="text-2xl font-bold text-pink-600">{campaignStats.avg_reply_rate}%</p>
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
                {tab.name}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => {
            const metrics = calculateMetrics(campaign);
            return (
              <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(campaign.type)}</span>
                      <h3 className="text-lg font-semibold text-gray-800">{campaign.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Subject: {campaign.subject}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Recipients:</span>
                        <div className="text-gray-900">{campaign.recipients_count.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Delivered:</span>
                        <div className="text-gray-900">{campaign.delivered_count.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Open Rate:</span>
                        <div className="text-green-600 font-medium">{metrics.open_rate}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Click Rate:</span>
                        <div className="text-blue-600 font-medium">{metrics.click_rate}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Replies:</span>
                        <div className="text-purple-600 font-medium">{campaign.replied_count}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Created:</span>
                        <div className="text-gray-900">{formatDate(campaign.created_date)}</div>
                      </div>
                    </div>

                    {campaign.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {campaign.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      View Details
                    </button>
                    {campaign.status === 'draft' && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        Send Now
                      </button>
                    )}
                    {campaign.status === 'active' && (
                      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                        Pause
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                      Duplicate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500">No campaigns found</p>
            <p className="text-sm text-gray-400 mt-1">Create your first email campaign to get started</p>
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create Email Campaign</h2>
                <p className="text-gray-600">Set up a new email marketing campaign</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter campaign name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject</label>
                <input
                  type="text"
                  required
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Template</label>
                <select
                  required
                  value={newCampaign.template}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, template: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <select
                  value={newCampaign.recipients}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, recipients: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all_contacts">All Contacts</option>
                  <option value="high_score">High Lead Score (80+)</option>
                  <option value="healthcare">Healthcare Sector</option>
                  <option value="education">Education Sector</option>
                  <option value="government">Government Sector</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send Time</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="send_time"
                      value="now"
                      checked={newCampaign.send_time === 'now'}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, send_time: e.target.value }))}
                      className="mr-2"
                    />
                    Send immediately
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="send_time"
                      value="scheduled"
                      checked={newCampaign.send_time === 'scheduled'}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, send_time: e.target.value }))}
                      className="mr-2"
                    />
                    Schedule for later
                  </label>
                </div>
                {newCampaign.send_time === 'scheduled' && (
                  <input
                    type="datetime-local"
                    value={newCampaign.scheduled_date}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduled_date: e.target.value }))}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {newCampaign.send_time === 'now' ? 'Create & Send' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCampaign.name}</h2>
                <p className="text-gray-600">{selectedCampaign.subject}</p>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Campaign Details</h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-medium text-gray-700">Status:</dt>
                    <dd className="text-gray-900">{selectedCampaign.status}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Type:</dt>
                    <dd className="text-gray-900">{selectedCampaign.type}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Created:</dt>
                    <dd className="text-gray-900">{formatDate(selectedCampaign.created_date)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Created by:</dt>
                    <dd className="text-gray-900">{selectedCampaign.created_by}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedCampaign.delivered_count}</div>
                    <div className="text-sm text-blue-700">Delivered</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedCampaign.opened_count}</div>
                    <div className="text-sm text-green-700">Opened</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{selectedCampaign.clicked_count}</div>
                    <div className="text-sm text-purple-700">Clicked</div>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">{selectedCampaign.replied_count}</div>
                    <div className="text-sm text-pink-700">Replied</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailCampaigns;