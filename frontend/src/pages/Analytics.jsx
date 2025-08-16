import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      total_companies: 0,
      active_monitoring: 0,
      alerts_generated: 0,
      data_points_collected: 0
    },
    trends: {
      companies_added: [],
      alerts_by_type: [],
      monthly_activity: []
    },
    performance: {
      api_response_time: 0,
      data_accuracy: 0,
      uptime: 0
    }
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // For now, using dashboard data and simulating analytics
      const result = await apiService.getDashboardData();
      if (result.success) {
        // Simulate analytics data based on dashboard data
        setAnalyticsData({
          overview: {
            total_companies: result.data.stats?.total_companies || 0,
            active_monitoring: result.data.stats?.active_monitoring || 0,
            alerts_generated: result.data.stats?.unread_alerts || 0,
            data_points_collected: Math.floor(Math.random() * 10000) + 5000
          },
          trends: {
            companies_added: generateTrendData(),
            alerts_by_type: generateAlertTypeData(),
            monthly_activity: generateMonthlyData()
          },
          performance: {
            api_response_time: 150 + Math.floor(Math.random() * 50),
            data_accuracy: 98.5 + Math.random() * 1.5,
            uptime: 99.8 + Math.random() * 0.2
          }
        });
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateTrendData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        companies: Math.floor(Math.random() * 10) + 1,
        alerts: Math.floor(Math.random() * 15) + 2
      });
    }
    return data;
  };

  const generateAlertTypeData = () => {
    return [
      { type: 'Status Change', count: 45, percentage: 35 },
      { type: 'Filing Due', count: 32, percentage: 25 },
      { type: 'Officer Change', count: 28, percentage: 22 },
      { type: 'Address Change', count: 23, percentage: 18 }
    ];
  };

  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      companies: Math.floor(Math.random() * 50) + 10,
      alerts: Math.floor(Math.random() * 100) + 20,
      api_calls: Math.floor(Math.random() * 1000) + 500
    }));
  };

  const StatCard = ({ title, value, change, icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
        <div className={`text-3xl`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, title, type = 'line' }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-64 flex items-end justify-center space-x-2">
        {data.slice(0, 10).map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div
              className="bg-blue-500 rounded-t"
              style={{
                height: `${Math.max((item.companies || item.count || 0) * 4, 8)}px`,
                width: '24px'
              }}
            ></div>
            <span className="text-xs text-gray-600 transform -rotate-45 origin-top-left">
              {item.date ? item.date.split('-')[2] : item.type?.slice(0, 3) || item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-600">Insights and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Companies"
            value={analyticsData.overview.total_companies.toLocaleString()}
            change={5.2}
            icon="🏢"
          />
          <StatCard
            title="Active Monitoring"
            value={analyticsData.overview.active_monitoring.toLocaleString()}
            change={12.3}
            icon="👁️"
          />
          <StatCard
            title="Alerts Generated"
            value={analyticsData.overview.alerts_generated.toLocaleString()}
            change={-2.1}
            icon="🔔"
          />
          <StatCard
            title="Data Points"
            value={analyticsData.overview.data_points_collected.toLocaleString()}
            change={8.7}
            icon="📊"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SimpleChart
            data={analyticsData.trends.companies_added}
            title="Companies Added Over Time"
          />
          <SimpleChart
            data={analyticsData.trends.alerts_by_type}
            title="Alerts by Type"
            type="bar"
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">API Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Response Time</span>
                  <span>{analyticsData.performance.api_response_time}ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Data Accuracy</span>
                  <span>{analyticsData.performance.data_accuracy.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.performance.data_accuracy}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>System Uptime</span>
                  <span>{analyticsData.performance.uptime.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.performance.uptime}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Alert Types</h3>
            <div className="space-y-3">
              {analyticsData.trends.alerts_by_type.map((alert, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{alert.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{alert.count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${alert.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Activity</h3>
            <div className="space-y-3">
              {analyticsData.trends.monthly_activity.slice(-4).map((month, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{month.month}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">{month.companies} companies</div>
                    <div className="text-xs text-gray-500">{month.alerts} alerts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Analytics Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Companies Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alerts Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Calls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.trends.companies_added.slice(-7).map((day, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.companies}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.alerts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.floor(Math.random() * 200) + 50}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Normal
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Export Analytics</h3>
              <p className="text-sm text-gray-600">Download your analytics data for further analysis</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Export CSV
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;