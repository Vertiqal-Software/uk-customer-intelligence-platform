import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, TrendingUp, Building2, Filter, Search, Star, Share2, Bookmark, Eye } from 'lucide-react';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [activeTab, setActiveTab] = useState('relevant');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockNews = [
      {
        id: 1,
        title: 'Tesco Reports Strong Q2 Performance with 8.5% Revenue Growth',
        summary: 'UK retail giant Tesco has announced impressive second-quarter results, driven by digital transformation initiatives and improved customer experience.',
        content: 'Tesco PLC today announced strong financial results for Q2 2024, reporting revenue growth of 8.5% compared to the same period last year. The company attributed this success to increased online sales, improved supply chain efficiency, and strategic investments in technology.',
        source: 'Financial Times',
        sourceUrl: 'https://ft.com',
        category: 'financial',
        relevanceScore: 95,
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        imageUrl: null,
        tags: ['Tesco', 'Q2 Results', 'Revenue Growth', 'Retail'],
        sentiment: 'positive',
        isBookmarked: false,
        viewCount: 1247,
        relatedCompanies: ['Tesco PLC'],
        impactLevel: 'high'
      },
      {
        id: 2,
        title: 'UK Retail Sector Faces Supply Chain Challenges Amid Economic Uncertainty',
        summary: 'Major retailers including Sainsbury\'s and ASDA are implementing new supply chain strategies to combat rising logistics costs and delivery delays.',
        content: 'The UK retail sector is experiencing significant supply chain disruptions, with several major retailers reporting increased logistics costs and delivery delays. Industry experts suggest that companies need to diversify suppliers and invest in technology to remain competitive.',
        source: 'BBC Business',
        sourceUrl: 'https://bbc.co.uk',
        category: 'industry',
        relevanceScore: 87,
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        imageUrl: null,
        tags: ['Supply Chain', 'Retail', 'Sainsbury\'s', 'ASDA'],
        sentiment: 'negative',
        isBookmarked: true,
        viewCount: 892,
        relatedCompanies: ['Sainsbury\'s', 'ASDA'],
        impactLevel: 'medium'
      },
      {
        id: 3,
        title: 'Digital Transformation Accelerates in UK Grocery Sector',
        summary: 'Leading supermarket chains are investing heavily in AI-powered inventory management and contactless shopping technologies.',
        content: 'The grocery sector in the UK is undergoing rapid digital transformation, with major players like Tesco, Sainsbury\'s, and Marks & Spencer leading the charge in adopting artificial intelligence and automation technologies.',
        source: 'Retail Week',
        sourceUrl: 'https://retailweek.com',
        category: 'technology',
        relevanceScore: 82,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        imageUrl: null,
        tags: ['Digital Transformation', 'AI', 'Grocery', 'Technology'],
        sentiment: 'positive',
        isBookmarked: false,
        viewCount: 645,
        relatedCompanies: ['Tesco PLC', 'Sainsbury\'s', 'Marks & Spencer'],
        impactLevel: 'medium'
      },
      {
        id: 4,
        title: 'Marks & Spencer Launches Sustainability Initiative Across All Stores',
        summary: 'M&S announces comprehensive environmental program aimed at achieving net-zero emissions by 2030, including renewable energy and packaging reduction.',
        content: 'Marks & Spencer has unveiled its most ambitious sustainability program to date, committing to achieve net-zero emissions across all operations by 2030. The initiative includes switching to 100% renewable energy and reducing packaging by 50%.',
        source: 'The Guardian',
        sourceUrl: 'https://theguardian.com',
        category: 'sustainability',
        relevanceScore: 74,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        imageUrl: null,
        tags: ['Sustainability', 'Net Zero', 'M&S', 'Environment'],
        sentiment: 'positive',
        isBookmarked: false,
        viewCount: 543,
        relatedCompanies: ['Marks & Spencer'],
        impactLevel: 'low'
      },
      {
        id: 5,
        title: 'John Lewis Partnership Reports Challenging Trading Conditions',
        summary: 'The retailer cites economic pressures and changing consumer behaviour as key factors affecting performance in the first half of 2024.',
        content: 'John Lewis Partnership has reported challenging trading conditions for H1 2024, with like-for-like sales declining by 3.2%. The company is implementing cost-cutting measures while investing in digital capabilities to improve customer experience.',
        source: 'Sky News',
        sourceUrl: 'https://news.sky.com',
        category: 'financial',
        relevanceScore: 68,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        imageUrl: null,
        tags: ['John Lewis', 'Trading Update', 'Retail Challenges'],
        sentiment: 'negative',
        isBookmarked: false,
        viewCount: 376,
        relatedCompanies: ['John Lewis'],
        impactLevel: 'medium'
      },
      {
        id: 6,
        title: 'UK Consumer Confidence Shows Signs of Recovery in August',
        summary: 'Latest consumer confidence index indicates improved sentiment among UK shoppers, potentially benefiting retail sector performance.',
        content: 'The UK consumer confidence index has risen by 4 points in August, marking the third consecutive month of improvement. Analysts suggest this could lead to increased retail spending in the coming quarters.',
        source: 'Reuters',
        sourceUrl: 'https://reuters.com',
        category: 'market',
        relevanceScore: 65,
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        imageUrl: null,
        tags: ['Consumer Confidence', 'UK Market', 'Retail Outlook'],
        sentiment: 'positive',
        isBookmarked: false,
        viewCount: 289,
        relatedCompanies: [],
        impactLevel: 'low'
      }
    ];

    setTimeout(() => {
      setNews(mockNews);
      setFilteredNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter news based on search and filters
  useEffect(() => {
    let filtered = news;

    // Filter by active tab
    if (activeTab === 'relevant') {
      filtered = filtered.filter(article => article.relevanceScore >= 70);
    } else if (activeTab === 'bookmarked') {
      filtered = filtered.filter(article => article.isBookmarked);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Source filter
    if (selectedSource !== 'all') {
      filtered = filtered.filter(article => article.source === selectedSource);
    }

    // Sort by relevance score and date
    filtered.sort((a, b) => {
      if (activeTab === 'relevant') {
        return b.relevanceScore - a.relevanceScore;
      }
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    setFilteredNews(filtered);
  }, [news, searchTerm, selectedCategory, selectedSource, activeTab]);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleBookmark = (articleId) => {
    setNews(prev =>
      prev.map(article =>
        article.id === articleId 
          ? { ...article, isBookmarked: !article.isBookmarked }
          : article
      )
    );
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(news.map(article => article.category))];
    return categories;
  };

  const getUniqueSources = () => {
    const sources = [...new Set(news.map(article => article.source))];
    return sources;
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
            <Newspaper className="w-5 h-5 mr-2" />
            Industry News Feed
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 mb-4">
          {['relevant', 'latest', 'bookmarked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'bookmarked' && news.filter(n => n.isBookmarked).length > 0 && (
                <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {news.filter(n => n.isBookmarked).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {getUniqueCategories().map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sources</option>
            {getUniqueSources().map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>

      {/* News Articles */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredNews.length === 0 ? (
          <div className="text-center py-8">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              {activeTab === 'bookmarked' ? 'No bookmarked articles' : 'No news articles match your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNews.map((article) => (
              <article key={article.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">{article.source}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{formatTimeAgo(article.publishedAt)}</span>
                      {activeTab === 'relevant' && (
                        <>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm font-medium text-blue-600">
                            {article.relevanceScore}% relevant
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-2 ml-4">
                    <button
                      onClick={() => toggleBookmark(article.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        article.isBookmarked 
                          ? 'text-blue-600 bg-blue-100 hover:bg-blue-200' 
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${article.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tags and Metadata */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{article.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Status badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
                      {article.sentiment}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(article.impactLevel)}`}>
                      {article.impactLevel} impact
                    </span>
                    {article.relatedCompanies.length > 0 && (
                      <span className="text-xs text-gray-500">
                        <Building2 className="w-3 h-3 inline mr-1" />
                        {article.relatedCompanies.length} companies
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-xs text-gray-500">
                      <Eye className="w-3 h-3 mr-1" />
                      {article.viewCount.toLocaleString()}
                    </span>
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      Read more
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Related Companies */}
                {article.relatedCompanies.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600 mb-1">Related companies:</p>
                    <div className="flex flex-wrap gap-1">
                      {article.relatedCompanies.map((company, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium cursor-pointer hover:bg-blue-100 transition-colors"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredNews.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Showing {filteredNews.length} of {news.length} articles
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;