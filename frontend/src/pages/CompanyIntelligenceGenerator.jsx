import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const CompanyIntelligenceGenerator = () => {
  const { companyNumber } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [intelligence, setIntelligence] = useState({
    golden_circle: {
      why: '',
      how: '',
      what: ''
    },
    call_script: '',
    intro_email: '',
    follow_up_emails: [],
    key_insights: [],
    conversation_starters: [],
    recent_developments: [],
    financial_story: '',
    competitive_position: '',
    tender_opportunities: []
  });

  useEffect(() => {
    if (companyNumber) {
      loadCompanyIntelligence();
    }
  }, [companyNumber]);

  const loadCompanyIntelligence = async () => {
    try {
      setLoading(true);
      const result = await apiService.getCompanyDetails(companyNumber);
      if (result.success) {
        setCompany(result.data.company);
        // Load existing intelligence or generate new
        await generateIntelligence(result.data.company);
      }
    } catch (err) {
      console.error('Failed to load company intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateIntelligence = async (companyData) => {
    try {
      setGenerating(true);
      
      // Mock AI-generated intelligence based on company data
      const mockIntelligence = {
        golden_circle: {
          why: `${companyData.name} needs reliable IT solutions to support their ${getBusinessSector(companyData)} operations and drive digital transformation. Recent filing activity suggests they're expanding operations and need scalable technology infrastructure.`,
          how: `Our proven track record in the ${getBusinessSector(companyData)} sector, combined with our comprehensive suite of cloud services, cybersecurity solutions, and managed IT support, positions us perfectly to help them achieve their technology goals.`,
          what: `We offer end-to-end IT solutions including cloud migration, cybersecurity assessment, managed services, and strategic technology consulting specifically tailored for ${getBusinessSector(companyData)} organizations.`
        },
        call_script: generateCallScript(companyData),
        intro_email: generateIntroEmail(companyData),
        follow_up_emails: generateFollowUpEmails(companyData),
        key_insights: generateKeyInsights(companyData),
        conversation_starters: generateConversationStarters(companyData),
        recent_developments: generateRecentDevelopments(companyData),
        financial_story: generateFinancialStory(companyData),
        competitive_position: generateCompetitivePosition(companyData),
        tender_opportunities: generateTenderOpportunities(companyData)
      };

      setIntelligence(mockIntelligence);
    } catch (err) {
      console.error('Failed to generate intelligence:', err);
    } finally {
      setGenerating(false);
    }
  };

  const getBusinessSector = (company) => {
    if (company.sic_codes && company.sic_codes.length > 0) {
      const sicCode = company.sic_codes[0];
      if (sicCode.startsWith('62') || sicCode.startsWith('63')) return 'technology';
      if (sicCode.startsWith('85')) return 'education';
      if (sicCode.startsWith('86')) return 'healthcare';
      if (sicCode.startsWith('84')) return 'public sector';
    }
    return 'business services';
  };

  const generateCallScript = (company) => {
    return `Hi [Contact Name], this is [Your Name] from [Your Company]. 

I've been researching ${company.name} and I'm impressed by your work in the ${getBusinessSector(company)} sector. I noticed from your recent Companies House filings that you've been growing steadily - congratulations on that success.

I'm calling because we specialize in helping ${getBusinessSector(company)} companies like yours optimize their IT infrastructure and reduce operational costs. Many of our clients in similar positions have seen 20-30% improvements in efficiency after implementing our solutions.

I'd love to understand more about your current technology challenges and share how we've helped similar organizations. Would you have 15 minutes this week for a brief conversation?

Key points to mention:
- Recent growth noted in filings
- Sector-specific expertise
- Quantified benefits for similar clients
- Low-pressure time request`;
  };

  const generateIntroEmail = (company) => {
    return `Subject: Supporting ${company.name}'s Technology Growth

Hi [Contact Name],

I hope this email finds you well. I've been researching technology leaders in the ${getBusinessSector(company)} sector and ${company.name} caught my attention due to your recent growth and market position.

From your latest Companies House filings, I can see you've been expanding operations, which often brings technology challenges around scalability, security, and efficiency.

We specialize in helping ${getBusinessSector(company)} organizations navigate these exact challenges. Our recent client, [Similar Company], saw a 35% reduction in IT costs while improving system reliability after implementing our managed services solution.

I'd welcome the opportunity to share some insights specific to your sector and learn more about your technology priorities. 

Would you be available for a brief 15-minute call this week?

Best regards,
[Your Name]
[Your Company]
[Contact Details]

P.S. I noticed your team recently [recent development] - congratulations on that achievement!`;
  };

  const generateFollowUpEmails = (company) => {
    return [
      {
        sequence: 1,
        subject: `Follow-up: Technology insights for ${company.name}`,
        body: `Hi [Contact Name],

I hope you're well. I sent an email last week about supporting ${company.name}'s technology growth but wanted to follow up as I know inboxes can get busy.

I've attached a brief case study of how we helped [Similar Company] in the ${getBusinessSector(company)} sector reduce their IT overhead by 30% while improving security posture.

Given your company's recent growth trajectory, I thought this might be relevant.

Would a brief call this week work for you?

Best regards,
[Your Name]`
      },
      {
        sequence: 2,
        subject: `Final follow-up: ${company.name} technology optimization`,
        body: `Hi [Contact Name],

This will be my final email on this topic as I don't want to be a bother.

I've been tracking some interesting developments in the ${getBusinessSector(company)} technology space that I thought might be relevant to ${company.name}, particularly around [specific trend].

If you'd like to discuss how other companies are addressing these challenges, I'm happy to share some insights. Otherwise, I'll leave you in peace.

Best of luck with your technology initiatives.

Best regards,
[Your Name]`
      }
    ];
  };

  const generateKeyInsights = (company) => {
    return [
      `Recent Companies House filings show steady revenue growth, indicating expansion opportunities`,
      `Current director structure suggests decision-making authority lies with [key directors]`,
      `SIC code classification indicates strong fit for our ${getBusinessSector(company)} solutions`,
      `Company size and growth trajectory align with our ideal customer profile`,
      `Recent website updates suggest active marketing and business development efforts`,
      `Financial health appears strong based on latest available accounts`
    ];
  };

  const generateConversationStarters = (company) => {
    return [
      `"I noticed ${company.name} has been growing steadily - what's driving that success?"`,
      `"How is your current technology stack supporting your expansion plans?"`,
      `"What are your biggest technology challenges as you scale the business?"`,
      `"I saw your recent [development] - how has that impacted your IT requirements?"`,
      `"Many ${getBusinessSector(company)} companies are facing [common challenge] - is that something you're experiencing?"`,
      `"What's your current approach to cybersecurity given the increasing threats in your sector?"`
    ];
  };

  const generateRecentDevelopments = (company) => {
    return [
      {
        date: '2024-12-15',
        type: 'Filing Update',
        description: 'Latest annual accounts filed showing continued growth',
        relevance: 'Indicates financial stability and expansion opportunities'
      },
      {
        date: '2024-11-28',
        type: 'Website Update',
        description: 'New services page added highlighting digital transformation capabilities',
        relevance: 'Shows focus on technology-driven solutions - opportunity for partnership'
      },
      {
        date: '2024-11-10',
        type: 'Industry News',
        description: 'Mentioned in trade publication for innovation in their sector',
        relevance: 'Good conversation starter and credibility builder'
      }
    ];
  };

  const generateFinancialStory = (company) => {
    return `Based on the latest available accounts, ${company.name} appears to be in a strong financial position:

• Revenue growth trend indicates successful business expansion
• Cash position suggests ability to invest in technology improvements
• Debt-to-equity ratio within healthy range for their sector
• Recent filing activity shows compliance and transparency

This financial stability makes them an ideal prospect for technology investments that will support continued growth. Their healthy cash position suggests they have budget available for strategic IT initiatives.

Key discussion points:
- How technology can support their growth trajectory
- ROI-focused solutions that align with their financial success
- Scalable solutions that grow with their business`;
  };

  const generateCompetitivePosition = (company) => {
    return `Market Position Analysis for ${company.name}:

Strengths:
• Established player in the ${getBusinessSector(company)} sector
• Steady growth trajectory over recent years
• Strong financial position for technology investments

Opportunities:
• Digital transformation initiatives to stay competitive
• Efficiency improvements through modern IT infrastructure
• Enhanced cybersecurity posture

Potential Concerns:
• May be relying on legacy systems that limit growth
• Cybersecurity vulnerabilities common in their sector
• Need for scalable solutions to support expansion

Our Competitive Advantage:
• Proven track record in their specific sector
• Comprehensive solution portfolio
• Strong references from similar organizations`;
  };

  const generateTenderOpportunities = (company) => {
    return [
      {
        title: 'Digital Transformation Framework - Education Sector',
        value: '£2.3M',
        relevance: 'Perfect fit for their sector expertise',
        suggestion: 'Recommend they consider applying - strong alignment with their capabilities'
      },
      {
        title: 'Cybersecurity Services Framework',
        value: '£800K',
        relevance: 'Complements their current service offering',
        suggestion: 'Could partner with them or subcontract opportunities'
      }
    ];
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const regenerateSection = async (section) => {
    setGenerating(true);
    // Simulate AI regeneration
    setTimeout(() => {
      setGenerating(false);
    }, 2000);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '🎯' },
    { id: 'golden-circle', name: 'Golden Circle', icon: '🎪' },
    { id: 'scripts', name: 'Call Scripts', icon: '📞' },
    { id: 'emails', name: 'Email Templates', icon: '📧' },
    { id: 'insights', name: 'Key Insights', icon: '💡' },
    { id: 'developments', name: 'Recent News', icon: '📰' },
    { id: 'financial', name: 'Financial Story', icon: '💰' },
    { id: 'competitive', name: 'Competitive Intel', icon: '⚔️' },
    { id: 'tenders', name: 'Tender Opportunities', icon: '📋' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company intelligence...</p>
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
                onClick={() => navigate(`/company/${companyNumber}`)}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Company Details
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sales Intelligence</h1>
                <p className="text-sm text-gray-600">{company?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => generateIntelligence(company)}
                disabled={generating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Regenerate All'}
              </button>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Intelligence Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Company Health</h4>
                    <p className="text-sm text-blue-700">Strong financial position with steady growth</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Opportunity Score</h4>
                    <p className="text-sm text-green-700">High (95/100) - Ideal prospect profile</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">Best Approach</h4>
                    <p className="text-sm text-purple-700">Focus on growth enablement and efficiency</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">Timing</h4>
                    <p className="text-sm text-orange-700">Excellent - Recent expansion activity</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
                <div className="space-y-3">
                  {intelligence.key_insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('scripts')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Call Script
                  </button>
                  <button 
                    onClick={() => setActiveTab('emails')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Get Email Templates
                  </button>
                  <button 
                    onClick={() => setActiveTab('golden-circle')}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Golden Circle Analysis
                  </button>
                  <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    Add to CRM
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {intelligence.recent_developments.slice(0, 3).map((dev, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-3">
                      <p className="text-sm font-medium text-gray-800">{dev.type}</p>
                      <p className="text-xs text-gray-600">{dev.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{dev.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'golden-circle' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Golden Circle Analysis</h3>
                <button
                  onClick={() => regenerateSection('golden-circle')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Regenerate
                </button>
              </div>
              
              <div className="space-y-8">
                <div className="border-l-4 border-yellow-500 pl-6">
                  <h4 className="text-xl font-bold text-yellow-600 mb-3">WHY</h4>
                  <p className="text-gray-700 leading-relaxed">{intelligence.golden_circle.why}</p>
                  <button
                    onClick={() => copyToClipboard(intelligence.golden_circle.why)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Copy to clipboard
                  </button>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="text-xl font-bold text-blue-600 mb-3">HOW</h4>
                  <p className="text-gray-700 leading-relaxed">{intelligence.golden_circle.how}</p>
                  <button
                    onClick={() => copyToClipboard(intelligence.golden_circle.how)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Copy to clipboard
                  </button>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="text-xl font-bold text-green-600 mb-3">WHAT</h4>
                  <p className="text-gray-700 leading-relaxed">{intelligence.golden_circle.what}</p>
                  <button
                    onClick={() => copyToClipboard(intelligence.golden_circle.what)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Copy to clipboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scripts' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Call Script</h3>
                <div className="space-x-3">
                  <button
                    onClick={() => copyToClipboard(intelligence.call_script)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Copy Script
                  </button>
                  <button
                    onClick={() => regenerateSection('call_script')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {intelligence.call_script}
                </pre>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold text-gray-800 mb-4">Conversation Starters</h4>
                <div className="space-y-2">
                  {intelligence.conversation_starters.map((starter, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <p className="text-gray-700">{starter}</p>
                      <button
                        onClick={() => copyToClipboard(starter)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Introduction Email</h3>
                <div className="space-x-3">
                  <button
                    onClick={() => copyToClipboard(intelligence.intro_email)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Copy Email
                  </button>
                  <button
                    onClick={() => regenerateSection('intro_email')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {intelligence.intro_email}
                </pre>
              </div>
            </div>

            {intelligence.follow_up_emails.map((email, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Follow-up Email #{email.sequence}</h3>
                  <div className="space-x-3">
                    <button
                      onClick={() => copyToClipboard(`Subject: ${email.subject}\n\n${email.body}`)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Copy Email
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-4">
                    <span className="font-medium text-gray-700">Subject: </span>
                    <span className="text-gray-600">{email.subject}</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {email.body}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Key Insights</h3>
                <button
                  onClick={() => regenerateSection('insights')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Regenerate
                </button>
              </div>
              
              <div className="space-y-4">
                {intelligence.key_insights.map((insight, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{insight}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(insight)}
                      className="text-blue-600 hover:text-blue-800 text-sm ml-4"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'developments' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Developments</h3>
              
              <div className="space-y-6">
                {intelligence.recent_developments.map((dev, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {dev.type}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">{dev.date}</span>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-2">{dev.description}</h4>
                    <p className="text-sm text-gray-600 italic">{dev.relevance}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Financial Story</h3>
                <button
                  onClick={() => copyToClipboard(intelligence.financial_story)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Copy Analysis
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {intelligence.financial_story}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'competitive' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Competitive Intelligence</h3>
                <button
                  onClick={() => copyToClipboard(intelligence.competitive_position)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Copy Analysis
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {intelligence.competitive_position}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tenders' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Relevant Tender Opportunities</h3>
              
              <div className="space-y-6">
                {intelligence.tender_opportunities.map((tender, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">{tender.title}</h4>
                        <p className="text-sm text-gray-600">Value: {tender.value}</p>
                      </div>
                      <button className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        View Details
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Relevance:</span> {tender.relevance}
                    </p>
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Suggestion:</span> {tender.suggestion}
                    </p>
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

export default CompanyIntelligenceGenerator;