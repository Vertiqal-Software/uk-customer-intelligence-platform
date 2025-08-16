import React, { useState, useEffect } from 'react';

const TenderIntelligence = () => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [selectedTender, setSelectedTender] = useState(null);
  const [filters, setFilters] = useState({
    value_min: '',
    value_max: '',
    deadline_days: '30',
    sectors: [],
    frameworks: [],
    location: 'all'
  });
  const [watchedCompanies, setWatchedCompanies] = useState([]);

  // Mock tender data - replace with real API calls
  const [tenderData, setTenderData] = useState({
    active_opportunities: [
      {
        id: 'T001',
        title: 'Digital Transformation Services - Education Sector',
        description: 'Multi-year framework for providing digital transformation consultancy, cloud migration, and cybersecurity services to educational institutions across the UK.',
        value: '£2.3M',
        deadline: '2025-02-15',
        published: '2024-12-01',
        buyer: 'Department for Education',
        location: 'England',
        sectors: ['Education', 'Technology'],
        frameworks: ['Digital Outcomes and Specialists'],
        cpv_codes: ['72000000', '72400000'],
        match_score: 95,
        matched_companies: ['TechFlow Solutions Ltd', 'Digital Education Partners'],
        why_matched: 'Strong alignment with education sector experience and digital transformation capabilities',
        estimated_bid_cost: '£15,000',
        competition_level: 'Medium',
        success_probability: 'High'
      },
      {
        id: 'T002',
        title: 'Cloud Infrastructure Migration Framework',
        description: 'Establishment of a framework agreement for cloud infrastructure migration services for central government departments.',
        value: '£5.0M',
        deadline: '2025-03-01',
        published: '2024-12-15',
        buyer: 'Crown Commercial Service',
        location: 'UK Wide',
        sectors: ['Government', 'Technology'],
        frameworks: ['Technology Products and Services'],
        cpv_codes: ['72000000', '72500000'],
        match_score: 88,
        matched_companies: ['CloudTech Solutions', 'Government IT Services'],
        why_matched: 'Government credentials and existing framework presence',
        estimated_bid_cost: '£25,000',
        competition_level: 'High',
        success_probability: 'Medium'
      },
      {
        id: 'T003',
        title: 'Cybersecurity Assessment Services',
        description: 'Provision of cybersecurity assessment, penetration testing, and compliance services for NHS trusts.',
        value: '£800K',
        deadline: '2025-01-30',
        published: '2024-11-20',
        buyer: 'NHS Digital',
        location: 'England',
        sectors: ['Healthcare', 'Security'],
        frameworks: ['Cyber Security Services'],
        cpv_codes: ['72000000', '72600000'],
        match_score: 92,
        matched_companies: ['SecureIT Ltd', 'CyberGuard Solutions'],
        why_matched: 'NHS experience and Cyber Essentials Plus certification',
        estimated_bid_cost: '£8,000',
        competition_level: 'Low',
        success_probability: 'Very High'
      }
    ],
    coming_soon: [
      {
        id: 'T004',
        title: 'AI and Machine Learning Consultancy Framework',
        estimated_value: '£10M+',
        expected_publication: '2025-02-01',
        buyer: 'Cabinet Office',
        intelligence: 'Market engagement ongoing. Focus on ethical AI and government use cases.'
      },
      {
        id: 'T005',
        title: 'Digital Identity Services',
        estimated_value: '£3M',
        expected_publication: '2025-03-15',
        buyer: 'DVLA',
        intelligence: 'Requirements gathering phase. Looking for proven identity verification solutions.'
      }
    ],
    won_opportunities: [
      {
        id: 'W001',
        title: 'Local Government Cloud Services',
        value: '£1.2M',
        winner: 'TechFlow Solutions Ltd',
        award_date: '2024-11-15',
        contract_start: '2025-01-01',
        duration: '24 months',
        buyer: 'Manchester City Council'
      }
    ],
    frameworks: [
      {
        name: 'Digital Outcomes and Specialists 6',
        expiry: '2025-08-31',
        renewal_status: 'Planning stage',
        current_suppliers: 2847,
        annual_spend: '£2.1B',
        your_status: 'Not on framework'
      },
      {
        name: 'Technology Products and Services 4',
        expiry: '2025-12-31',
        renewal_status: 'Market engagement',
        current_suppliers: 1205,
        annual_spend: '£1.8B',
        your_status: 'Eligible'
      },
      {
        name: 'Cyber Security Services 3',
        expiry: '2024-09-30',
        renewal_status: 'Live procurement',
        current_suppliers: 156,
        annual_spend: '£400M',
        your_status: 'Applied'
      }
    ]
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDeadlineUrgency = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 7) return 'bg-red-100 text-red-800';
    if (daysLeft <= 30) return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };

  const generateBidStrategy = (tender) => {
    return {
      key_differentiators: [
        'Proven track record in ' + tender.sectors[0].toLowerCase() + ' sector',
        'Existing security certifications (ISO 27001, Cyber Essentials)',
        'Local delivery team and established supply chain',
        'Competitive pricing model with value-add services'
      ],
      team_requirements: [
        'Lead Consultant (SC cleared)',
        'Technical Architect',
        'Project Manager (PRINCE2)',
        'Sector Specialist'
      ],
      success_factors: [
        'Demonstrate deep understanding of buyer\'s challenges',
        'Provide relevant case studies and references',
        'Show innovation while maintaining compliance',
        'Competitive pricing with clear value proposition'
      ],
      timeline: {
        'Clarification questions': '7 days before deadline',
        'Draft submission': '14 days before deadline',
        'Final review': '3 days before deadline',
        'Submission': 'Day of deadline'
      }
    };
  };

  const tabs = [
    { id: 'opportunities', name: 'Active Opportunities', icon: '🎯', count: tenderData.active_opportunities.length },
    { id: 'coming-soon', name: 'Pipeline', icon: '⏳', count: tenderData.coming_soon.length },
    { id: 'frameworks', name: 'Frameworks', icon: '📋', count: tenderData.frameworks.length },
    { id: 'won', name: 'Awards', icon: '🏆', count: tenderData.won_opportunities.length },
    { id: 'analytics', name: 'Analytics', icon: '📊' }
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
                <h1 className="text-2xl font-bold text-gray-900">Tender Intelligence Hub</h1>
                <p className="text-sm text-gray-600">UK public sector procurement opportunities and framework intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Last updated: 5 minutes ago</span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🎯</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Opportunities</p>
                <p className="text-2xl font-bold text-blue-600">{tenderData.active_opportunities.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">💰</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">£8.1M</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🔥</div>
              <div>
                <p className="text-sm font-medium text-gray-600">High Match</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">⏰</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Closing Soon</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters & Search</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value Range</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Min £"
                  value={filters.value_min}
                  onChange={(e) => handleFilterChange('value_min', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="text"
                  placeholder="Max £"
                  value={filters.value_max}
                  onChange={(e) => handleFilterChange('value_max', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <select
                value={filters.deadline_days}
                onChange={(e) => handleFilterChange('deadline_days', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="7">Next 7 days</option>
                <option value="30">Next 30 days</option>
                <option value="90">Next 90 days</option>
                <option value="all">All</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sectors</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All sectors</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="government">Government</option>
                <option value="technology">Technology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Match Score</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All matches</option>
                <option value="90">90%+ (Excellent)</option>
                <option value="80">80%+ (Good)</option>
                <option value="70">70%+ (Fair)</option>
              </select>
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
                {tab.count && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            {tenderData.active_opportunities.map((tender) => (
              <div key={tender.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{tender.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getMatchScoreColor(tender.match_score)}`}>
                        {tender.match_score}% match
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDeadlineUrgency(tender.deadline)}`}>
                        {Math.ceil((new Date(tender.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{tender.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Value:</span>
                        <div className="text-gray-900">{tender.value}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Buyer:</span>
                        <div className="text-gray-900">{tender.buyer}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Deadline:</span>
                        <div className="text-gray-900">{new Date(tender.deadline).toLocaleDateString('en-GB')}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Success Probability:</span>
                        <div className="text-gray-900">{tender.success_probability}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Why matched:</span>
                        <span className="text-gray-600 ml-1">{tender.why_matched}</span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setSelectedTender(tender)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        Generate Bid Strategy
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                        Notify Team
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'coming-soon' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800">Pipeline Intelligence</h3>
              <p className="text-sm text-blue-600">Advanced procurement intelligence gathered from market engagement, supplier briefings, and procurement forward plans.</p>
            </div>
            {tenderData.coming_soon.map((tender) => (
              <div key={tender.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{tender.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Estimated Value:</span>
                        <div className="text-gray-900">{tender.estimated_value}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Expected Publication:</span>
                        <div className="text-gray-900">{tender.expected_publication}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Buyer:</span>
                        <div className="text-gray-900">{tender.buyer}</div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium text-yellow-800">Intelligence:</span>
                      <span className="text-yellow-700 ml-1">{tender.intelligence}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                      Set Alert
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Pre-Qualify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'frameworks' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-800">Framework Intelligence</h3>
              <p className="text-sm text-green-600">Monitor key government frameworks for renewal opportunities and track your application status.</p>
            </div>
            {tenderData.frameworks.map((framework, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{framework.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        framework.your_status === 'Not on framework' ? 'bg-red-100 text-red-800' :
                        framework.your_status === 'Applied' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {framework.your_status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Expiry:</span>
                        <div className="text-gray-900">{framework.expiry}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Suppliers:</span>
                        <div className="text-gray-900">{framework.current_suppliers.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Annual Spend:</span>
                        <div className="text-gray-900">{framework.annual_spend}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Renewal:</span>
                        <div className="text-gray-900">{framework.renewal_status}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    {framework.your_status === 'Not on framework' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        Apply Next Round
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'won' && (
          <div className="space-y-6">
            {tenderData.won_opportunities.map((award) => (
              <div key={award.id} className="bg-white rounded-lg shadow-sm border border-green-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{award.title}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        Won
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Value:</span>
                        <div className="text-gray-900">{award.value}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Winner:</span>
                        <div className="text-gray-900">{award.winner}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Start Date:</span>
                        <div className="text-gray-900">{award.contract_start}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <div className="text-gray-900">{award.duration}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bid Success Rate</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">73%</div>
                <div className="text-sm text-gray-600">Success rate in last 12 months</div>
                <div className="mt-4 text-sm text-gray-500">8 wins from 11 bids</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Bid Cost</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">£12.5K</div>
                <div className="text-sm text-gray-600">Average cost per bid</div>
                <div className="mt-4 text-sm text-gray-500">ROI: 340%</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Sectors</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Education</span>
                  <span className="text-sm font-medium text-gray-900">90% success</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Healthcare</span>
                  <span className="text-sm font-medium text-gray-900">75% success</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Government</span>
                  <span className="text-sm font-medium text-gray-900">60% success</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pipeline Value</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">£15.2M</div>
                <div className="text-sm text-gray-600">Total pipeline value</div>
                <div className="mt-4 text-sm text-gray-500">23 active opportunities</div>
              </div>
            </div>
          </div>
        )}

        {/* Tender Detail Modal */}
        {selectedTender && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTender.title}</h2>
                  <p className="text-gray-600">Tender ID: {selectedTender.id}</p>
                </div>
                <button
                  onClick={() => setSelectedTender(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                    <p className="text-gray-700">{selectedTender.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Bid Strategy</h3>
                    {(() => {
                      const strategy = generateBidStrategy(selectedTender);
                      return (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Differentiators</h4>
                            <ul className="space-y-1">
                              {strategy.key_differentiators.map((diff, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {diff}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Team Requirements</h4>
                            <div className="flex flex-wrap gap-2">
                              {strategy.team_requirements.map((role, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Key Details</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Value:</span>
                        <span className="ml-2 text-gray-900">{selectedTender.value}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Deadline:</span>
                        <span className="ml-2 text-gray-900">{new Date(selectedTender.deadline).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Buyer:</span>
                        <span className="ml-2 text-gray-900">{selectedTender.buyer}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Competition:</span>
                        <span className="ml-2 text-gray-900">{selectedTender.competition_level}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Est. Bid Cost:</span>
                        <span className="ml-2 text-gray-900">{selectedTender.estimated_bid_cost}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Download Documents
                    </button>
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Start Bid Process
                    </button>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Share with Team
                    </button>
                    <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                      Add to CRM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenderIntelligence;