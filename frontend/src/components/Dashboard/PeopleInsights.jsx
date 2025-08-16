import React, { useState, useEffect } from 'react';
import { Users, User, Mail, Phone, Calendar, Building2, TrendingUp, MessageSquare, Star, Filter, Search, Plus, ExternalLink, Clock, MapPin, Linkedin, Twitter, Send } from 'lucide-react';

const PeopleInsights = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedRelationship, setSelectedRelationship] = useState('all');
  const [sortBy, setSortBy] = useState('lastContact');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockContacts = [
      {
        id: 1,
        name: 'Ken Murphy',
        role: 'Chief Executive Officer',
        company: 'Tesco PLC',
        email: 'ken.murphy@tesco.com',
        phone: '+44 20 7946 0123',
        avatar: null,
        location: 'London, England',
        lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        nextFollowUp: '2024-08-20',
        relationshipStrength: 8.5,
        interactionFrequency: 'Weekly',
        preferredContact: 'Email',
        linkedIn: 'https://linkedin.com/in/kenmurphy',
        twitter: '@KenMurphyCEO',
        department: 'Executive',
        seniority: 'C-Level',
        influence: 'High',
        decisionMaker: true,
        tags: ['Strategic', 'Decision Maker', 'Innovation'],
        interests: ['Digital Transformation', 'Sustainability', 'Customer Experience'],
        recentInteractions: [
          {
            type: 'meeting',
            description: 'Quarterly business review',
            date: '2024-08-13',
            outcome: 'Positive discussion about Q3 goals'
          },
          {
            type: 'email',
            description: 'Follow-up on digital initiative',
            date: '2024-08-10',
            outcome: 'Awaiting budget approval'
          }
        ],
        connectedOpportunities: ['ASDA Digital Infrastructure Upgrade'],
        notes: 'Very interested in AI and automation solutions. Key decision maker for technology investments.',
        communicationStyle: 'Direct and data-driven',
        goals: ['Improve operational efficiency', 'Enhance customer experience'],
        challenges: ['Budget constraints', 'Legacy system integration']
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        role: 'Head of Procurement',
        company: 'ASDA',
        email: 'sarah.johnson@asda.com',
        phone: '+44 113 496 2000',
        avatar: null,
        location: 'Leeds, England',
        lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        nextFollowUp: '2024-08-19',
        relationshipStrength: 9.2,
        interactionFrequency: 'Bi-weekly',
        preferredContact: 'Phone',
        linkedIn: 'https://linkedin.com/in/sarahjohnson',
        twitter: null,
        department: 'Operations',
        seniority: 'Senior Management',
        influence: 'High',
        decisionMaker: true,
        tags: ['Technical', 'Procurement', 'Analytical'],
        interests: ['Supply Chain', 'Cost Optimization', 'Vendor Management'],
        recentInteractions: [
          {
            type: 'call',
            description: 'Technical requirements discussion',
            date: '2024-08-15',
            outcome: 'Outlined key requirements for digital upgrade'
          },
          {
            type: 'demo',
            description: 'Platform demonstration',
            date: '2024-08-12',
            outcome: 'Very impressed with capabilities'
          }
        ],
        connectedOpportunities: ['ASDA Digital Infrastructure Upgrade'],
        notes: 'Highly technical and detail-oriented. Values comprehensive documentation and proof of concept.',
        communicationStyle: 'Analytical and thorough',
        goals: ['Modernize infrastructure', 'Reduce operational costs'],
        challenges: ['Integration complexity', 'Change management']
      },
      {
        id: 3,
        name: 'David Smith',
        role: 'Customer Experience Director',
        company: 'Marks & Spencer',
        email: 'david.smith@marksandspencer.com',
        phone: '+44 20 7935 4422',
        avatar: null,
        location: 'London, England',
        lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        nextFollowUp: '2024-08-18',
        relationshipStrength: 7.8,
        interactionFrequency: 'Monthly',
        preferredContact: 'Email',
        linkedIn: 'https://linkedin.com/in/davidsmith',
        twitter: '@DavidSmithCX',
        department: 'Marketing',
        seniority: 'Senior Management',
        influence: 'Medium',
        decisionMaker: false,
        tags: ['Customer Focus', 'Digital', 'Innovation'],
        interests: ['Customer Journey', 'Personalization', 'Omnichannel'],
        recentInteractions: [
          {
            type: 'meeting',
            description: 'Customer experience strategy session',
            date: '2024-08-14',
            outcome: 'Aligned on platform requirements'
          },
          {
            type: 'email',
            description: 'Contract terms discussion',
            date: '2024-08-11',
            outcome: 'Minor revisions requested'
          }
        ],
        connectedOpportunities: ['Marks & Spencer Customer Experience Platform'],
        notes: 'Passionate about customer experience and digital innovation. Good internal advocate.',
        communicationStyle: 'Collaborative and enthusiastic',
        goals: ['Improve customer satisfaction', 'Increase conversion rates'],
        challenges: ['Budget limitations', 'Internal buy-in']
      },
      {
        id: 4,
        name: 'Rachel Green',
        role: 'Supply Chain Director',
        company: 'Sainsbury\'s',
        email: 'rachel.green@sainsburys.co.uk',
        phone: '+44 20 7695 6000',
        avatar: null,
        location: 'London, England',
        lastContact: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        nextFollowUp: '2024-08-22',
        relationshipStrength: 6.5,
        interactionFrequency: 'Monthly',
        preferredContact: 'Email',
        linkedIn: 'https://linkedin.com/in/rachelgreen',
        twitter: null,
        department: 'Operations',
        seniority: 'Senior Management',
        influence: 'High',
        decisionMaker: true,
        tags: ['Analytical', 'Results-Driven', 'Strategic'],
        interests: ['Supply Chain Optimization', 'AI/ML', 'Sustainability'],
        recentInteractions: [
          {
            type: 'email',
            description: 'Initial inquiry about optimization solutions',
            date: '2024-08-08',
            outcome: 'Interested in learning more'
          }
        ],
        connectedOpportunities: ['Sainsbury\'s Supply Chain Optimization'],
        notes: 'Very data-driven and focused on measurable outcomes. Skeptical but open to innovative solutions.',
        communicationStyle: 'Direct and fact-based',
        goals: ['Reduce waste', 'Optimize inventory levels'],
        challenges: ['Complex legacy systems', 'ROI justification']
      },
      {
        id: 5,
        name: 'Jennifer White',
        role: 'Chief Information Security Officer',
        company: 'Tesco PLC',
        email: 'jennifer.white@tesco.com',
        phone: '+44 20 7946 0156',
        avatar: null,
        location: 'Hertfordshire, England',
        lastContact: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        nextFollowUp: '2024-08-25',
        relationshipStrength: 5.2,
        interactionFrequency: 'Quarterly',
        preferredContact: 'Meeting',
        linkedIn: 'https://linkedin.com/in/jenniferwhite',
        twitter: null,
        department: 'IT',
        seniority: 'C-Level',
        influence: 'High',
        decisionMaker: true,
        tags: ['Security', 'Compliance', 'Risk Management'],
        interests: ['Cybersecurity', 'Compliance', 'Risk Assessment'],
        recentInteractions: [
          {
            type: 'meeting',
            description: 'Security assessment discussion',
            date: '2024-08-06',
            outcome: 'Requested detailed security documentation'
          }
        ],
        connectedOpportunities: ['Tesco Security Infrastructure Upgrade'],
        notes: 'Extremely security-conscious and thorough in evaluation process. Requires comprehensive compliance documentation.',
        communicationStyle: 'Cautious and methodical',
        goals: ['Enhance security posture', 'Ensure compliance'],
        challenges: ['Budget constraints', 'Regulatory requirements']
      },
      {
        id: 6,
        name: 'Paul Johnson',
        role: 'Data Director',
        company: 'John Lewis',
        email: 'paul.johnson@johnlewis.co.uk',
        phone: '+44 20 7629 7711',
        avatar: null,
        location: 'London, England',
        lastContact: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        nextFollowUp: '2024-08-28',
        relationshipStrength: 4.8,
        interactionFrequency: 'Quarterly',
        preferredContact: 'Email',
        linkedIn: 'https://linkedin.com/in/pauljohnson',
        twitter: '@PaulJohnsonData',
        department: 'IT',
        seniority: 'Senior Management',
        influence: 'Medium',
        decisionMaker: false,
        tags: ['Data Science', 'Analytics', 'Technical'],
        interests: ['Business Intelligence', 'Data Visualization', 'Machine Learning'],
        recentInteractions: [
          {
            type: 'email',
            description: 'Follow-up on BI platform proposal',
            date: '2024-08-01',
            outcome: 'Requested additional time for evaluation'
          }
        ],
        connectedOpportunities: ['John Lewis Data Analytics Initiative'],
        notes: 'Technical expert with strong analytical background. Tends to be cautious with new technology adoption.',
        communicationStyle: 'Technical and detailed',
        goals: ['Improve data insights', 'Enhance reporting capabilities'],
        challenges: ['Resource constraints', 'Long approval process']
      }
    ];

    setTimeout(() => {
      setContacts(mockContacts);
      setFilteredContacts(mockContacts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort contacts
  useEffect(() => {
    let filtered = contacts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Company filter
    if (selectedCompany !== 'all') {
      filtered = filtered.filter(contact => contact.company === selectedCompany);
    }

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(contact => contact.seniority === selectedRole);
    }

    // Relationship filter
    if (selectedRelationship !== 'all') {
      if (selectedRelationship === 'strong') {
        filtered = filtered.filter(contact => contact.relationshipStrength >= 8);
      } else if (selectedRelationship === 'medium') {
        filtered = filtered.filter(contact => contact.relationshipStrength >= 6 && contact.relationshipStrength < 8);
      } else if (selectedRelationship === 'weak') {
        filtered = filtered.filter(contact => contact.relationshipStrength < 6);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'lastContact':
          return new Date(b.lastContact) - new Date(a.lastContact);
        case 'relationship':
          return b.relationshipStrength - a.relationshipStrength;
        case 'influence':
          const influenceOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return influenceOrder[b.influence] - influenceOrder[a.influence];
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, selectedCompany, selectedRole, selectedRelationship, sortBy]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRelationshipColor = (strength) => {
    if (strength >= 8) return 'text-green-600 bg-green-100';
    if (strength >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getInfluenceColor = (influence) => {
    switch (influence) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUniqueCompanies = () => {
    return [...new Set(contacts.map(contact => contact.company))];
  };

  const getUniqueSeniorities = () => {
    return [...new Set(contacts.map(contact => contact.seniority))];
  };

  const calculateAverageRelationship = () => {
    if (filteredContacts.length === 0) return 0;
    return filteredContacts.reduce((sum, contact) => sum + contact.relationshipStrength, 0) / filteredContacts.length;
  };

  const getUpcomingFollowUps = () => {
    return filteredContacts.filter(contact => {
      const followUpDate = new Date(contact.nextFollowUp);
      const today = new Date();
      const daysDiff = (followUpDate - today) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7 && daysDiff >= 0;
    }).length;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            People Insights
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              {viewMode === 'grid' ? 'List' : 'Grid'} View
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Contacts</p>
                <p className="text-2xl font-bold text-blue-900">{filteredContacts.length}</p>
              </div>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Avg. Relationship</p>
                <p className="text-2xl font-bold text-green-900">{calculateAverageRelationship().toFixed(1)}/10</p>
              </div>
              <Star className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Follow-ups Due</p>
                <p className="text-2xl font-bold text-yellow-900">{getUpcomingFollowUps()}</p>
              </div>
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Decision Makers</p>
                <p className="text-2xl font-bold text-purple-900">
                  {filteredContacts.filter(c => c.decisionMaker).length}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Companies</option>
            {getUniqueCompanies().map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            {getUniqueSeniorities().map(seniority => (
              <option key={seniority} value={seniority}>{seniority}</option>
            ))}
          </select>

          <select
            value={selectedRelationship}
            onChange={(e) => setSelectedRelationship(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Relationships</option>
            <option value="strong">Strong (8-10)</option>
            <option value="medium">Medium (6-8)</option>
            <option value="weak">Weak (0-6)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="lastContact">Last Contact</option>
            <option value="relationship">Relationship Strength</option>
            <option value="influence">Influence</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Contacts Display */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No contacts match your filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white cursor-pointer"
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {contact.avatar ? (
                        <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.role}</p>
                      <p className="text-sm font-medium text-blue-600">{contact.company}</p>
                    </div>
                  </div>
                  {contact.decisionMaker && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                      Decision Maker
                    </span>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{contact.location}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Relationship</p>
                    <div className="flex items-center space-x-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${contact.relationshipStrength >= 8 ? 'bg-green-500' : contact.relationshipStrength >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${contact.relationshipStrength * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{contact.relationshipStrength}/10</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Influence</p>
                    <span className={`text-xs font-medium px-1 py-0.5 rounded ${getInfluenceColor(contact.influence)}`}>
                      {contact.influence}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {contact.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {contact.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{contact.tags.length - 3}</span>
                  )}
                </div>

                {/* Last Contact */}
                <div className="text-xs text-gray-500">
                  Last contact: {formatDate(contact.lastContact)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white cursor-pointer"
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {contact.avatar ? (
                        <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <span className="text-sm text-gray-600">{contact.role}</span>
                        <span className="text-sm font-medium text-blue-600">{contact.company}</span>
                        {contact.decisionMaker && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                            Decision Maker
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">{contact.email}</span>
                        <span className="text-sm text-gray-600">{contact.location}</span>
                        <span className="text-sm text-gray-500">Last contact: {formatDate(contact.lastContact)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Relationship: {contact.relationshipStrength}/10</p>
                      <p className="text-sm text-gray-600">Influence: {contact.influence}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    {selectedContact.avatar ? (
                      <img src={selectedContact.avatar} alt={selectedContact.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedContact.name}</h2>
                    <p className="text-gray-600">{selectedContact.role}</p>
                    <p className="text-lg font-medium text-blue-600">{selectedContact.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedContact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{selectedContact.location}</span>
                    </div>
                    {selectedContact.linkedIn && (
                      <div className="flex items-center space-x-3">
                        <Linkedin className="w-5 h-5 text-gray-400" />
                        <a href={selectedContact.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Professional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">{selectedContact.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Seniority</p>
                      <p className="font-medium">{selectedContact.seniority}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Influence</p>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getInfluenceColor(selectedContact.influence)}`}>
                        {selectedContact.influence}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Preferred Contact</p>
                      <p className="font-medium">{selectedContact.preferredContact}</p>
                    </div>
                  </div>
                </div>

                {/* Relationship & Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationship Insights</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Relationship Strength</p>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${selectedContact.relationshipStrength >= 8 ? 'bg-green-500' : selectedContact.relationshipStrength >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${selectedContact.relationshipStrength * 10}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{selectedContact.relationshipStrength}/10</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Interaction Frequency</p>
                        <p className="font-medium">{selectedContact.interactionFrequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Follow-up</p>
                        <p className="font-medium">{formatDate(selectedContact.nextFollowUp)}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Recent Interactions</h3>
                  <div className="space-y-3">
                    {selectedContact.recentInteractions.map((interaction, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">{interaction.type}</span>
                          <span className="text-sm text-gray-500">{formatDate(interaction.date)}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{interaction.description}</p>
                        <p className="text-sm text-green-600">{interaction.outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests & Goals</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Interests</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedContact.interests.map((interest, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Goals</p>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedContact.goals.map((goal, index) => (
                            <li key={index} className="text-sm text-gray-700">{goal}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes & Challenges</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedContact.notes}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Challenges</p>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedContact.challenges.map((challenge, index) => (
                            <li key={index} className="text-sm text-gray-700">{challenge}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Meeting</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Quick Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {filteredContacts.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredContacts.length} of {contacts.length} contacts</span>
            <span>
              {getUpcomingFollowUps()} follow-ups due this week • 
              Avg. relationship strength: {calculateAverageRelationship().toFixed(1)}/10
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleInsights;