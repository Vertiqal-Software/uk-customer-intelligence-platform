import React, { useState, useEffect } from 'react';

const AdvancedSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    entity_type: [],
    date_range: '',
    location: '',
    industry: [],
    company_size: [],
    status: [],
    value_range: { min: '', max: '' }
  });
  const [savedSearches, setSavedSearches] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSavedSearches();
    loadSearchHistory();
  }, []);

  const loadSavedSearches = async () => {
    try {
      // Mock saved searches
      const mockSaved = [
        {
          id: 'search_001',
          name: 'Tech Companies London',
          query: 'technology software',
          filters: {
            entity_type: ['companies'],
            location: 'London',
            industry: ['Technology'],
            company_size: ['51-200 employees', '201-500 employees']
          },
          created_at: '2025-01-10T10:30:00Z',
          last_used: '2025-01-15T09:20:00Z'
        },
        {
          id: 'search_002',
          name: 'NHS Tenders',
          query: 'NHS healthcare',
          filters: {
            entity_type: ['tenders'],
            industry: ['Healthcare'],
            value_range: { min: '100000', max: '5000000' }
          },
          created_at: '2025-01-08T15:45:00Z',
          last_used: '2025-01-14T11:10:00Z'
        },
        {
          id: 'search_003',
          name: 'Education Directors',
          query: 'director education university',
          filters: {
            entity_type: ['contacts'],
            industry: ['Education'],
            location: 'UK'
          },
          created_at: '2025-01-05T14:20:00Z',
          last_used: '2025-01-12T16:30:00Z'
        }
      ];
      setSavedSearches(mockSaved);
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    }
  };

  const loadSearchHistory = async () => {
    try {
      // Mock search history
      const mockHistory = [
        {
          id: 'hist_001',
          query: 'cloud migration services',
          type: 'companies',
          timestamp: '2025-01-15T10:30:00Z',
          results_count: 47
        },
        {
          id: 'hist_002',
          query: 'digital transformation tenders',
          type: 'tenders',
          timestamp: '2025-01-15T09:15:00Z',
          results_count: 23
        },
        {
          id: 'hist_003',
          query: 'CTO technology companies',
          type: 'contacts',
          timestamp: '2025-01-14T16:45:00Z',
          results_count: 156
        }
      ];
      setSearchHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Mock search results
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResults = [
        {
          id: 'comp_001',
          type: 'company',
          title: 'TechFlow Solutions Ltd',
          subtitle: 'Technology consulting and cloud services',
          description: 'Leading provider of cloud migration and digital transformation services for enterprise clients.',
          metadata: {
            company_number: '08123456',
            location: 'London, UK',
            industry: 'Technology',
            employees: '150-200',
            revenue: '£12.5M'
          },
          score: 95,
          url: '/company/08123456'
        },
        {
          id: 'tend_001',
          type: 'tender',
          title: 'Digital Transformation Services - Education Sector',
          subtitle: 'Multi-year framework for educational institutions',
          description: 'Comprehensive digital transformation consultancy and implementation services for UK educational institutions.',
          metadata: {
            value: '£2.3M',
            deadline: '2025-02-15',
            buyer: 'Department for Education',
            location: 'England',
            cpv_codes: ['72000000', '72400000']
          },
          score: 89,
          url: '/tenders/T001'
        },
        {
          id: 'cont_001',
          type: 'contact',
          title: 'Sarah Johnson',
          subtitle: 'Digital Transformation Director',
          description: 'Experienced technology leader specializing in digital transformation and cloud migration projects.',
          metadata: {
            company: 'NHS Digital Health Trust',
            location: 'Manchester, UK',
            department: 'IT',
            email: 'sarah.j@nhs.uk',
            phone: '+44 161 987 6543'
          },
          score: 82,
          url: '/contacts/2'
        }
      ];
      
      const filteredResults = mockResults.filter(result => {
        if (searchType !== 'all' && result.type !== searchType) return false;
        if (filters.entity_type.length > 0 && !filters.entity_type.includes(result.type + 's')) return false;
        return true;
      });
      
      setResults(filteredResults);
      
      // Add to search history
      const newHistoryItem = {
        id: `hist_${Date.now()}`,
        query,
        type: searchType,
        timestamp: new Date().toISOString(),
        results_count: filteredResults.length
      };
      setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async (name) => {
    try {
      const newSavedSearch = {
        id: `search_${Date.now()}`,
        name,
        query: searchQuery,
        filters: { ...filters },
        created_at: new Date().toISOString(),
        last_used: new Date().toISOString()
      };
      
      setSavedSearches(prev => [newSavedSearch, ...prev]);
      setShowSaveModal(false);
      alert('Search saved successfully!');
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  };

  const loadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch.query);
    setFilters(savedSearch.filters);
    setSearchType(savedSearch.filters.entity_type[0]?.slice(0, -1) || 'all');
    handleSearch(savedSearch.query);
  };

  const clearFilters = () => {
    setFilters({
      entity_type: [],
      date_range: '',
      location: '',
      industry: [],
      company_size: [],
      status: [],
      value_range: { min: '', max: '' }
    });
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleArrayFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'company': return '🏢';
      case 'tender': return '📋';
      case 'contact': return '👤';
      default: return '📄';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const entityTypes = [
    { value: 'companies', label: 'Companies' },
    { value: 'tenders', label: 'Tenders' },
    { value: 'contacts', label: 'Contacts' }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Construction', 'Energy', 'Transport', 'Professional Services'
  ];

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees',
    '201-500 employees', '500+ employees'
  ];

  const activeFiltersCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) return count + filter.length;
    if (typeof filter === 'object' && filter.min && filter.max) return count + 1;
    if (filter && filter !== '') return count + 1;
    return count;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Advanced Search</h1>
              <p className="text-sm text-gray-600">Search across companies, tenders, and contacts</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Saved Searches */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Searches</h3>
              <div className="space-y-3">
                {savedSearches.slice(0, 5).map((search) => (
                  <button
                    key={search.id}
                    onClick={() => loadSavedSearch(search)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{search.name}</div>
                    <div className="text-sm text-gray-600">{search.query}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last used: {formatDate(search.last_used)}
                    </div>
                  </button>
                ))}
                {savedSearches.length === 0 && (
                  <p className="text-sm text-gray-500">No saved searches yet</p>
                )}
              </div>
            </div>

            {/* Search History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Searches</h3>
              <div className="space-y-2">
                {searchHistory.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearch(item.query)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">{item.query}</div>
                    <div className="text-xs text-gray-500">
                      {item.results_count} results • {formatDate(item.timestamp)}
                    </div>
                  </button>
                ))}
                {searchHistory.length === 0 && (
                  <p className="text-sm text-gray-500">No recent searches</p>
                )}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  {showFilters ? 'Hide' : 'Show'} ({activeFiltersCount})
                </button>
              </div>
              
              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Entity Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entity Type</label>
                  <div className="space-y-2">
                    {entityTypes.map((type) => (
                      <label key={type.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.entity_type.includes(type.value)}
                          onChange={() => toggleArrayFilter('entity_type', type.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    placeholder="e.g., London, UK"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {industries.map((industry) => (
                      <label key={industry} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.industry.includes(industry)}
                          onChange={() => toggleArrayFilter('industry', industry)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Company Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  <div className="space-y-1">
                    {companySizes.map((size) => (
                      <label key={size} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.company_size.includes(size)}
                          onChange={() => toggleArrayFilter('company_size', size)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Value Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value Range (£)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={filters.value_range.min}
                      onChange={(e) => updateFilter('value_range', { ...filters.value_range, min: e.target.value })}
                      placeholder="Min"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={filters.value_range.max}
                      onChange={(e) => updateFilter('value_range', { ...filters.value_range, max: e.target.value })}
                      placeholder="Max"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear All Filters ({activeFiltersCount})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search companies, tenders, contacts..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="company">Companies</option>
                  <option value="tender">Tenders</option>
                  <option value="contact">Contacts</option>
                </select>
                <button
                  onClick={() => handleSearch()}
                  disabled={loading || !searchQuery.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-3">
                  {searchQuery && (
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                    >
                      💾 Save Search
                    </button>
                  )}
                </div>
                
                {results.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {results.length} results found
                  </div>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-2xl">{getResultIcon(result.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                            {result.type}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${getScoreColor(result.score)}`}>
                            {result.score}% match
                          </span>
                        </div>
                        <p className="text-gray-600 font-medium mb-2">{result.subtitle}</p>
                        <p className="text-gray-600 mb-3">{result.description}</p>
                        
                        {/* Metadata */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          {Object.entries(result.metadata).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium text-gray-700">
                                {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                              </span>
                              <div className="text-gray-900">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <button
                        onClick={() => window.open(result.url, '_blank')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && results.length === 0 && searchQuery && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">No results found for "{searchQuery}"</p>
                  <div className="text-sm text-gray-400">
                    <p>Try adjusting your search terms or filters</p>
                  </div>
                </div>
              )}

              {!loading && results.length === 0 && !searchQuery && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">Start searching to see results</p>
                  <div className="text-sm text-gray-400">
                    <p>Search across companies, tenders, and contacts</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Save Search</h3>
            <input
              type="text"
              placeholder="Enter search name..."
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  saveSearch(e.target.value.trim());
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  const input = e.target.parentElement.parentElement.querySelector('input');
                  if (input.value.trim()) {
                    saveSearch(input.value.trim());
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;