// CompanyOverview.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

const CompanyOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOverviewStats();
  }, []);

  const loadOverviewStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await apiService.getOverviewStats();
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to load overview statistics');
      }
    } catch (err) {
      setError('Failed to load overview statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Overview</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadOverviewStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const mockStats = stats || {
    total_companies: 2847,
    monitored_companies: 156,
    alerts_last_24h: 23,
    new_companies: 45,
    recent_growth: 12.5,
    monitoring_health: 98.2
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Company Overview</h2>
        <button
          onClick={() => navigate('/companies')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">{mockStats.total_companies.toLocaleString()}</div>
          <div className="text-sm text-blue-700 mt-1">Total Companies</div>
          <div className="text-xs text-blue-600 mt-2">
            +{mockStats.new_companies} this month
          </div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600">{mockStats.monitored_companies}</div>
          <div className="text-sm text-green-700 mt-1">Monitored</div>
          <div className="text-xs text-green-600 mt-2">
            {mockStats.monitoring_health}% health
          </div>
        </div>

        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-3xl font-bold text-yellow-600">{mockStats.alerts_last_24h}</div>
          <div className="text-sm text-yellow-700 mt-1">Alerts (24h)</div>
          <div className="text-xs text-yellow-600 mt-2">
            +{mockStats.recent_growth}% vs last week
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Data freshness</span>
          <span className="text-sm text-green-600 font-medium">Updated 5 min ago</span>
        </div>
      </div>
    </div>
  );
};

// DashboardMetrics.jsx
const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics({
        revenue_pipeline: 2340000,
        active_opportunities: 23,
        conversion_rate: 14.8,
        avg_deal_size: 185000,
        monthly_growth: 8.5,
        customer_satisfaction: 4.7
      });
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Key Metrics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(metrics?.revenue_pipeline || 0)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Revenue Pipeline</div>
          <div className="text-xs text-green-600 mt-1">↗ +{metrics?.monthly_growth || 0}%</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{metrics?.active_opportunities || 0}</div>
          <div className="text-sm text-gray-600 mt-1">Active Opportunities</div>
          <div className="text-xs text-blue-600 mt-1">3 closing this week</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{metrics?.conversion_rate || 0}%</div>
          <div className="text-sm text-gray-600 mt-1">Conversion Rate</div>
          <div className="text-xs text-green-600 mt-1">↗ +2.1%</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(metrics?.avg_deal_size || 0)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Avg Deal Size</div>
          <div className="text-xs text-gray-600 mt-1">12 deals closed</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{metrics?.customer_satisfaction || 0}/5</div>
          <div className="text-sm text-gray-600 mt-1">Customer Rating</div>
          <div className="text-xs text-green-600 mt-1">★★★★★</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">94%</div>
          <div className="text-sm text-gray-600 mt-1">Data Quality</div>
          <div className="text-xs text-blue-600 mt-1">2.3k verified</div>
        </div>
      </div>
    </div>
  );
};

// RecentActivity.jsx
const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      setLoading(true);
      
      // Mock data
      const mockActivities = [
        {
          id: 1,
          type: 'company_alert',
          title: 'New filing detected',
          description: 'TechFlow Solutions Ltd filed annual accounts',
          timestamp: '2025-01-15T14:30:00Z',
          icon: '📄',
          color: 'blue'
        },
        {
          id: 2,
          type: 'tender_match',
          title: 'Tender opportunity match',
          description: 'Digital Transformation - Education Sector (£2.3M)',
          timestamp: '2025-01-15T13:45:00Z',
          icon: '🎯',
          color: 'green'
        },
        {
          id: 3,
          type: 'contact_update',
          title: 'Contact verification completed',
          description: 'Sarah Johnson - NHS Digital Health Trust',
          timestamp: '2025-01-15T12:20:00Z',
          icon: '✅',
          color: 'purple'
        },
        {
          id: 4,
          type: 'system_alert',
          title: 'Data sync completed',
          description: 'Daily sync processed 15,420 records',
          timestamp: '2025-01-15T08:00:00Z',
          icon: '🔄',
          color: 'gray'
        }
      ];
      
      setActivities(mockActivities);
    } catch (err) {
      console.error('Failed to load recent activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return time.toLocaleDateString();
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(activity.color)}`}>
              <span className="text-lg">{activity.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  );
};

// QuickSearch.jsx
const QuickSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      performSearch(query);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true);
      
      // Mock search results
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockResults = [
        {
          id: 'comp_1',
          type: 'company',
          title: 'TechFlow Solutions Ltd',
          subtitle: 'Company #08123456',
          url: '/company/08123456'
        },
        {
          id: 'tender_1',
          type: 'tender',
          title: 'Digital Transformation Services',
          subtitle: '£2.3M • Deadline: Feb 15',
          url: '/tenders/T001'
        },
        {
          id: 'contact_1',
          type: 'contact',
          title: 'Sarah Johnson',
          subtitle: 'CTO at NHS Digital Health Trust',
          url: '/contacts/2'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(mockResults);
      setShowResults(true);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    navigate(result.url);
    setQuery('');
    setShowResults(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'company': return '🏢';
      case 'tender': return '📋';
      case 'contact': return '👤';
      default: return '📄';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Quick search companies, tenders, contacts..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-2">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getTypeIcon(result.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{result.title}</div>
                    <div className="text-sm text-gray-600">{result.subtitle}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-200 px-4 py-2">
            <button
              onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all results for "{query}" →
            </button>
          </div>
        </div>
      )}

      {showResults && results.length === 0 && !loading && query.length > 2 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-4 px-4 text-center text-gray-500">
            No results found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

// TenderOpportunities.jsx
const TenderOpportunities = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      
      const mockOpportunities = [
        {
          id: 'T001',
          title: 'Digital Transformation Services - Education Sector',
          value: '£2.3M',
          deadline: '2025-02-15T23:59:59Z',
          buyer: 'Department for Education',
          match_score: 95,
          status: 'open'
        },
        {
          id: 'T002',
          title: 'Healthcare Data Analytics Platform',
          value: '£850K',
          deadline: '2025-02-28T23:59:59Z',
          buyer: 'NHS Foundation Trust',
          match_score: 88,
          status: 'open'
        },
        {
          id: 'T003',
          title: 'Cybersecurity Assessment Framework',
          value: '£450K',
          deadline: '2025-03-15T23:59:59Z',
          buyer: 'Local Authority',
          match_score: 76,
          status: 'open'
        }
      ];
      
      setOpportunities(mockOpportunities);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days left`;
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tender Opportunities</h2>
        <button
          onClick={() => navigate('/tenders')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            onClick={() => navigate(`/tenders/${opportunity.id}`)}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 text-sm">{opportunity.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getMatchScoreColor(opportunity.match_score)}`}>
                {opportunity.match_score}% match
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Value:</span> {opportunity.value}
              </div>
              <div>
                <span className="font-medium">Deadline:</span> {formatDeadline(opportunity.deadline)}
              </div>
            </div>
            
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Buyer:</span> {opportunity.buyer}
            </div>
          </div>
        ))}
      </div>

      {opportunities.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500">No tender opportunities available</p>
        </div>
      )}
    </div>
  );
};

// UpcomingTasks.jsx
const UpcomingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      
      const mockTasks = [
        {
          id: 1,
          title: 'Review Q1 performance metrics',
          description: 'Analyze quarterly performance and prepare report',
          due_date: '2025-01-20T09:00:00Z',
          priority: 'high',
          type: 'review',
          assignee: 'You'
        },
        {
          id: 2,
          title: 'Follow up with TechFlow Solutions',
          description: 'Schedule meeting to discuss partnership opportunities',
          due_date: '2025-01-18T14:00:00Z',
          priority: 'medium',
          type: 'follow_up',
          assignee: 'Sarah Johnson'
        },
        {
          id: 3,
          title: 'Tender deadline reminder',
          description: 'Digital Transformation - Education Sector submission due',
          due_date: '2025-01-17T16:00:00Z',
          priority: 'high',
          type: 'deadline',
          assignee: 'Team'
        }
      ];
      
      setTasks(mockTasks);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'review': return '📊';
      case 'follow_up': return '📞';
      case 'deadline': return '⏰';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <span className="text-lg">{getTypeIcon(task.type)}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Due: {formatDueDate(task.due_date)}</span>
                    <span>Assignee: {task.assignee}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => markComplete(task.id)}
                  className="text-green-600 hover:text-green-800"
                  title="Mark complete"
                >
                  ✓
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500">All tasks completed! 🎉</p>
        </div>
      )}
    </div>
  );
};

// Export components for use
export {
  CompanyOverview,
  DashboardMetrics,
  RecentActivity,
  QuickSearch,
  TenderOpportunities,
  UpcomingTasks
};