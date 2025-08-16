import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, DollarSign, Users, Filter, Search, Plus, Star, Clock, Building2, ArrowRight, Eye, Edit } from 'lucide-react';

const OpportunityList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [viewMode, setViewMode] = useState('list'); // list or kanban

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockOpportunities = [
      {
        id: 1,
        title: 'ASDA Digital Infrastructure Upgrade',
        company: 'ASDA',
        description: 'Comprehensive digital transformation project including cloud migration, POS system upgrade, and customer analytics platform implementation.',
        value: 2400000,
        stage: 'proposal',
        priority: 'high',
        probability: 75,
        expectedCloseDate: '2024-09-15',
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        nextActivity: {
          type: 'meeting',
          description: 'Technical requirements review',
          date: '2024-08-20'
        },
        owner: 'Sarah Johnson',
        contacts: [
          { name: 'Mike Wilson', role: 'IT Director' },
          { name: 'Emma Davis', role: 'Chief Technology Officer' }
        ],
        products: ['Cloud Services', 'Analytics Platform', 'POS Systems'],
        tags: ['Digital Transformation', 'Cloud Migration', 'Analytics'],
        source: 'Referral',
        competitorActivity: 'Medium',
        riskFactors: ['Budget constraints', 'Timeline pressure'],
        winProbabilityHistory: [
          { date: '2024-07-01', probability: 40 },
          { date: '2024-07-15', probability: 55 },
          { date: '2024-08-01', probability: 65 },
          { date: '2024-08-15', probability: 75 }
        ]
      },
      {
        id: 2,
        title: 'Sainsbury\'s Supply Chain Optimization',
        company: 'Sainsbury\'s',
        description: 'AI-powered inventory management system to optimize stock levels and reduce waste across 600+ stores.',
        value: 1850000,
        stage: 'qualification',
        priority: 'high',
        probability: 60,
        expectedCloseDate: '2024-10-30',
        lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        nextActivity: {
          type: 'demo',
          description: 'Solution demonstration',
          date: '2024-08-22'
        },
        owner: 'James Mitchell',
        contacts: [
          { name: 'Rachel Green', role: 'Supply Chain Director' },
          { name: 'Tom Anderson', role: 'Operations Manager' }
        ],
        products: ['AI Analytics', 'Inventory Management', 'Forecasting Tools'],
        tags: ['AI', 'Supply Chain', 'Optimization'],
        source: 'Cold Outreach',
        competitorActivity: 'High',
        riskFactors: ['Strong competition', 'Complex integration'],
        winProbabilityHistory: [
          { date: '2024-07-01', probability: 30 },
          { date: '2024-07-15', probability: 45 },
          { date: '2024-08-01', probability: 55 },
          { date: '2024-08-15', probability: 60 }
        ]
      },
      {
        id: 3,
        title: 'Marks & Spencer Customer Experience Platform',
        company: 'Marks & Spencer',
        description: 'Omnichannel customer experience platform integrating online and in-store interactions with personalized recommendations.',
        value: 980000,
        stage: 'negotiation',
        priority: 'medium',
        probability: 85,
        expectedCloseDate: '2024-08-30',
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        nextActivity: {
          type: 'contract',
          description: 'Contract finalization',
          date: '2024-08-18'
        },
        owner: 'Lisa Chen',
        contacts: [
          { name: 'David Smith', role: 'Customer Experience Director' },
          { name: 'Anna Thompson', role: 'Digital Marketing Manager' }
        ],
        products: ['CX Platform', 'Personalization Engine', 'Analytics'],
        tags: ['Customer Experience', 'Omnichannel', 'Personalization'],
        source: 'Existing Relationship',
        competitorActivity: 'Low',
        riskFactors: ['Budget approval pending'],
        winProbabilityHistory: [
          { date: '2024-07-01', probability: 70 },
          { date: '2024-07-15', probability: 75 },
          { date: '2024-08-01', probability: 80 },
          { date: '2024-08-15', probability: 85 }
        ]
      },
      {
        id: 4,
        title: 'Tesco Security Infrastructure Upgrade',
        company: 'Tesco PLC',
        description: 'Comprehensive cybersecurity overhaul including endpoint protection, network security, and staff training programs.',
        value: 1250000,
        stage: 'discovery',
        priority: 'medium',
        probability: 45,
        expectedCloseDate: '2024-11-15',
        lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextActivity: {
          type: 'assessment',
          description: 'Security assessment workshop',
          date: '2024-08-25'
        },
        owner: 'Michael Brown',
        contacts: [
          { name: 'Jennifer White', role: 'CISO' },
          { name: 'Robert Clark', role: 'Infrastructure Manager' }
        ],
        products: ['Security Platform', 'Endpoint Protection', 'Training'],
        tags: ['Cybersecurity', 'Infrastructure', 'Training'],
        source: 'Inbound Inquiry',
        competitorActivity: 'Medium',
        riskFactors: ['Regulatory compliance requirements'],
        winProbabilityHistory: [
          { date: '2024-07-01', probability: 25 },
          { date: '2024-07-15', probability: 35 },
          { date: '2024-08-01', probability: 40 },
          { date: '2024-08-15', probability: 45 }
        ]
      },
      {
        id: 5,
        title: 'John Lewis Data Analytics Initiative',
        company: 'John Lewis',
        description: 'Business intelligence platform to analyze customer behavior, sales trends, and operational efficiency across all channels.',
        value: 750000,
        stage: 'proposal',
        priority: 'low',
        probability: 35,
        expectedCloseDate: '2024-12-20',
        lastActivity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        nextActivity: {
          type: 'follow-up',
          description: 'Proposal review meeting',
          date: '2024-08-28'
        },
        owner: 'Emma Davis',
        contacts: [
          { name: 'Paul Johnson', role: 'Data Director' },
          { name: 'Sophie Wilson', role: 'Business Analyst' }
        ],
        products: ['BI Platform', 'Data Visualization', 'Reporting Tools'],
        tags: ['Business Intelligence', 'Data Analytics', 'Reporting'],
        source: 'Partner Referral',
        competitorActivity: 'Low',
        riskFactors: ['Budget uncertainty', 'Long decision cycle'],
        winProbabilityHistory: [
          { date: '2024-07-01', probability: 20 },
          { date: '2024-07-15', probability: 25 },
          { date: '2024-08-01', probability: 30 },
          { date: '2024-08-15', probability: 35 }
        ]
      }
    ];

    setTimeout(() => {
      setOpportunities(mockOpportunities);
      setFilteredOpportunities(mockOpportunities);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort opportunities
  useEffect(() => {
    let filtered = opportunities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Stage filter
    if (selectedStage !== 'all') {
      filtered = filtered.filter(opp => opp.stage === selectedStage);
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(opp => opp.priority === selectedPriority);
    }

    // Owner filter
    if (selectedOwner !== 'all') {
      filtered = filtered.filter(opp => opp.owner === selectedOwner);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'value':
          return b.value - a.value;
        case 'probability':
          return b.probability - a.probability;
        case 'closeDate':
          return new Date(a.expectedCloseDate) - new Date(b.expectedCloseDate);
        default:
          return 0;
      }
    });

    setFilteredOpportunities(filtered);
  }, [opportunities, searchTerm, selectedStage, selectedPriority, selectedOwner, sortBy]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'discovery': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'qualification': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'proposal': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'negotiation': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'closed-won': return 'text-green-600 bg-green-100 border-green-200';
      case 'closed-lost': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 75) return 'text-green-600 bg-green-100';
    if (probability >= 50) return 'text-yellow-600 bg-yellow-100';
    if (probability >= 25) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getUniqueOwners = () => {
    return [...new Set(opportunities.map(opp => opp.owner))];
  };

  const calculateTotalValue = () => {
    return filteredOpportunities.reduce((total, opp) => total + opp.value, 0);
  };

  const calculateWeightedValue = () => {
    return filteredOpportunities.reduce((total, opp) => total + (opp.value * opp.probability / 100), 0);
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
            <Target className="w-5 h-5 mr-2" />
            Sales Opportunities
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'kanban' : 'list')}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
            >
              {viewMode === 'list' ? 'Kanban' : 'List'} View
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Opportunity</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Pipeline</p>
                <p className="text-xl font-bold text-blue-900">{formatCurrency(calculateTotalValue())}</p>
              </div>
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Weighted Value</p>
                <p className="text-xl font-bold text-green-900">{formatCurrency(calculateWeightedValue())}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Active Opportunities</p>
                <p className="text-xl font-bold text-purple-900">{filteredOpportunities.length}</p>
              </div>
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Avg. Probability</p>
                <p className="text-xl font-bold text-orange-900">
                  {filteredOpportunities.length > 0 
                    ? Math.round(filteredOpportunities.reduce((sum, opp) => sum + opp.probability, 0) / filteredOpportunities.length)
                    : 0}%
                </p>
              </div>
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Stages</option>
            <option value="discovery">Discovery</option>
            <option value="qualification">Qualification</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Owners</option>
            {getUniqueOwners().map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="priority">Sort by Priority</option>
            <option value="value">Sort by Value</option>
            <option value="probability">Sort by Probability</option>
            <option value="closeDate">Sort by Close Date</option>
          </select>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No opportunities match your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(opportunity.stage)}`}>
                        {opportunity.stage.charAt(0).toUpperCase() + opportunity.stage.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(opportunity.priority)}`}>
                        {opportunity.priority.charAt(0).toUpperCase() + opportunity.priority.slice(1)} Priority
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{opportunity.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{opportunity.owner}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{opportunity.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Deal Value</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(opportunity.value)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Win Probability</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${opportunity.probability >= 75 ? 'bg-green-500' : opportunity.probability >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${opportunity.probability}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${getProbabilityColor(opportunity.probability)}`}>
                        {opportunity.probability}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Expected Close</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(opportunity.expectedCloseDate)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Weighted Value</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(opportunity.value * opportunity.probability / 100)}
                    </p>
                  </div>
                </div>

                {/* Tags and Products */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {opportunity.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Next Activity */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Next: {opportunity.nextActivity.description}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(opportunity.nextActivity.date)}
                      </span>
                    </div>
                  </div>
                  
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Risk Factors */}
                {opportunity.riskFactors.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600 mb-1">Risk Factors:</p>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.riskFactors.map((risk, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded"
                        >
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredOpportunities.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredOpportunities.length} of {opportunities.length} opportunities</span>
            <span>Total Pipeline: {formatCurrency(calculateTotalValue())} • Weighted: {formatCurrency(calculateWeightedValue())}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityList;