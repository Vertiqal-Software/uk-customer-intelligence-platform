import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const CompanyDetail = () => {
  const { companyNumber } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monitoring, setMonitoring] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [companyData, setCompanyData] = useState({
    financial_data: [],
    officers: [],
    filings: [],
    alerts: [],
    website_analysis: {},
    competitive_analysis: {},
    tenders: [],
    linkedin_data: {}
  });

  useEffect(() => {
    loadCompanyDetails();
  }, [companyNumber]);

  const loadCompanyDetails = async () => {
    try {
      setLoading(true);
      
      // Load basic company info
      const result = await apiService.getCompanyDetails(companyNumber);
      if (result.success) {
        setCompany(result.data.company);
        await loadEnhancedData(result.data.company);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  const loadEnhancedData = async (companyInfo) => {
    // Mock enhanced data - would come from various APIs
    const mockEnhancedData = {
      financial_data: [
        {
          year: '2024',
          period_end: '2024-03-31',
          turnover: 2450000,
          gross_profit: 980000,
          net_profit: 245000,
          total_assets: 1200000,
          current_assets: 450000,
          cash_at_bank: 125000,
          current_liabilities: 280000,
          total_equity: 720000,
          employees: 25,
          filing_date: '2024-09-15',
          status: 'Filed'
        },
        {
          year: '2023',
          period_end: '2023-03-31',
          turnover: 2100000,
          gross_profit: 840000,
          net_profit: 210000,
          total_assets: 950000,
          current_assets: 380000,
          cash_at_bank: 95000,
          current_liabilities: 220000,
          total_equity: 580000,
          employees: 22,
          filing_date: '2023-09-20',
          status: 'Filed'
        },
        {
          year: '2022',
          period_end: '2022-03-31',
          turnover: 1850000,
          gross_profit: 740000,
          net_profit: 185000,
          total_assets: 780000,
          current_assets: 320000,
          cash_at_bank: 85000,
          current_liabilities: 180000,
          total_equity: 480000,
          employees: 18,
          filing_date: '2022-09-18',
          status: 'Filed'
        }
      ],
      officers: [
        {
          name: 'John Smith',
          role: 'Director',
          appointed_date: '2020-05-15',
          resigned_date: null,
          address: 'Innovation Hub, London',
          nationality: 'British',
          occupation: 'Company Director',
          date_of_birth: '1975-08-20',
          country_of_residence: 'United Kingdom'
        },
        {
          name: 'Sarah Johnson',
          role: 'Director',
          appointed_date: '2022-01-10',
          resigned_date: null,
          address: 'Tech Quarter, London',
          nationality: 'British',
          occupation: 'Technology Director',
          date_of_birth: '1982-03-15',
          country_of_residence: 'United Kingdom'
        },
        {
          name: 'Michael Brown',
          role: 'Secretary',
          appointed_date: '2020-05-15',
          resigned_date: '2024-06-30',
          address: 'Business Centre, Manchester',
          nationality: 'British',
          occupation: 'Company Secretary',
          date_of_birth: '1970-11-05',
          country_of_residence: 'United Kingdom'
        }
      ],
      filings: [
        {
          filing_type: 'Annual Accounts',
          filing_date: '2024-09-15',
          period_end: '2024-03-31',
          description: 'Annual accounts filed for period ending 31/03/2024',
          status: 'Accepted',
          document_available: true
        },
        {
          filing_type: 'Confirmation Statement',
          filing_date: '2024-05-20',
          period_end: '2024-05-15',
          description: 'Confirmation statement - no changes',
          status: 'Accepted',
          document_available: true
        },
        {
          filing_type: 'Change of Director',
          filing_date: '2024-07-01',
          period_end: null,
          description: 'Termination of appointment of Michael Brown as Secretary',
          status: 'Accepted',
          document_available: true
        },
        {
          filing_type: 'Annual Accounts',
          filing_date: '2023-09-20',
          period_end: '2023-03-31',
          description: 'Annual accounts filed for period ending 31/03/2023',
          status: 'Accepted',
          document_available: true
        }
      ],
      alerts: [
        {
          id: 'alert_001',
          type: 'Financial Filing',
          message: 'New annual accounts show 16.7% revenue growth',
          date: '2024-09-15',
          severity: 'info',
          action_suggested: 'Schedule quarterly business review'
        },
        {
          id: 'alert_002',
          type: 'Officer Change',
          message: 'Company Secretary Michael Brown resigned',
          date: '2024-07-01',
          severity: 'medium',
          action_suggested: 'Check for operational impact'
        },
        {
          id: 'alert_003',
          type: 'Website Update',
          message: 'New case study published about NHS project',
          date: '2024-08-22',
          severity: 'low',
          action_suggested: 'Reference in next sales conversation'
        }
      ],
      website_analysis: {
        last_updated: '2024-08-22',
        technology_stack: ['React', 'Node.js', 'AWS', 'MongoDB'],
        mentioned_vendors: ['Microsoft', 'Amazon Web Services', 'MongoDB', 'Salesforce'],
        certifications: ['ISO 27001', 'Cyber Essentials Plus', 'AWS Partner'],
        recent_news: [
          {
            title: 'TechFlow Wins Major NHS Digital Transformation Contract',
            date: '2024-08-22',
            summary: 'Awarded £1.2M contract to modernize patient data systems',
            url: '/news/nhs-contract-win'
          },
          {
            title: 'Expansion into AI-Powered Healthcare Solutions',
            date: '2024-07-15',
            summary: 'New partnership with leading AI vendor for healthcare analytics',
            url: '/news/ai-healthcare-partnership'
          }
        ],
        services_offered: [
          'Cloud Migration Services',
          'Cybersecurity Consulting',
          'Digital Transformation',
          'Managed IT Services',
          'Healthcare IT Solutions'
        ],
        key_clients_mentioned: ['NHS Trusts', 'Local Authorities', 'Education Sector'],
        social_media: {
          linkedin_followers: 2400,
          twitter_followers: 850,
          last_post: '2024-09-10'
        }
      },
      competitive_analysis: {
        market_position: 'Regional leader in healthcare IT',
        main_competitors: ['CloudTech Solutions', 'Digital Health Partners', 'NHS IT Services'],
        differentiators: [
          'Specialized healthcare focus',
          'Strong NHS relationships',
          'Proven track record in digital transformation'
        ],
        weaknesses: [
          'Limited international presence',
          'Smaller team than main competitors',
          'Dependency on public sector contracts'
        ],
        opportunities: [
          'AI integration in healthcare',
          'Expansion to private healthcare',
          'International healthcare markets'
        ],
        threats: [
          'Large consultancies entering healthcare IT',
          'Budget cuts in public sector',
          'Regulatory changes in healthcare'
        ]
      },
      tenders: [
        {
          title: 'Healthcare Data Analytics Platform',
          value: '£850K',
          deadline: '2025-02-15',
          buyer: 'NHS Foundation Trust',
          match_score: 95,
          status: 'Open',
          relevance: 'Perfect match - healthcare IT focus and previous NHS experience'
        },
        {
          title: 'Digital Infrastructure Modernization',
          value: '£1.2M',
          deadline: '2025-03-01',
          buyer: 'Local Authority',
          match_score: 88,
          status: 'Open',
          relevance: 'Good fit - public sector experience and infrastructure expertise'
        }
      ],
      linkedin_data: {
        employee_count: 28,
        recent_hires: [
          { name: 'Emma Wilson', role: 'Senior Developer', start_date: '2024-08-01' },
          { name: 'David Chen', role: 'Cybersecurity Specialist', start_date: '2024-07-15' }
        ],
        recent_departures: [
          { name: 'Tom Anderson', role: 'Project Manager', end_date: '2024-06-30' }
        ],
        key_personnel: [
          { name: 'John Smith', role: 'CEO', tenure: '4 years', background: 'Former NHS IT Director' },
          { name: 'Sarah Johnson', role: 'CTO', tenure: '2 years', background: 'Ex-Microsoft, healthcare specialist' }
        ],
        company_updates: [
          {
            date: '2024-09-01',
            content: 'Celebrating our team growth - welcome to our new cybersecurity specialists!',
            engagement: { likes: 45, comments: 8 }
          }
        ]
      }
    };

    setCompanyData(mockEnhancedData);
  };

  const handleMonitoringToggle = async () => {
    try {
      setMonitoring(true);
      if (company.is_monitored) {
        const result = await apiService.removeFromMonitoring(companyNumber);
        if (result.success) {
          setCompany(prev => ({ ...prev, is_monitored: false }));
        }
      } else {
        const result = await apiService.addToMonitoring(companyNumber);
        if (result.success) {
          setCompany(prev => ({ ...prev, is_monitored: true }));
        }
      }
    } catch (err) {
      console.error('Failed to toggle monitoring:', err);
    } finally {
      setMonitoring(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'dissolved': return 'bg-red-100 text-red-800';
      case 'liquidation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateFinancialTrends = () => {
    if (companyData.financial_data.length < 2) return {};
    
    const latest = companyData.financial_data[0];
    const previous = companyData.financial_data[1];
    
    return {
      revenue_growth: ((latest.turnover - previous.turnover) / previous.turnover * 100).toFixed(1),
      profit_growth: ((latest.net_profit - previous.net_profit) / previous.net_profit * 100).toFixed(1),
      employee_growth: latest.employees - previous.employees,
      cash_change: latest.cash_at_bank - previous.cash_at_bank
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company details...</p>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Company Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '🏢' },
    { id: 'financials', name: 'Financials', icon: '💰' },
    { id: 'officers', name: 'Officers', icon: '👥' },
    { id: 'filings', name: 'Recent Filings', icon: '📄' },
    { id: 'alerts', name: 'Alerts', icon: '🔔' },
    { id: 'website', name: 'Website Intel', icon: '🌐' },
    { id: 'competitive', name: 'Competitive', icon: '⚔️' },
    { id: 'tenders', name: 'Tender Ops', icon: '📋' },
    { id: 'personnel', name: 'Personnel', icon: '👔' }
  ];

  const trends = calculateFinancialTrends();

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
                <h1 className="text-2xl font-bold text-gray-900">{company?.name}</h1>
                <p className="text-sm text-gray-600">Company #{company?.companies_house_number}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(company?.status)}`}>
                {company?.status || 'Unknown'}
              </span>
              <button
                onClick={() => navigate(`/intelligence/${companyNumber}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Generate Sales Intelligence
              </button>
              <button
                onClick={handleMonitoringToggle}
                disabled={monitoring}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  company?.is_monitored
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {monitoring ? 'Processing...' : (company?.is_monitored ? 'Stop Monitoring' : 'Start Monitoring')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(companyData.financial_data[0]?.turnover)}
              </div>
              <div className="text-xs text-gray-600">Latest Revenue</div>
              {trends.revenue_growth && (
                <div className={`text-xs ${parseFloat(trends.revenue_growth) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.revenue_growth > 0 ? '+' : ''}{trends.revenue_growth}% YoY
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {companyData.financial_data[0]?.employees || 'N/A'}
              </div>
              <div className="text-xs text-gray-600">Employees</div>
              {trends.employee_growth && (
                <div className={`text-xs ${trends.employee_growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.employee_growth > 0 ? '+' : ''}{trends.employee_growth} this year
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {companyData.alerts.length}
              </div>
              <div className="text-xs text-gray-600">Active Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {companyData.tenders.length}
              </div>
              <div className="text-xs text-gray-600">Tender Matches</div>
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
            {/* Basic Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{company?.name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{company?.companies_house_number || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">{company?.status || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Incorporation Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(company?.incorporation_date)}</dd>
                  </div>
                </dl>
              </div>

              {/* Registered Address */}
              {company?.registered_office_address && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Registered Office Address</h3>
                  <div className="text-sm text-gray-900">
                    {company.registered_office_address.address_line_1 && (
                      <p>{company.registered_office_address.address_line_1}</p>
                    )}
                    {company.registered_office_address.address_line_2 && (
                      <p>{company.registered_office_address.address_line_2}</p>
                    )}
                    {company.registered_office_address.locality && (
                      <p>{company.registered_office_address.locality}</p>
                    )}
                    {company.registered_office_address.postal_code && (
                      <p>{company.registered_office_address.postal_code}</p>
                    )}
                    {company.registered_office_address.country && (
                      <p>{company.registered_office_address.country}</p>
                    )}
                  </div>
                </div>
              )}

              {/* SIC Codes */}
              {company?.sic_codes && company.sic_codes.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Activities (SIC Codes)</h3>
                  <div className="space-y-2">
                    {company.sic_codes.map((sic, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{sic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Alerts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Alerts</h3>
                <div className="space-y-3">
                  {companyData.alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="border-l-4 border-blue-500 pl-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{alert.type}</p>
                          <p className="text-xs text-gray-600">{alert.message}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getAlertSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(alert.date)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('filings')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Full Filing History
                  </button>
                  <button 
                    onClick={() => navigate(`/intelligence/${companyNumber}`)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Generate AI Insights
                  </button>
                  <button 
                    onClick={() => setActiveTab('tenders')}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    View Tender Opportunities
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Export Company Data
                  </button>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue (Latest)</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(companyData.financial_data[0]?.turnover)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Profit (Latest)</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(companyData.financial_data[0]?.net_profit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cash at Bank</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(companyData.financial_data[0]?.cash_at_bank)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Employees</span>
                    <span className="text-sm font-medium text-gray-900">
                      {companyData.financial_data[0]?.employees || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-8">
            {/* Financial Trends */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {trends.revenue_growth ? `${trends.revenue_growth}%` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Revenue Growth</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {trends.profit_growth ? `${trends.profit_growth}%` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Profit Growth</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(trends.cash_change)}
                </div>
                <div className="text-sm text-gray-600">Cash Change</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {trends.employee_growth > 0 ? `+${trends.employee_growth}` : trends.employee_growth || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Employee Growth</div>
              </div>
            </div>

            {/* Financial Data Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Financial History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnover</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Profit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Assets</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cash</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companyData.financial_data.map((year) => (
                      <tr key={year.year}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{year.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(year.turnover)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(year.gross_profit)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(year.net_profit)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(year.total_assets)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(year.cash_at_bank)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{year.employees}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Health Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Health Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Strengths</h4>
                  <ul className="space-y-2">
                    {parseFloat(trends.revenue_growth) > 0 && (
                      <li className="text-sm text-green-700 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Strong revenue growth of {trends.revenue_growth}%
                      </li>
                    )}
                    {companyData.financial_data[0]?.cash_at_bank > 100000 && (
                      <li className="text-sm text-green-700 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Healthy cash position
                      </li>
                    )}
                    {trends.employee_growth > 0 && (
                      <li className="text-sm text-green-700 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Growing team size
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Areas to Monitor</h4>
                  <ul className="space-y-2">
                    {parseFloat(trends.profit_growth) < 0 && (
                      <li className="text-sm text-orange-700 flex items-start">
                        <span className="text-orange-500 mr-2">⚠</span>
                        Profit decline needs attention
                      </li>
                    )}
                    <li className="text-sm text-gray-700 flex items-start">
                      <span className="text-gray-500 mr-2">•</span>
                      Monitor cash flow for large projects
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'officers' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Company Officers</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {companyData.officers.map((officer, index) => (
                <div key={index} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-800">{officer.name}</h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{officer.role}</span>
                        {officer.resigned_date && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Resigned</span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Appointed:</span>
                          <div className="text-gray-900">{formatDate(officer.appointed_date)}</div>
                        </div>
                        {officer.resigned_date && (
                          <div>
                            <span className="font-medium text-gray-700">Resigned:</span>
                            <div className="text-gray-900">{formatDate(officer.resigned_date)}</div>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">Nationality:</span>
                          <div className="text-gray-900">{officer.nationality}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Occupation:</span>
                          <div className="text-gray-900">{officer.occupation}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'filings' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Recent Filings</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {companyData.filings.map((filing, index) => (
                <div key={index} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-800">{filing.filing_type}</h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">{filing.status}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{filing.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Filed:</span>
                          <div className="text-gray-900">{formatDate(filing.filing_date)}</div>
                        </div>
                        {filing.period_end && (
                          <div>
                            <span className="font-medium text-gray-700">Period End:</span>
                            <div className="text-gray-900">{formatDate(filing.period_end)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    {filing.document_available && (
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        View Document
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {companyData.alerts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-800">{alert.type}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getAlertSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{alert.message}</p>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-medium text-blue-800 text-sm">Suggested Action:</span>
                      <div className="text-sm text-blue-700">{alert.action_suggested}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 ml-4">
                    {formatDate(alert.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'website' && (
          <div className="space-y-8">
            {/* Website Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {companyData.website_analysis.technology_stack?.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Mentioned Vendors</h3>
                <div className="flex flex-wrap gap-2">
                  {companyData.website_analysis.mentioned_vendors?.map((vendor, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                      {vendor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent News */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent News & Updates</h3>
              <div className="space-y-4">
                {companyData.website_analysis.recent_news?.map((news, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-800">{news.title}</h4>
                    <p className="text-sm text-gray-600">{news.summary}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(news.date)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Services & Certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Services Offered</h3>
                <ul className="space-y-2">
                  {companyData.website_analysis.services_offered?.map((service, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Certifications</h3>
                <div className="space-y-2">
                  {companyData.website_analysis.certifications?.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitive' && (
          <div className="space-y-8">
            {/* Market Position */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Position</h3>
              <p className="text-gray-700">{companyData.competitive_analysis.market_position}</p>
            </div>

            {/* SWOT Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Strengths</h3>
                  <ul className="space-y-2">
                    {companyData.competitive_analysis.differentiators?.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">+</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Opportunities</h3>
                  <ul className="space-y-2">
                    {companyData.competitive_analysis.opportunities?.map((opportunity, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">→</span>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Weaknesses</h3>
                  <ul className="space-y-2">
                    {companyData.competitive_analysis.weaknesses?.map((weakness, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-red-500 mr-2">-</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-orange-800 mb-4">Threats</h3>
                  <ul className="space-y-2">
                    {companyData.competitive_analysis.threats?.map((threat, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-orange-500 mr-2">⚠</span>
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tenders' && (
          <div className="space-y-6">
            {companyData.tenders.map((tender, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-800">{tender.title}</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">{tender.status}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {tender.match_score}% match
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium text-gray-700">Value:</span>
                        <div className="text-gray-900">{tender.value}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Deadline:</span>
                        <div className="text-gray-900">{formatDate(tender.deadline)}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Buyer:</span>
                        <div className="text-gray-900">{tender.buyer}</div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-medium text-purple-800 text-sm">Relevance:</span>
                      <div className="text-sm text-purple-700">{tender.relevance}</div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                      Suggest to Client
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'personnel' && (
          <div className="space-y-8">
            {/* Key Personnel */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Personnel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companyData.linkedin_data.key_personnel?.map((person, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800">{person.name}</h4>
                    <p className="text-sm text-blue-600">{person.role}</p>
                    <p className="text-sm text-gray-600">Tenure: {person.tenure}</p>
                    <p className="text-xs text-gray-500 mt-1">{person.background}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Changes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Recent Hires</h3>
                <div className="space-y-3">
                  {companyData.linkedin_data.recent_hires?.map((hire, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-3">
                      <p className="font-medium text-gray-800">{hire.name}</p>
                      <p className="text-sm text-gray-600">{hire.role}</p>
                      <p className="text-xs text-gray-500">Started: {formatDate(hire.start_date)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Recent Departures</h3>
                <div className="space-y-3">
                  {companyData.linkedin_data.recent_departures?.map((departure, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-3">
                      <p className="font-medium text-gray-800">{departure.name}</p>
                      <p className="text-sm text-gray-600">{departure.role}</p>
                      <p className="text-xs text-gray-500">Left: {formatDate(departure.end_date)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Updates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Company Updates</h3>
              <div className="space-y-4">
                {companyData.linkedin_data.company_updates?.map((update, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">{update.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{formatDate(update.date)}</span>
                      <div className="text-xs text-gray-500">
                        {update.engagement.likes} likes • {update.engagement.comments} comments
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyDetail;