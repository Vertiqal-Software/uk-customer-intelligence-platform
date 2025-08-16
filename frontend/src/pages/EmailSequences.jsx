import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const EmailSequences = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sequences, setSequences] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [showSequenceBuilder, setShowSequenceBuilder] = useState(false);
  const [editingSequence, setEditingSequence] = useState(null);

  const [newSequence, setNewSequence] = useState({
    name: '',
    description: '',
    trigger: 'manual',
    tags: [],
    steps: []
  });

  const [sequenceStats, setSequenceStats] = useState({
    total_sequences: 0,
    active_sequences: 0,
    total_contacts: 0,
    avg_completion_rate: 0,
    avg_response_rate: 0
  });

  useEffect(() => {
    loadSequences();
    loadSequenceStats();
  }, []);

  const loadSequences = async () => {
    try {
      setLoading(true);
      // Mock sequences data - replace with real API call
      const mockSequences = [
        {
          id: '1',
          name: 'Cybersecurity Lead Nurturing',
          description: 'Multi-touch sequence for cybersecurity prospects',
          status: 'active',
          trigger: 'tag_added',
          trigger_value: 'cybersecurity-interest',
          created_date: '2025-01-10T09:00:00Z',
          updated_date: '2025-01-15T14:30:00Z',
          contacts_enrolled: 89,
          contacts_active: 34,
          contacts_completed: 42,
          contacts_replied: 18,
          tags: ['cybersecurity', 'nurturing', 'warm-leads'],
          steps: [
            {
              id: 'step1',
              type: 'email',
              delay: 0,
              delay_unit: 'days',
              subject: 'Welcome! Your cybersecurity assessment is ready',
              template: 'cybersecurity_welcome',
              sent_count: 89,
              opened_count: 67,
              clicked_count: 23,
              replied_count: 8
            },
            {
              id: 'step2',
              type: 'wait',
              delay: 3,
              delay_unit: 'days',
              condition: 'no_reply'
            },
            {
              id: 'step3',
              type: 'email',
              delay: 3,
              delay_unit: 'days',
              subject: 'Case study: How we helped similar companies',
              template: 'cybersecurity_case_study',
              sent_count: 67,
              opened_count: 45,
              clicked_count: 15,
              replied_count: 6
            },
            {
              id: 'step4',
              type: 'wait',
              delay: 5,
              delay_unit: 'days',
              condition: 'no_reply'
            },
            {
              id: 'step5',
              type: 'email',
              delay: 5,
              delay_unit: 'days',
              subject: 'Final follow-up: Your cybersecurity next steps',
              template: 'cybersecurity_final',
              sent_count: 42,
              opened_count: 28,
              clicked_count: 8,
              replied_count: 4
            }
          ],
          created_by: 'Sarah Johnson'
        },
        {
          id: '2',
          name: 'Healthcare IT Follow-up',
          description: 'Follow-up sequence for healthcare prospects after demo',
          status: 'active',
          trigger: 'demo_completed',
          trigger_value: 'healthcare',
          created_date: '2025-01-12T11:20:00Z',
          updated_date: '2025-01-16T09:15:00Z',
          contacts_enrolled: 23,
          contacts_active: 15,
          contacts_completed: 8,
          contacts_replied: 12,
          tags: ['healthcare', 'post-demo', 'hot-leads'],
          steps: [
            {
              id: 'step1',
              type: 'email',
              delay: 1,
              delay_unit: 'hours',
              subject: 'Thank you for your time - Demo materials',
              template: 'healthcare_demo_followup',
              sent_count: 23,
              opened_count: 21,
              clicked_count: 12,
              replied_count: 8
            },
            {
              id: 'step2',
              type: 'wait',
              delay: 2,
              delay_unit: 'days',
              condition: 'no_reply'
            },
            {
              id: 'step3',
              type: 'email',
              delay: 2,
              delay_unit: 'days',
              subject: 'NHS compliance checklist for your review',
              template: 'healthcare_compliance',
              sent_count: 15,
              opened_count: 13,
              clicked_count: 7,
              replied_count: 4
            }
          ],
          created_by: 'John Smith'
        },
        {
          id: '3',
          name: 'Government Tender Opportunity',
          description: 'Outreach sequence for government tender opportunities',
          status: 'paused',
          trigger: 'manual',
          trigger_value: null,
          created_date: '2025-01-08T16:45:00Z',
          updated_date: '2025-01-14T10:20:00Z',
          contacts_enrolled: 156,
          contacts_active: 0,
          contacts_completed: 98,
          contacts_replied: 23,
          tags: ['government', 'tenders', 'cold-outreach'],
          steps: [
            {
              id: 'step1',
              type: 'email',
              delay: 0,
              delay_unit: 'days',
              subject: 'Government tender opportunity in your sector',
              template: 'government_tender_intro',
              sent_count: 156,
              opened_count: 89,
              clicked_count: 34,
              replied_count: 15
            },
            {
              id: 'step2',
              type: 'wait',
              delay: 7,
              delay_unit: 'days',
              condition: 'no_reply'
            },
            {
              id: 'step3',
              type: 'email',
              delay: 7,
              delay_unit: 'days',
              subject: 'Deadline reminder: Tender closes soon',
              template: 'government_tender_reminder',
              sent_count: 98,
              opened_count: 56,
              clicked_count: 18,
              replied_count: 8
            }
          ],
          created_by: 'Michael Brown'
        }
      ];

      setSequences(mockSequences);
    } catch (err) {
      console.error('Failed to load sequences:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSequenceStats = async () => {
    // Mock sequence statistics
    setSequenceStats({
      total_sequences: 8,
      active_sequences: 5,
      total_contacts: 387,
      avg_completion_rate: 67.3,
      avg_response_rate: 15.8
    });
  };

  const handleCreateSequence = async (e) => {
    e.preventDefault();
    try {
      const mockNewSequence = {
        id: Date.now().toString(),
        ...newSequence,
        status: 'draft',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        contacts_enrolled: 0,
        contacts_active: 0,
        contacts_completed: 0,
        contacts_replied: 0,
        steps: [],
        created_by: 'Current User'
      };

      setSequences(prev => [mockNewSequence, ...prev]);
      setNewSequence({
        name: '',
        description: '',
        trigger: 'manual',
        tags: [],
        steps: []
      });
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create sequence:', err);
    }
  };

  const handleEditSequence = (sequence) => {
    setEditingSequence(sequence);
    setShowSequenceBuilder(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTriggerIcon = (trigger) => {
    switch (trigger) {
      case 'manual': return '👤';
      case 'tag_added': return '🏷️';
      case 'demo_completed': return '🎯';
      case 'form_submitted': return '📝';
      default: return '⚡';
    }
  };

  const calculateMetrics = (sequence) => {
    if (sequence.contacts_enrolled === 0) return { completion_rate: 0, response_rate: 0 };
    
    return {
      completion_rate: ((sequence.contacts_completed / sequence.contacts_enrolled) * 100).toFixed(1),
      response_rate: ((sequence.contacts_replied / sequence.contacts_enrolled) * 100).toFixed(1)
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredSequences = sequences.filter(sequence => {
    if (activeTab === 'all') return true;
    return sequence.status === activeTab;
  });

  const tabs = [
    { id: 'all', name: 'All Sequences', count: sequences.length },
    { id: 'active', name: 'Active', count: sequences.filter(s => s.status === 'active').length },
    { id: 'paused', name: 'Paused', count: sequences.filter(s => s.status === 'paused').length },
    { id: 'draft', name: 'Drafts', count: sequences.filter(s => s.status === 'draft').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading email sequences...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Email Sequences</h1>
                <p className="text-sm text-gray-600">Automated multi-touch email workflows</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/email-campaigns')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Email Campaigns
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Sequence
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sequence Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🔄</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sequences</p>
                <p className="text-2xl font-bold text-blue-600">{sequenceStats.total_sequences}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🚀</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{sequenceStats.active_sequences}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👥</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-purple-600">{sequenceStats.total_contacts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-orange-600">{sequenceStats.avg_completion_rate}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">💬</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-pink-600">{sequenceStats.avg_response_rate}%</p>
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

        {/* Sequences List */}
        <div className="space-y-4">
          {filteredSequences.map((sequence) => {
            const metrics = calculateMetrics(sequence);
            return (
              <div key={sequence.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getTriggerIcon(sequence.trigger)}</span>
                      <h3 className="text-lg font-semibold text-gray-800">{sequence.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(sequence.status)}`}>
                        {sequence.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{sequence.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium text-gray-700">Enrolled:</span>
                        <div className="text-gray-900">{sequence.contacts_enrolled}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Active:</span>
                        <div className="text-blue-600 font-medium">{sequence.contacts_active}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Completed:</span>
                        <div className="text-green-600 font-medium">{sequence.contacts_completed}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Completion Rate:</span>
                        <div className="text-orange-600 font-medium">{metrics.completion_rate}%</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Response Rate:</span>
                        <div className="text-purple-600 font-medium">{metrics.response_rate}%</div>
                      </div>
                    </div>

                    {/* Sequence Steps Preview */}
                    <div className="mb-3">
                      <span className="font-medium text-gray-700 text-sm">Steps: </span>
                      <div className="flex items-center space-x-2 mt-1">
                        {sequence.steps.slice(0, 5).map((step, index) => (
                          <div key={step.id} className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              step.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {step.type === 'email' ? '📧' : '⏳'}
                            </div>
                            {index < Math.min(sequence.steps.length - 1, 4) && (
                              <div className="w-4 h-px bg-gray-300 mx-1"></div>
                            )}
                          </div>
                        ))}
                        {sequence.steps.length > 5 && (
                          <span className="text-xs text-gray-500">+{sequence.steps.length - 5} more</span>
                        )}
                      </div>
                    </div>

                    {sequence.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {sequence.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => setSelectedSequence(sequence)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      View Analytics
                    </button>
                    <button
                      onClick={() => handleEditSequence(sequence)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                    >
                      Edit Sequence
                    </button>
                    {sequence.status === 'active' && (
                      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                        Pause
                      </button>
                    )}
                    {sequence.status === 'paused' && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        Activate
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

        {filteredSequences.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-gray-500">No email sequences found</p>
            <p className="text-sm text-gray-400 mt-1">Create your first email sequence to automate follow-ups</p>
          </div>
        )}
      </div>

      {/* Create Sequence Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create Email Sequence</h2>
                <p className="text-gray-600">Set up an automated email workflow</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSequence} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sequence Name</label>
                <input
                  type="text"
                  required
                  value={newSequence.name}
                  onChange={(e) => setNewSequence(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter sequence name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newSequence.description}
                  onChange={(e) => setNewSequence(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe what this sequence does"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trigger</label>
                <select
                  value={newSequence.trigger}
                  onChange={(e) => setNewSequence(prev => ({ ...prev, trigger: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="manual">Manual enrollment</option>
                  <option value="tag_added">Tag added to contact</option>
                  <option value="demo_completed">Demo completed</option>
                  <option value="form_submitted">Form submitted</option>
                  <option value="email_clicked">Email link clicked</option>
                </select>
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
                  Create & Build Steps
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sequence Analytics Modal */}
      {selectedSequence && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedSequence.name}</h2>
                <p className="text-gray-600">{selectedSequence.description}</p>
              </div>
              <button
                onClick={() => setSelectedSequence(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="font-semibold text-gray-800 mb-4">Sequence Steps Performance</h3>
                <div className="space-y-4">
                  {selectedSequence.steps.map((step, index) => (
                    <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                            step.type === 'email' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {step.type === 'email' ? step.subject : `Wait ${step.delay} ${step.delay_unit}`}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {step.type === 'email' ? 'Email' : 'Wait step'}
                              {step.delay > 0 && ` • ${step.delay} ${step.delay_unit} delay`}
                            </p>
                          </div>
                        </div>
                        {step.type === 'email' && (
                          <div className="text-right text-sm">
                            <div className="text-gray-600">Sent: {step.sent_count}</div>
                            <div className="text-green-600">Opened: {step.opened_count}</div>
                            <div className="text-blue-600">Clicked: {step.clicked_count}</div>
                          </div>
                        )}
                      </div>
                      
                      {step.type === 'email' && step.sent_count > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Open Rate: {((step.opened_count / step.sent_count) * 100).toFixed(1)}%</span>
                            <span>Click Rate: {((step.clicked_count / step.sent_count) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(step.opened_count / step.sent_count) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Overall Performance</h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{selectedSequence.contacts_enrolled}</div>
                    <div className="text-sm text-blue-700">Total Enrolled</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{selectedSequence.contacts_active}</div>
                    <div className="text-sm text-green-700">Currently Active</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{selectedSequence.contacts_completed}</div>
                    <div className="text-sm text-purple-700">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-3xl font-bold text-pink-600">{selectedSequence.contacts_replied}</div>
                    <div className="text-sm text-pink-700">Replied</div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => handleEditSequence(selectedSequence)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit Sequence
                  </button>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Add Contacts
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sequence Builder Modal */}
      {showSequenceBuilder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sequence Builder</h2>
                <p className="text-gray-600">Drag and drop to build your email sequence</p>
              </div>
              <button
                onClick={() => setShowSequenceBuilder(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">Advanced Sequence Builder</p>
              <p className="text-sm text-gray-400">This feature is coming soon! You'll be able to create complex email sequences with drag-and-drop functionality, conditional logic, and advanced triggers.</p>
              
              <div className="mt-6 flex justify-center space-x-3">
                <button
                  onClick={() => setShowSequenceBuilder(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailSequences;