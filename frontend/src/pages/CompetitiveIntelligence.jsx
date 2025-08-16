import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const CompetitiveIntelligence = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [competitiveData, setCompetitiveData] = useState({
    tracked_companies: [],
    vendor_analysis: {},
    market_positioning: {},
    technology_stack_analysis: {},
    partnership_opportunities: [],
    threat_assessment: {},
    industry_trends: []
  });

  useEffect(() => {
    loadCompetitiveIntelligence();
  }, []);

  const loadCompetitiveIntelligence = async () => {
    try {
      setLoading(true);
      
      // Mock competitive intelligence data
      const mockData = {
        tracked_companies: [
          {
            id: 'comp1',
            name: 'TechFlow Solutions Ltd',
            industry: 'Technology Services',
            size: 'Medium (50-250 employees)',
            financial_health: 'Strong',
            growth_rate: '15%',
            key_services: ['Cloud Migration', 'Cybersecurity', 'Managed IT'],
            recent_wins: [
              { client: 'Local Authority', value: '£450K', service: 'Digital Transformation' },
              { client: 'NHS Trust', value: '£280K', service: 'Cloud Migration' }
            ],
            technology_stack: {
              cloud_platforms: ['AWS', 'Microsoft Azure'],
              security_tools: ['CrowdStrike', 'Palo Alto', 'Microsoft Defender'],
              management_tools: ['ServiceNow', 'ITSM'],
              collaboration: ['Microsoft 365', 'Teams']
            },
            partnerships: ['Microsoft Gold Partner', 'AWS Advanced Partner'],
            strengths: [
              'Strong public sector presence',
              'Comprehensive cloud expertise',
              'Established partner network'
            ],
            weaknesses: [
              'Limited AI/ML capabilities',
              'Regional focus only',
              'Higher pricing than competitors'
            ],
            threat_level: 'High',
            opportunities: [
              'Potential partnership in AI solutions',
              'Subcontracting for large projects',
              'Joint bidding on government frameworks'
            ]
          },
          {
            id: 'comp2',
            name: 'CloudTech Solutions',
            industry: 'Cloud Services',
            size: 'Large (250+ employees)',
            financial_health: 'Very Strong',
            growth_rate: '22%',
            key_services: ['Cloud Infrastructure', 'DevOps', 'Data Analytics'],
            recent_wins: [
              { client: 'Financial Services', value: '£1.2M', service: 'Cloud Platform' },
              { client: 'Retail Chain', value: '£800K', service: 'Data Analytics' }
            ],
            technology_stack: {
              cloud_platforms: ['Google Cloud', 'AWS', 'Microsoft Azure'],
              data_tools: ['Snowflake', 'Databricks', 'Tableau'],
              devops_tools: ['Kubernetes', 'Docker', 'Jenkins'],
              ai_ml: ['TensorFlow', 'PyTorch', 'AutoML']
            },
            partnerships: ['Google Cloud Premier Partner', 'Snowflake Partner'],
            strengths: [
              'Advanced data analytics capabilities',
              'Strong private sector client base',
              'Cutting-edge AI/ML expertise'
            ],
            weaknesses: [
              'Limited public sector experience',
              'Complex pricing structure',
              'Lacks cybersecurity focus'
            ],
            threat_level: 'Medium',
            opportunities: [
              'Knowledge sharing in AI/ML',
              'Cross-referrals in different sectors',
              'Technology partnership opportunities'
            ]
          },
          {
            id: 'comp3',
            name: 'SecureIT Ltd',
            industry: 'Cybersecurity',
            size: 'Small (10-50 employees)',
            financial_health: 'Good',
            growth_rate: '8%',
            key_services: ['Penetration Testing', 'Security Consulting', 'Compliance'],
            recent_wins: [
              { client: 'Manufacturing', value: '£150K', service: 'Pen Testing' },
              { client: 'Healthcare', value: '£200K', service: 'ISO 27001 Implementation' }
            ],
            technology_stack: {
              security_tools: ['Nessus', 'Metasploit', 'Burp Suite'],
              compliance: ['GRC platforms', 'Risk management tools'],
              monitoring: ['SIEM solutions', 'SOC tools']
            },
            partnerships: ['CREST Certified', 'IASME Consortium'],
            strengths: [
              'Specialized cybersecurity expertise',
              'Strong compliance credentials',
              'Agile and responsive service'
            ],
            weaknesses: [
              'Limited scale for large projects',
              'Narrow service portfolio',
              'Resource constraints for growth'
            ],
            threat_level: 'Low',
            opportunities: [
              'Subcontracting cybersecurity services',
              'Joint ventures for larger projects',
              'Acquisition target potential'
            ]
          }
        ],
        vendor_analysis: {
          cloud_providers: [
            {
              name: 'Microsoft Azure',
              market_share: '35%',
              client_adoption: 'High',
              our_relationship: 'Gold Partner',
              competitive_threat: 'Low',
              opportunities: ['Co-selling opportunities', 'Joint marketing']
            },
            {
              name: 'Amazon AWS',
              market_share: '42%',
              client_adoption: 'Very High',
              our_relationship: 'Advanced Partner',
              competitive_threat: 'Medium',
              opportunities: ['Advanced certifications', 'Marketplace presence']
            },
            {
              name: 'Google Cloud',
              market_share: '15%',
              client_adoption: 'Medium',
              our_relationship: 'Basic Partner',
              competitive_threat: 'Low',
              opportunities: ['Upgrade partnership level', 'AI/ML focus']
            }
          ],
          security_vendors: [
            {
              name: 'CrowdStrike',
              adoption_rate: 'High',
              client_satisfaction: '9.2/10',
              our_certification: 'Yes',
              competitive_advantage: 'Strong EDR expertise'
            },
            {
              name: 'Palo Alto Networks',
              adoption_rate: 'Medium',
              client_satisfaction: '8.7/10',
              our_certification: 'No',
              competitive_advantage: 'Limited - opportunity for training'
            }
          ]
        },
        market_positioning: {
          our_position: {
            market_rank: '3rd in regional market',
            strengths: [
              'Comprehensive service portfolio',
              'Strong public sector relationships',
              'Proven delivery track record',
              'Cost-effective solutions'
            ],
            market_share: '12%',
            growth_trajectory: 'Positive (+18% YoY)',
            differentiation: [
              'End-to-end service delivery',
              'Sector-specific expertise',
              'Local presence with national reach'
            ]
          },
          market_leaders: [
            {
              name: 'Regional IT Leader',
              market_share: '28%',
              key_advantage: 'Scale and resources',
              vulnerability: 'Higher costs, less agile'
            },
            {
              name: 'National Provider',
              market_share: '22%',
              key_advantage: 'Brand recognition',
              vulnerability: 'Limited local presence'
            }
          ]
        },
        partnership_opportunities: [
          {
            company: 'TechFlow Solutions Ltd',
            type: 'Strategic Partnership',
            rationale: 'Complementary public sector expertise',
            potential_value: 'High',
            next_steps: ['Initial meeting scheduled', 'Joint capability presentation'],
            timeline: 'Q1 2025'
          },
          {
            company: 'SecureIT Ltd',
            type: 'Acquisition Target',
            rationale: 'Enhance cybersecurity capabilities',
            potential_value: 'Medium',
            next_steps: ['Due diligence review', 'Valuation assessment'],
            timeline: 'Q2 2025'
          },
          {
            company: 'CloudTech Solutions',
            type: 'Technology Partnership',
            rationale: 'AI/ML capabilities sharing',
            potential_value: 'Medium',
            next_steps: ['Technical collaboration pilot'],
            timeline: 'Q1 2025'
          }
        ],
        threat_assessment: {
          immediate_threats: [
            {
              threat: 'New market entrant with VC backing',
              probability: 'Medium',
              impact: 'High',
              mitigation: 'Accelerate digital transformation offerings'
            },
            {
              threat: 'Major competitor acquiring local player',
              probability: 'High',
              impact: 'Medium',
              mitigation: 'Strengthen key client relationships'
            }
          ],
          emerging_threats: [
            {
              threat: 'AI-driven service automation',
              probability: 'High',
              impact: 'High',
              timeline: '12-18 months',
              mitigation: 'Invest in AI capabilities and automation tools'
            }
          ]
        },
        industry_trends: [
          {
            trend: 'Increased focus on AI and automation',
            impact: 'High',
            opportunity: 'Develop AI-driven service offerings',
            timeline: 'Next 12 months'
          },
          {
            trend: 'Hybrid cloud adoption accelerating',
            impact: 'Medium',
            opportunity: 'Multi-cloud expertise positioning',
            timeline: 'Ongoing'
          },
          {
            trend: 'Cybersecurity skills shortage',
            impact: 'High',
            opportunity: 'Managed security services expansion',
            timeline: 'Immediate'
          }
        ]
      };

      setCompetitiveData(mockData);
    } catch (err) {
      console.error('Failed to load competitive intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'competitors', name: 'Competitor Analysis', icon: '🏢' },
    { id: 'vendors', name: 'Vendor Landscape', icon: '🤝' },
    { id: 'positioning', name: 'Market Position', icon: '🎯' },
    { id: 'partnerships', name: 'Partnership Ops', icon: '🤝' },
    { id: 'threats', name: 'Threat Assessment', icon: '⚠️' },
    { id: 'trends', name: 'Industry Trends', icon: '📈' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading competitive intelligence...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Competitive Intelligence</h1>
                <p className="text-sm text-gray-600">Market analysis and competitive positioning</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Last updated: 2 hours ago</span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Refresh Analysis
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🏢</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tracked Competitors</p>
                <p className="text-2xl font-bold text-blue-600">{competitiveData.tracked_companies.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🎯</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Market Position</p>
                <p className="text-2xl font-bold text-green-600">3rd</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">📈</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-purple-600">+18%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">⚠️</div>
              <div>
                <p className="text-sm font-medium text-gray-600">High Threats</p>
                <p className="text-2xl font-bold text-red-600">2</p>
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
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Competitive Landscape</h3>
                <div className="space-y-4">
                  {competitiveData.tracked_companies.slice(0, 3).map((competitor) => (
                    <div key={competitor.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-800">{competitor.name}</h4>
                          <p className="text-sm text-gray-600">{competitor.industry} • {competitor.size}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getThreatLevelColor(competitor.threat_level)}`}>
                          {competitor.threat_level} Threat
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Growth:</span>
                          <span className="text-gray-900 ml-1">{competitor.growth_rate}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Health:</span>
                          <span className="text-gray-900 ml-1">{competitor.financial_health}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-gray-700 text-sm">Key Services: </span>
                        <span className="text-gray-600 text-sm">{competitor.key_services.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Trends</h3>
                <div className="space-y-3">
                  {competitiveData.industry_trends.slice(0, 3).map((trend, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-800">{trend.trend}</h4>
                      <p className="text-sm text-gray-600">{trend.opportunity}</p>
                      <p className="text-xs text-blue-600 mt-1">Timeline: {trend.timeline}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Our Position</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Market Rank:</span>
                    <div className="text-lg font-bold text-blue-600">{competitiveData.market_positioning.our_position?.market_rank}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Market Share:</span>
                    <div className="text-lg font-bold text-green-600">{competitiveData.market_positioning.our_position?.market_share}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Growth:</span>
                    <div className="text-lg font-bold text-purple-600">{competitiveData.market_positioning.our_position?.growth_trajectory}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Immediate Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                    Review High Threats
                  </button>
                  <button
                    onClick={() => setActiveTab('partnerships')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Explore Partnerships
                  </button>
                  <button
                    onClick={() => setActiveTab('trends')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Industry Analysis
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Key Partnerships</h3>
                <div className="space-y-2">
                  {competitiveData.vendor_analysis.cloud_providers?.slice(0, 3).map((provider, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{provider.name}</span>
                      <span className="text-gray-900 font-medium">{provider.our_relationship}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitors' && (
          <div className="space-y-6">
            {competitiveData.tracked_companies.map((competitor) => (
              <div key={competitor.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{competitor.name}</h3>
                    <p className="text-gray-600">{competitor.industry} • {competitor.size}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${getThreatLevelColor(competitor.threat_level)}`}>
                    {competitor.threat_level} Threat
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Financial Health</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Health:</span>
                        <span className="text-gray-900">{competitor.financial_health}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growth:</span>
                        <span className="text-gray-900">{competitor.growth_rate}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Strengths</h4>
                    <ul className="space-y-1">
                      {competitor.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-start">
                          <span className="text-green-500 mr-1">+</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Weaknesses</h4>
                    <ul className="space-y-1">
                      {competitor.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-start">
                          <span className="text-red-500 mr-1">-</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Recent Wins</h4>
                    <div className="space-y-2">
                      {competitor.recent_wins.map((win, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-gray-800">{win.value}</div>
                          <div className="text-gray-600">{win.client}</div>
                          <div className="text-gray-500">{win.service}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3">Technology Stack</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(competitor.technology_stack).map(([category, tools]) => (
                      <div key={category}>
                        <h5 className="text-sm font-medium text-gray-700 mb-1 capitalize">
                          {category.replace('_', ' ')}
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(tools) ? tools.map((tool, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {tool}
                            </span>
                          )) : (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {tools}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3">Opportunities</h4>
                  <div className="space-y-2">
                    {competitor.opportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700">{opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Cloud Platform Landscape</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {competitiveData.vendor_analysis.cloud_providers?.map((provider, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-800">{provider.name}</h4>
                      <span className="text-sm text-gray-600">{provider.market_share}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Our Status:</span>
                        <span className="text-gray-900 font-medium">{provider.our_relationship}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Adoption:</span>
                        <span className="text-gray-900">{provider.client_adoption}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Threat Level:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getThreatLevelColor(provider.competitive_threat)}`}>
                          {provider.competitive_threat}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Opportunities:</h5>
                      <ul className="space-y-1">
                        {provider.opportunities.map((opp, oppIndex) => (
                          <li key={oppIndex} className="text-xs text-gray-600">• {opp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Security Vendor Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {competitiveData.vendor_analysis.security_vendors?.map((vendor, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-3">{vendor.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Adoption:</span>
                        <span className="text-gray-900">{vendor.adoption_rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Satisfaction:</span>
                        <span className="text-gray-900">{vendor.client_satisfaction}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Our Certification:</span>
                        <span className={vendor.our_certification === 'Yes' ? 'text-green-600' : 'text-red-600'}>
                          {vendor.our_certification}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Advantage:</span> {vendor.competitive_advantage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'positioning' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Our Market Position</h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {competitiveData.market_positioning.our_position?.market_rank}
                  </div>
                  <div className="text-sm text-blue-700">Regional Market Position</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {competitiveData.market_positioning.our_position?.market_share}
                    </div>
                    <div className="text-xs text-green-700">Market Share</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">+18%</div>
                    <div className="text-xs text-purple-700">YoY Growth</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Key Strengths</h4>
                  <ul className="space-y-1">
                    {competitiveData.market_positioning.our_position?.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Differentiation</h4>
                  <ul className="space-y-1">
                    {competitiveData.market_positioning.our_position?.differentiation.map((diff, index) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start">
                        <span className="text-blue-500 mr-2">★</span>
                        {diff}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Leaders</h3>
                <div className="space-y-4">
                  {competitiveData.market_positioning.market_leaders?.map((leader, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{leader.name}</h4>
                        <span className="text-sm font-medium text-gray-900">{leader.market_share}</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-green-600 font-medium">Advantage:</span>
                          <span className="text-gray-700 ml-1">{leader.key_advantage}</span>
                        </div>
                        <div>
                          <span className="text-red-600 font-medium">Vulnerability:</span>
                          <span className="text-gray-700 ml-1">{leader.vulnerability}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partnerships' && (
          <div className="space-y-6">
            {competitiveData.partnership_opportunities.map((partnership, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{partnership.company}</h3>
                    <p className="text-gray-600">{partnership.type}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    partnership.potential_value === 'High' ? 'bg-green-100 text-green-800' :
                    partnership.potential_value === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {partnership.potential_value} Value
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Rationale</h4>
                    <p className="text-sm text-gray-700">{partnership.rationale}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Next Steps</h4>
                    <ul className="space-y-1">
                      {partnership.next_steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Timeline</h4>
                    <p className="text-sm text-gray-700">{partnership.timeline}</p>
                    <div className="mt-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        Initiate Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'threats' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Immediate Threats</h3>
              <div className="space-y-4">
                {competitiveData.threat_assessment.immediate_threats?.map((threat, index) => (
                  <div key={index} className="border-l-4 border-red-500 pl-4 py-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{threat.threat}</h4>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getThreatLevelColor(threat.probability)}`}>
                          {threat.probability} Probability
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getThreatLevelColor(threat.impact)}`}>
                          {threat.impact} Impact
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Mitigation:</span> {threat.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Emerging Threats</h3>
              <div className="space-y-4">
                {competitiveData.threat_assessment.emerging_threats?.map((threat, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-4 py-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{threat.threat}</h4>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          {threat.timeline}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getThreatLevelColor(threat.impact)}`}>
                          {threat.impact} Impact
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Mitigation:</span> {threat.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {competitiveData.industry_trends.map((trend, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-gray-800">{trend.trend}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getThreatLevelColor(trend.impact)}`}>
                      {trend.impact} Impact
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Opportunity:</span>
                      <p className="text-sm text-gray-600 mt-1">{trend.opportunity}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Timeline:</span>
                      <p className="text-sm text-gray-600 mt-1">{trend.timeline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Strategic Recommendations</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Immediate Actions (Next 3 months)</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Invest in AI/ML training and certifications</li>
                    <li>• Expand managed security services portfolio</li>
                    <li>• Strengthen key client relationships</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Medium Term (6-12 months)</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Develop multi-cloud expertise</li>
                    <li>• Explore strategic partnerships</li>
                    <li>• Enhance automation capabilities</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Long Term (12+ months)</h4>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>• Consider strategic acquisitions</li>
                    <li>• Expand into adjacent markets</li>
                    <li>• Build platform-based offerings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitiveIntelligence;