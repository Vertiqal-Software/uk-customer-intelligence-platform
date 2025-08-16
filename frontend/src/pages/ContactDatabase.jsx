import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const ContactDatabase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showEnrichmentModal, setShowEnrichmentModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    jobTitle: '',
    company: '',
    industry: '',
    location: '',
    emailStatus: 'all',
    phoneStatus: 'all',
    leadScore: 'all',
    lastActivity: 'all'
  });
  const [sortBy, setSortBy] = useState('lastActivity');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0
  });

  useEffect(() => {
    loadContacts();
  }, [filters, sortBy, sortOrder, pagination.page]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      // Mock contact data - replace with real API call
      const mockContacts = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@techflow.co.uk',
          phone: '+44 20 7123 4567',
          company: 'TechFlow Solutions Ltd',
          jobTitle: 'CTO',
          department: 'Technology',
          seniority: 'Executive',
          location: 'London, UK',
          leadScore: 92,
          emailStatus: 'verified',
          phoneStatus: 'verified',
          lastActivity: '2025-01-15T10:30:00Z',
          engagementLevel: 'high',
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/johnsmith',
            twitter: '@johnsmith'
          },
          tags: ['decision-maker', 'cybersecurity', 'cloud-migration']
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@healthtech.nhs.uk',
          phone: '+44 161 987 6543',
          company: 'NHS Digital Health Trust',
          jobTitle: 'Digital Transformation Director',
          department: 'IT',
          seniority: 'Director',
          location: 'Manchester, UK',
          leadScore: 87,
          emailStatus: 'verified',
          phoneStatus: 'unverified',
          lastActivity: '2025-01-14T15:45:00Z',
          engagementLevel: 'medium',
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/sarahjohnson'
          },
          tags: ['healthcare', 'digital-transformation', 'nhs']
        },
        {
          id: '3',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.brown@edutech.ac.uk',
          phone: '',
          company: 'University of Cambridge',
          jobTitle: 'Head of IT Services',
          department: 'IT',
          seniority: 'Manager',
          location: 'Cambridge, UK',
          leadScore: 74,
          emailStatus: 'verified',
          phoneStatus: 'missing',
          lastActivity: '2025-01-13T09:20:00Z',
          engagementLevel: 'low',
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/michaelbrown'
          },
          tags: ['education', 'university', 'infrastructure']
        }
      ];
      
      setContacts(mockContacts);
      setPagination(prev => ({ ...prev, total: mockContacts.length }));
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c.id === contact.id);
      if (isSelected) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts([...contacts]);
    }
  };

  const handleBulkAction = async (action) => {
    switch (action) {
      case 'add-to-sequence':
        // Navigate to sequence selection
        navigate('/email-sequences/assign', { state: { contacts: selectedContacts } });
        break;
      case 'add-to-list':
        // Show list selection modal
        break;
      case 'export':
        // Export selected contacts
        break;
      case 'enrich':
        setShowEnrichmentModal(true);
        break;
      default:
        break;
    }
  };

  const getLeadScoreColor = (score) => {
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contacts...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Contact Database</h1>
                <p className="text-sm text-gray-600">Manage and enrich your contact database</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {selectedContacts.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedContacts.length} selected
                  </span>
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                  >
                    Bulk Actions
                  </button>
                </div>
              )}
              <button
                onClick={() => navigate('/contacts/import')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Import Contacts
              </button>
              <button
                onClick={() => navigate('/contacts/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <input
                type="text"
                placeholder="Search contacts..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filters.jobTitle}
                onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Job Titles</option>
                <option value="cto">CTO</option>
                <option value="cio">CIO</option>
                <option value="director">Director</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <select
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Industries</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="government">Government</option>
              </select>
            </div>
            <div>
              <select
                value={filters.leadScore}
                onChange={(e) => setFilters({ ...filters, leadScore: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Scores</option>
                <option value="high">High (80+)</option>
                <option value="medium">Medium (60-79)</option>
                <option value="low">Low (0-59)</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lastActivity">Last Activity</option>
                <option value="leadScore">Lead Score</option>
                <option value="firstName">Name</option>
                <option value="company">Company</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {contacts.length} contacts found
            </div>
          </div>
        </div>

        {/* Bulk Actions Panel */}
        {showBulkActions && selectedContacts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">
                {selectedContacts.length} contacts selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('add-to-sequence')}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Add to Sequence
                </button>
                <button
                  onClick={() => handleBulkAction('add-to-list')}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Add to List
                </button>
                <button
                  onClick={() => handleBulkAction('enrich')}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  Enrich Data
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === contacts.length && contacts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedContacts.some(c => c.id === contact.id)}
                        onChange={() => handleContactSelect(contact)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            {contact.firstName[0]}{contact.lastName[0]}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{contact.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contact.company}</div>
                      <div className="text-sm text-gray-500">{contact.jobTitle}</div>
                      <div className="text-sm text-gray-500">{contact.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.email}</div>
                      <div className="text-sm text-gray-500">{contact.phone || 'No phone'}</div>
                      <div className="flex space-x-1 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contact.emailStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          📧 {contact.emailStatus}
                        </span>
                        {contact.phone && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            contact.phoneStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            📞 {contact.phoneStatus}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getLeadScoreColor(contact.leadScore)}`}>
                          {contact.leadScore}/100
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getEngagementColor(contact.engagementLevel)}`}>
                          {contact.engagementLevel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.lastActivity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/contacts/${contact.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Email
                        </button>
                        <button className="text-purple-600 hover:text-purple-900">
                          Add to Sequence
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{contacts.length}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Enrichment Modal */}
      {showEnrichmentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Enrich Contact Data</h3>
            <p className="text-gray-600 mb-4">
              Enhance {selectedContacts.length} contacts with additional information like verified emails, phone numbers, and social profiles.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEnrichmentModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle enrichment
                  setShowEnrichmentModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Enrichment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDatabase;