import React, { useState, useEffect } from 'react';

const ReportsAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // Mock analytics data
      const mockData = {
        overview: {
          total_companies: 2847,
          new_companies_this_period: 134,
          active_opportunities: 23,
          total_value_tracked: '£12.4M',
          success_rate: 68.5,
          avg_deal_size: '£185K'
        },
        tender_analytics: {
          total_tenders: 145,
          won_tenders: 23,
          lost_tenders: 19,
          pending_tenders: 103,
          win_rate: 54.8,
          average_bid_cost: '£12,500',
          total_revenue_from_tenders: '£4.2M'
        },
        sales_pipeline: [
          { stage: 'Prospecting', count: 45, value: '£1.2M' },
          { stage: 'Initial Contact', count: 32, value: '£890K' },
          { stage: 'Needs Analysis', count: 18, value: '£675K' },
          { stage: 'Proposal', count: 12, value: '£445K' },
          { stage: 'Negotiation', count: 8, value: '£320K' },
          { stage: 'Closed Won', count: 5, value: '£185K' }
        ],
        monthly_metrics: [
          { month: 'Jan', companies: 180, tenders: 12, revenue: 245000 },
          { month: 'Feb', companies: 165, tenders: 15, revenue: 310000 },
          { month: 'Mar', companies: 201, tenders: 18, revenue: 425000 },
          { month: 'Apr', companies: 189, tenders: 14, revenue: 380000 },
          { month: 'May', companies: 234, tenders: 21, revenue: 520000 },
          { month: 'Jun', companies: 198, tenders: 16, revenue: 445000 }
        ]
      };
      setReportData(mockData);
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    // Mock export functionality
    console.log(`Exporting report as ${format}`);
    alert(`Report exported as ${format.toUpperCase()}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'tenders', name: 'Tender Analytics', icon: '📋' },
    { id: 'sales', name: 'Sales Pipeline', icon: '💰' },
    { id: 'companies', name: 'Company Intelligence', icon: '🏢' },
    { id: 'custom', name: 'Custom Reports', icon: '⚙️' }
  ];

  const dateRanges = [
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-sm text-gray-600">Insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportReport('pdf')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => exportReport('excel')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

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
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Companies</p>
                    <p className="text-2xl font-semibold text-gray-900">{reportData.overview?.total_companies?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-green-600 text-sm font-medium">+{reportData.overview?.new_companies_this_period} this period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Opportunities</p>
                    <p className="text-2xl font-semibold text-gray-900">{reportData.overview?.active_opportunities}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-blue-600 text-sm font-medium">{reportData.overview?.total_value_tracked} total value</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatPercentage(reportData.overview?.success_rate)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-gray-600 text-sm">Avg deal: {reportData.overview?.avg_deal_size}</span>
                </div>
              </div>
            </div>

            {/* Monthly Trends Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Performance</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {reportData.monthly_metrics?.map((month, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '200px' }}>
                      <div 
                        className="bg-blue-500 rounded-t absolute bottom-0 w-full"
                        style={{ height: `${(month.companies / 250) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      <div className="font-medium">{month.month}</div>
                      <div>{month.companies} companies</div>
                      <div>{formatCurrency(month.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tenders' && (
          <div className="space-y-8">
            {/* Tender Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600">Total Tenders</h3>
                <p className="text-3xl font-bold text-gray-900">{reportData.tender_analytics?.total_tenders}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600">Win Rate</h3>
                <p className="text-3xl font-bold text-green-600">{formatPercentage(reportData.tender_analytics?.win_rate)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600">Avg Bid Cost</h3>
                <p className="text-3xl font-bold text-blue-600">{reportData.tender_analytics?.average_bid_cost}</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                <p className="text-3xl font-bold text-purple-600">{reportData.tender_analytics?.total_revenue_from_tenders}</p>
              </div>
            </div>

            {/* Tender Status Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Tender Status Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">{reportData.tender_analytics?.won_tenders}</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Won</h4>
                  <p className="text-sm text-gray-600">Successful bids</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-600">{reportData.tender_analytics?.lost_tenders}</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Lost</h4>
                  <p className="text-sm text-gray-600">Unsuccessful bids</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-yellow-600">{reportData.tender_analytics?.pending_tenders}</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Pending</h4>
                  <p className="text-sm text-gray-600">In progress</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-8">
            {/* Sales Pipeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales Pipeline</h3>
              <div className="space-y-4">
                {reportData.sales_pipeline?.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{stage.count}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                        <p className="text-sm text-gray-600">{stage.count} opportunities</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{stage.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Company Intelligence Metrics</h3>
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>Company intelligence reports coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Custom Report Builder</h3>
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <p>Custom report builder coming soon</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Request Feature
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsAnalytics;