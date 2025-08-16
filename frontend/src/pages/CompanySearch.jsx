import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const CompanySearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [filters, setFilters] = useState({
    company_status: 'all',
    company_type: 'all',
    sic_codes: [],
    incorporation_date_from: '',
    incorporation_date_to: '',
    postcode: '',
    county: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestedCompanies, setSuggestedCompanies] = useState([]);

  useEffect(() => {
    loadRecentSearches();
    loadSuggestedCompanies();
  }, []);

  const loadRecentSearches = () => {
    // Mock recent searches - would come from API
    const mockRecentSearches = [
      { query: 'TechFlow Solutions', type: 'name', timestamp: '2025-01-15T10:30:00Z' },
      { query: '12345678', type: 'number', timestamp: '2025-01-14T15:20:00Z' },
      { query: 'Digital transformation', type: 'keyword', timestamp: '2025-01-13T09:15:00Z' }
    ];
    setRecentSearches(mockRecentSearches);
  };

  const loadSuggestedCompanies = () => {
    // Mock suggested companies based on user's profile
    const mockSuggestions = [
      {
        company_number: '08123456',
        company_name: 'CloudTech Solutions Ltd',
        company_status: 'active',
        incorporation_date: '2012-03-15',
        company_type: 'ltd',
        registered_office_address: {
          address_line_1: 'Tech House',
          locality: 'Manchester',
          postal_code: 'M1 4ET'
        },
        sic_codes: ['62020', '62090'],
        suggestion_reason: 'Similar to companies you already monitor'
      },
      {
        company_number: '09876543',
        company_name: 'Digital Education Partners',
        company_status: 'active',
        incorporation_date: '2015-09-22',
        company_type: 'ltd',
        registered_office_address: {
          address_line_1: 'Education Centre',
          locality: 'Leeds',
          postal_code: 'LS1 3AB'
        },
        sic_codes: ['85420', '62020'],
        suggestion_reason: 'Growing in your target sectors'
      },
      {
        company_number: '11223344',
        company_name: 'SecureIT Consulting Ltd',
        company_status: 'active',
        incorporation_date: '2018-06-10',
        company_type: 'ltd',
        registered_office_address: {
          address_line_1: 'Security Plaza',
          locality: 'Birmingham',
          postal_code: 'B1 2CD'
        },
        sic_codes: ['62090', '80100'],
        suggestion_reason: 'Competitor in cybersecurity sector'
      }
    ];
    setSuggestedCompanies(mockSuggestions);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Mock search results - would use real Companies House API
      const mockResults = [
        {
          company_number: '12345678',
          company_name: 'TechFlow Solutions Ltd',
          company_status: 'active',
          incorporation_date: '2010-05-20',
          company_type: 'ltd',
          registered_office_address: {
            address_line_1: 'Innovation Hub',
            address_line_2: 'Tech Quarter',
            locality: 'London',
            postal_code: 'EC1A 1BB'
          },
          sic_codes: ['62020', '62090'],
          date_of_creation: '2010-05-20',
          accounts: {
            next_due: '2025-03-31',
            last_accounts: {
              made_up_to: '2024-03-31',
              type: 'full'
            }
          },
          match_score: 95,
          is_monitored: false,
          monitoring_eligibility: 'High - Perfect fit for your criteria'
        },
        {
          company_number: '87654321',
          company_name: 'TechFlow Digital Services',
          company_status: 'active',
          incorporation_date: '2015-11-12',
          company_type: 'ltd',
          registered_office_address: {
            address_line_1: 'Business Park',
            locality: 'Manchester',
            postal_code: 'M2 3XY'
          },
          sic_codes: ['62020'],
          date_of_creation: '2015-11-12',
          accounts: {
            next_due: '2025-05-31',
            last_accounts: {
              made_up_to: '2024-05-31',
              type: 'small'
            }
          },
          match_score: 78,
          is_monitored: false,
          monitoring_eligibility: 'Medium - Good potential prospect'
        },
        {
          company_number: '11111111',
          company_name: 'FlowTech Innovations Ltd',
          company_status: 'active',
          incorporation_date: '2020-01-08',
          company_type: 'ltd',
          registered_office_address: {
            address_line_1: 'Startup Centre',
            locality: 'Bristol',
            postal_code: 'BS1 5TR'
          },
          sic_codes: ['62020', '72190'],
          date_of_creation: '2020-01-08',
          accounts: {
            next_due: '2025-01-31',
            last_accounts: {
              made_up_to: '2024-01-31',
              type: 'micro'
            }
          },
          match_score: 82,
          is_monitored: true,
          monitoring_eligibility: 'High - Already monitoring'
        }
      ];

      setResults(mockResults);
      
      // Add to recent searches
      const newSearch = {
        query: searchQuery,
        type: searchType,
        timestamp: new Date().toISOString()
      };
      setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]);

    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToMonitoring = async (company) => {
    try {
      // Mock API call
      console.log('Adding to monitoring:', company.company_number);
      
      // Update local state
      setResults(prev => prev.map(result => 
        result.company_number === company.company_number 
          ? { ...result, is_monitored: true }
          : result
      ));

      // Optional: Show success message
    } catch (error) {
      console.error('Failed to add to monitoring:', error);
    }
  };

  const handleBulkAdd = async () => {
    try {
      for (const company of selectedCompanies) {
        await handleAddToMonitoring(company);
      }
      setSelectedCompanies([]);
    } catch (error) {
      console.error('Bulk add failed:', error);
    }
  };

  const handleCompanySelect = (company) => {
    setSelectedCompanies(prev => {
      const isSelected = prev.some(c => c.company_number === company.company_number);
      if (isSelected) {
        return prev.filter(c => c.company_number !== company.company_number);
      } else {
        return [...prev, company];
      }
    });
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'dissolved': return 'bg-red-100 text-red-800';
      case 'liquidation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const sicCodeDescriptions = {
    '62020': 'Information technology consultancy activities',
    '62090': 'Other information technology service activities',
    '85420': 'Higher education',
    '72190': 'Other research and experimental development',
    '80100': 'Private security activities'
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Company Search</h1>
                <p className="text-sm text-gray-600">Find and add companies to monitor</p>
              </div>
            </div>
            {selectedCompanies.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedCompanies.length} selected
                </span>
                <button
                  onClick={handleBulkAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Selected to Monitoring
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="flex">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="name">Company Name</option>
                  <option value="number">Company Number</option>
                  <option value="keyword">Keyword</option>
                  <option value="officer">Officer Name</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={`Search by ${searchType}...`}
                  className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading || !searchQuery.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Advanced Filters {showAdvancedFilters ? '−' : '+'}
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Status
                  </label>
                  <select
                    value={filters.company_status}
                    onChange={(e) => setFilters({...filters, company_status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="dissolved">Dissolved</option>
                    <option value="liquidation">In liquidation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Type
                  </label>
                  <select
                    value={filters.company_type}
                    onChange={(e) => setFilters({...filters, company_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All types</option>
                    <option value="ltd">Private limited</option>
                    <option value="plc">Public limited</option>
                    <option value="llp">Limited liability partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postcode Area
                  </label>
                  <input
                    type="text"
                    value={filters.postcode}
                    onChange={(e) => setFilters({...filters, postcode: e.target.value})}
                    placeholder="e.g., M1, EC1A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incorporated From
                  </label>
                  <input
                    type="date"
                    value={filters.incorporation_date_from}
                    onChange={(e) => setFilters({...filters, incorporation_date_from: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incorporated To
                  </label>
                  <input
                    type="date"
                    value={filters.incorporation_date_to}
                    onChange={(e) => setFilters({...filters, incorporation_date_to: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    County
                  </label>
                  <input
                    type="text"
                    value={filters.county}
                    onChange={(e) => setFilters({...filters, county: e.target.value})}
                    placeholder="e.g., Greater London"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchQuery && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(search.query);
                      setSearchType(search.type);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    {search.query} ({search.type})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Search Results ({results.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {results.map((company) => (
                <div key={company.company_number} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.some(c => c.company_number === company.company_number)}
                        onChange={() => handleCompanySelect(company)}
                        className="mt-1"
                        disabled={company.is_monitored}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-800">
                            {company.company_name}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(company.company_status)}`}>
                            {company.company_status}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getMatchScoreColor(company.match_score)}`}>
                            {company.match_score}% match
                          </span>
                          {company.is_monitored && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              Monitoring
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Company Number:</span>
                            <div className="text-gray-900">{company.company_number}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Incorporated:</span>
                            <div className="text-gray-900">{formatDate(company.incorporation_date)}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Type:</span>
                            <div className="text-gray-900 uppercase">{company.company_type}</div>
                          </div>
                        </div>

                        {company.registered_office_address && (
                          <div className="mt-3">
                            <span className="font-medium text-gray-700 text-sm">Address:</span>
                            <div className="text-sm text-gray-600">
                              {company.registered_office_address.address_line_1}
                              {company.registered_office_address.address_line_2 && 
                                `, ${company.registered_office_address.address_line_2}`}
                              {company.registered_office_address.locality && 
                                `, ${company.registered_office_address.locality}`}
                              {company.registered_office_address.postal_code && 
                                ` ${company.registered_office_address.postal_code}`}
                            </div>
                          </div>
                        )}

                        {company.sic_codes && company.sic_codes.length > 0 && (
                          <div className="mt-3">
                            <span className="font-medium text-gray-700 text-sm">Business Activities:</span>
                            <div className="mt-1 space-y-1">
                              {company.sic_codes.map((code) => (
                                <div key={code} className="text-sm text-gray-600">
                                  {code} - {sicCodeDescriptions[code] || 'Other business activities'}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium text-blue-800 text-sm">Monitoring Eligibility:</span>
                          <div className="text-sm text-blue-700">{company.monitoring_eligibility}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => navigate(`/company/${company.company_number}`)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                      >
                        View Details
                      </button>
                      {!company.is_monitored ? (
                        <button
                          onClick={() => handleAddToMonitoring(company)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Add to Monitoring
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                        >
                          Already Monitoring
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/intelligence/${company.company_number}`)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        Generate Intelligence
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Companies */}
        {results.length === 0 && suggestedCompanies.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Suggested Companies</h3>
              <p className="text-sm text-gray-600">Companies that might interest you based on your activity</p>
            </div>
            <div className="divide-y divide-gray-200">
              {suggestedCompanies.map((company) => (
                <div key={company.company_number} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-800">
                          {company.company_name}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(company.company_status)}`}>
                          {company.company_status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="font-medium text-gray-700">Company Number:</span>
                          <div className="text-gray-900">{company.company_number}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Incorporated:</span>
                          <div className="text-gray-900">{formatDate(company.incorporation_date)}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Location:</span>
                          <div className="text-gray-900">
                            {company.registered_office_address.locality}, {company.registered_office_address.postal_code}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium text-purple-800 text-sm">Why suggested:</span>
                        <div className="text-sm text-purple-700">{company.suggestion_reason}</div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => navigate(`/company/${company.company_number}`)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleAddToMonitoring(company)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Add to Monitoring
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !loading && searchQuery && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No companies found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or using different filters
            </p>
            <button
              onClick={() => setShowAdvancedFilters(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Advanced Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySearch;