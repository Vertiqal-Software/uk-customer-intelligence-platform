import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const ContactDetail = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [contactData, setContactData] = useState({
    engagementHistory: [],
    activities: [],
    emailHistory: [],
    callHistory: [],
    deals: [],
    notes: []
  });

  useEffect(() => {
    loadContactDetails();
  }, [contactId]);

  const loadContactDetails = async () => {
    try {
      setLoading(true);
      // Mock contact data - replace with real API call
      const mockContact = {
        id: contactId,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@techflow.co.uk',
        phone: '+44 20 7123 4567',
        mobile: '+44 7789 123456',
        company: 'TechFlow Solutions Ltd',
        companyId: '12345678',
        jobTitle: 'Chief Technology Officer',
        department: 'Technology',
        seniority: 'Executive',
        location: 'London, UK',
        timezone: 'Europe/London',
        leadScore: 92,
        emailStatus: 'verified',
        phoneStatus: 'verified',
        lastActivity: '2025-01-15T10:30:00Z',
        createdDate: '2024-11-01T09:00:00Z',
        engagementLevel: 'high',
        source: 'Website Form',
        owner: 'Sarah Johnson',
        socialProfiles: {
          linkedin: 'https://linkedin.com/in/johnsmith',
          twitter: '@johnsmith',
          github: 'johnsmith-dev'
        },
        tags: ['decision-maker', 'cybersecurity', 'cloud-migration', 'budget-holder'],
        customFields: {
          budget: '£100K - £500K',
          decisionProcess: 'Committee Decision',
          urgency: 'High',
          painPoints: ['Legacy Infrastructure', 'Security Concerns', 'Compliance Requirements']
        },
        preferences: {
          emailOptIn: true,
          phoneOptIn: true,
          preferredContactMethod: 'email',
          bestTimeToCall: '9:00 AM - 11:00 AM'
        }
      };

      const mockEngagementHistory = [
        {
          id: '1',
          type: 'email',
          action: 'opened',
          subject: 'Cybersecurity Solutions for Healthcare',
          timestamp: '2025-01-15T10:30:00Z',
          details: 'Opened email and clicked on case study link'
        },
        {
          id: '2',
          type: 'website',
          action: 'visited',
          page: '/solutions/cybersecurity',
          timestamp: '2025-01-15T10:45:00Z',
          details: 'Spent 5 minutes on cybersecurity solutions page'
        },
        {
          id: '3',
          type: 'email',
          action: 'replied',
          subject: 'Re: Cybersecurity Solutions for Healthcare',
          timestamp: '2025-01-15T11:15:00Z',
          details: 'Requested demo for next week'
        }
      ];

      const mockActivities = [
        {
          id: '1',
          type: 'call',
          title: 'Discovery Call',
          description: 'Discussed current infrastructure and pain points',
          date: '2025-01-14T14:00:00Z',
          duration: '45 minutes',
          outcome: 'Interested in cybersecurity assessment',
          nextAction: 'Send proposal by Friday'
        },
        {
          id: '2',
          type: 'meeting',
          title: 'Technical Demo',
          description: 'Demonstrated our cybersecurity platform',
          date: '2025-01-12T10:00:00Z',
          duration: '60 minutes',
          outcome: 'Very positive feedback, wants to involve CISO',
          nextAction: 'Schedule follow-up with CISO'
        },
        {
          id: '3',
          type: 'email',
          title: 'Follow-up Email',
          description: 'Sent additional case studies and pricing',
          date: '2025-01-11T09:30:00Z',
          outcome: 'Email opened multiple times',
          nextAction: 'Phone call scheduled for Thursday'
        }
      ];

      setContact(mockContact);
      setContactData({
        engagementHistory: mockEngagementHistory,
        activities: mockActivities,
        emailHistory: mockEngagementHistory.filter(e => e.type === 'email'),
        callHistory: mockActivities.filter(a => a.type === 'call'),
        deals: [],
        notes: []
      });
    } catch (err) {
      setError('Failed to load contact details');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getEngagementColor = (level) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '👤' },
    { id: 'engagement', name: 'Engagement', icon: '📈' },
    { id: 'activities', name: 'Activities', icon: '📝' },
    { id: 'deals', name: 'Deals', icon: '💼' },
    { id: 'notes', name: 'Notes', icon: '📋' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact details...</p>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/contacts')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Contacts
          </button>
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
                onClick={() => navigate('/contacts')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Contacts
              </button>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">
                  {contact.firstName[0]}{contact.lastName[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </h1>
                  <p className="text-sm text-gray-600">{contact.jobTitle} at {contact.company}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(contact.leadScore)}`}>
                Score: {contact.leadScore}/100
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEngagementColor(contact.engagementLevel)}`}>
                {contact.engagementLevel} engagement
              </span>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Send Email
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add to Sequence
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Schedule Call
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Info Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{contact.email}</div>
              <div className="text-xs text-gray-600">Primary Email</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{contact.phone}</div>
              <div className="text-xs text-gray-600">Phone Number</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{contact.location}</div>
              <div className="text-xs text-gray-600">Location</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{formatDateShort(contact.lastActivity)}</div>
              <div className="text-xs text-gray-600">Last Activity</div>
            </div>
          </div>
        </div>
      </div>

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
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.firstName} {contact.lastName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Mobile</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.mobile}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Timezone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.timezone}</dd>
                  </div>
                </dl>
              </div>

              {/* Company Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <button 
                        onClick={() => navigate(`/company/${contact.companyId}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {contact.company}
                      </button>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Job Title</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.jobTitle}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.department}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Seniority</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.seniority}</dd>
                  </div>
                </dl>
              </div>

              {/* Social Profiles */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Profiles</h3>
                <div className="flex space-x-4">
                  {contact.socialProfiles.linkedin && (
                    <a 
                      href={contact.socialProfiles.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                    >
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {contact.socialProfiles.twitter && (
                    <a 
                      href={`https://twitter.com/${contact.socialProfiles.twitter.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100"
                    >
                      <span>Twitter</span>
                    </a>
                  )}
                  {contact.socialProfiles.github && (
                    <a 
                      href={`https://github.com/${contact.socialProfiles.github}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Score */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Contact Score</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{contact.leadScore}/100</div>
                  <div className="text-sm text-gray-600">Lead Score</div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${contact.leadScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Compose Email
                  </button>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Schedule Call
                  </button>
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Add to Sequence
                  </button>
                  <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    Create Task
                  </button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Contact Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Source:</span>
                    <div className="text-gray-900">{contact.source}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Owner:</span>
                    <div className="text-gray-900">{contact.owner}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <div className="text-gray-900">{formatDate(contact.createdDate)}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Activity:</span>
                    <div className="text-gray-900">{formatDate(contact.lastActivity)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'engagement' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Engagement Timeline</h3>
            <div className="space-y-4">
              {contactData.engagementHistory.map((engagement) => (
                <div key={engagement.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      engagement.type === 'email' ? 'bg-green-500' : 
                      engagement.type === 'website' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      {engagement.type === 'email' ? '📧' : 
                       engagement.type === 'website' ? '🌐' : '📞'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800 capitalize">{engagement.action} {engagement.type}</h4>
                      <span className="text-sm text-gray-500">{formatDateShort(engagement.timestamp)}</span>
                    </div>
                    {engagement.subject && (
                      <p className="text-sm text-gray-600 mt-1">Subject: {engagement.subject}</p>
                    )}
                    {engagement.page && (
                      <p className="text-sm text-gray-600 mt-1">Page: {engagement.page}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">{engagement.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Activities</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Log Activity
              </button>
            </div>
            <div className="space-y-4">
              {contactData.activities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        activity.type === 'call' ? 'bg-green-500' : 
                        activity.type === 'meeting' ? 'bg-blue-500' : 
                        activity.type === 'email' ? 'bg-purple-500' : 'bg-gray-500'
                      }`}>
                        {activity.type === 'call' ? '📞' : 
                         activity.type === 'meeting' ? '🤝' : 
                         activity.type === 'email' ? '📧' : '📝'}
                      </div>
                      <h4 className="font-medium text-gray-800">{activity.title}</h4>
                    </div>
                    <span className="text-sm text-gray-500">{formatDateShort(activity.date)}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{activity.description}</p>
                  {activity.duration && (
                    <p className="text-sm text-gray-500 mb-2">Duration: {activity.duration}</p>
                  )}
                  {activity.outcome && (
                    <div className="bg-green-50 p-3 rounded-lg mb-2">
                      <span className="font-medium text-green-800">Outcome:</span>
                      <span className="text-green-700 ml-1">{activity.outcome}</span>
                    </div>
                  )}
                  {activity.nextAction && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-medium text-blue-800">Next Action:</span>
                      <span className="text-blue-700 ml-1">{activity.nextAction}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Associated Deals</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Deal
              </button>
            </div>
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-500">No deals associated with this contact</p>
              <p className="text-sm text-gray-400 mt-1">Create a deal to start tracking opportunities</p>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Note
              </button>
            </div>
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No notes for this contact</p>
              <p className="text-sm text-gray-400 mt-1">Add notes to keep track of important information</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContactDetail;