import React, { useState, useEffect } from 'react';
import { Target, Lightbulb, Settings, Package, Save, Copy, Download, RefreshCw, Eye, Edit3, Building2, User } from 'lucide-react';

const GoldenCircleGenerator = () => {
  const [selectedContact, setSelectedContact] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState('');
  const [customInputs, setCustomInputs] = useState({
    companyPain: '',
    valueProposition: '',
    differentiator: '',
    outcomes: ''
  });
  const [generatedCircle, setGeneratedCircle] = useState({
    why: '',
    how: '',
    what: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedCircles, setSavedCircles] = useState([]);
  const [activeSection, setActiveSection] = useState('why');
  const [viewMode, setViewMode] = useState('edit'); // edit, preview, presentation

  // Mock data
  const contacts = [
    {
      id: 1,
      name: 'Ken Murphy',
      company: 'Tesco PLC',
      role: 'Chief Executive Officer',
      challenges: ['Digital transformation complexity', 'Legacy system integration', 'Operational efficiency'],
      goals: ['Modernize technology stack', 'Improve customer experience', 'Reduce operational costs'],
      values: ['Innovation', 'Customer-centricity', 'Efficiency']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'ASDA',
      role: 'Head of Procurement',
      challenges: ['Vendor management complexity', 'Cost optimization pressure', 'Integration challenges'],
      goals: ['Streamline procurement', 'Reduce costs', 'Improve supplier relationships'],
      values: ['Cost-effectiveness', 'Quality', 'Reliability']
    }
  ];

  const opportunities = [
    {
      id: 1,
      title: 'ASDA Digital Infrastructure Upgrade',
      value: 2400000,
      pain: 'Legacy systems limiting scalability and efficiency',
      solution: 'Comprehensive digital transformation platform',
      outcome: 'Improved operational efficiency and customer experience'
    },
    {
      id: 2,
      title: 'Tesco Security Infrastructure',
      value: 1250000,
      pain: 'Cybersecurity vulnerabilities and compliance gaps',
      solution: 'Enterprise security platform with training',
      outcome: 'Enhanced security posture and compliance'
    }
  ];

  const generateGoldenCircle = async () => {
    if (!selectedContact) {
      alert('Please select a contact');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const contact = contacts.find(c => c.id === parseInt(selectedContact));
    const opportunity = opportunities.find(o => o.id === parseInt(selectedOpportunity));
    
    const circle = createGoldenCircle(contact, opportunity, customInputs);
    setGeneratedCircle(circle);
    setIsGenerating(false);
  };

  const createGoldenCircle = (contact, opportunity, inputs) => {
    // Generate WHY (Purpose/Belief)
    const why = `**${contact.company}'s Success is Our Mission**

We believe that ${contact.company} deserves technology solutions that don't just work—they transform your business and empower your people.

${inputs.companyPain ? `We understand that ${inputs.companyPain.toLowerCase()}, and` : `We see that ${contact.challenges[0].toLowerCase()}, and`} this is exactly why we exist.

**Our Core Belief:**
Every forward-thinking company like ${contact.company} should have access to technology that:
• Solves real business problems, not creates new ones
• Adapts to your unique needs and culture
• Delivers measurable results that matter to your stakeholders

**Why This Matters to ${contact.company}:**
Your commitment to ${contact.values[0].toLowerCase()} aligns perfectly with our mission to deliver solutions that truly make a difference. We're not just another vendor—we're partners in your success.

**The Bigger Picture:**
Together, we're not just implementing technology; we're building the foundation for ${contact.company}'s next chapter of growth and innovation.

${inputs.valueProposition ? `\n**Your Unique Value:**\n${inputs.valueProposition}` : ''}`;

    // Generate HOW (Process/Values)
    const how = `**Our Proven Approach for ${contact.company}**

We achieve extraordinary results through our unique methodology that puts your success first:

**1. Deep Partnership Approach**
• We start by truly understanding ${contact.company}'s culture, challenges, and aspirations
• Our team becomes an extension of yours, not just external consultants
• Every recommendation is tailored specifically to your business context

**2. Proven Implementation Process**
• **Discovery & Alignment** - We map your current state and define success metrics
• **Collaborative Design** - Solutions are built with your team, ensuring buy-in and adoption
• **Phased Delivery** - Implementation in manageable phases to minimize disruption
• **Continuous Optimization** - Ongoing refinement based on real performance data

**3. Risk-Minimized Methodology**
• Comprehensive testing and validation at every stage
• Change management support to ensure smooth team transitions
• 24/7 support during critical implementation phases
• Built-in flexibility to adapt as your needs evolve

**4. Value-Driven Execution**
${opportunity ? `• Focus on delivering the ${opportunity.outcome.toLowerCase()} you need` : `• Laser focus on achieving your goals of ${contact.goals[0].toLowerCase()}`}
• Regular progress reviews with clear, measurable outcomes
• Transparent communication with all stakeholders
• Investment protection through scalable, future-ready solutions

**What Makes Our Approach Different:**
${inputs.differentiator || 'We combine deep technical expertise with genuine business understanding, ensuring solutions that work in the real world of your operations.'}

**For ${contact.company} Specifically:**
• Alignment with your values of ${contact.values.join(', ').toLowerCase()}
• Respect for your existing processes and team expertise
• Solutions that enhance rather than replace your competitive advantages`;

    // Generate WHAT (Product/Service)
    const what = `**Concrete Solutions for ${contact.company}**

Here's exactly what we deliver to transform your business:

${opportunity ? `**Core Solution: ${opportunity.solution}**` : '**Our Technology Platform**'}

**Primary Components:**
• **Integration Platform** - Seamlessly connects your existing systems
• **Analytics Dashboard** - Real-time insights for better decision-making  
• **Automation Engine** - Streamlines repetitive processes and workflows
• **Security Framework** - Enterprise-grade protection for all your data
• **Training & Support** - Comprehensive knowledge transfer to your team

**Specific Deliverables for ${contact.company}:**

**Phase 1: Foundation (Months 1-2)**
• Current state assessment and gap analysis
• Technical architecture design and approval
• Project team setup and initial training
• Core platform installation and configuration

**Phase 2: Implementation (Months 2-4)**
• System integrations with your existing tools
• Custom workflow development
• Data migration and validation
• User acceptance testing with your team

**Phase 3: Optimization (Months 4-6)**
• Performance tuning and optimization
• Advanced feature activation
• Comprehensive team training program
• Ongoing support structure establishment

**Measurable Outcomes You'll See:**
${opportunity ? `• ${opportunity.outcome}` : `• Achievement of your goal: ${contact.goals[0]}`}
${inputs.outcomes ? `• ${inputs.outcomes}` : `• Improved operational efficiency by 25-40%`}
• Reduced manual work and errors
• Enhanced data visibility and decision-making capability
• Stronger security posture and compliance readiness

**What's Included in Your Investment:**
• All software licenses and infrastructure
• Complete implementation and integration services
• Comprehensive training for your entire team
• 12 months of premium support and maintenance
• Quarterly business reviews and optimization sessions

**Technical Specifications:**
• Cloud-native architecture for scalability
• API-first design for easy integrations
• Enterprise security standards (SOC 2, ISO 27001)
• 99.9% uptime SLA with redundancy built-in
• Mobile-responsive interface for anywhere access

**Your Success Metrics:**
We'll measure our success by tracking:
• ${contact.goals[0]} achievement within 6 months
• User adoption rates exceeding 85%
• ROI realization within 12 months
• System performance meeting all agreed SLAs
• ${contact.company} team satisfaction scores above 4.5/5`;

    return { why, how, what };
  };

  const copySection = (section) => {
    navigator.clipboard.writeText(generatedCircle[section]);
    alert(`${section.toUpperCase()} section copied to clipboard!`);
  };

  const copyAll = () => {
    const fullContent = `WHY:\n${generatedCircle.why}\n\nHOW:\n${generatedCircle.how}\n\nWHAT:\n${generatedCircle.what}`;
    navigator.clipboard.writeText(fullContent);
    alert('Complete Golden Circle copied to clipboard!');
  };

  const saveCircle = () => {
    const circle = {
      id: Date.now(),
      contact: contacts.find(c => c.id === parseInt(selectedContact)),
      opportunity: opportunities.find(o => o.id === parseInt(selectedOpportunity)),
      customInputs,
      circle: generatedCircle,
      createdAt: new Date().toISOString()
    };
    
    setSavedCircles(prev => [circle, ...prev]);
    alert('Golden Circle saved successfully!');
  };

  const selectedContactData = contacts.find(c => c.id === parseInt(selectedContact));
  const selectedOpportunityData = opportunities.find(o => o.id === parseInt(selectedOpportunity));

  const renderCircleSection = (section, icon, title, content) => {
    const isActive = activeSection === section;
    const IconComponent = icon;
    
    return (
      <div className={`border rounded-lg transition-all ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
        <div 
          className="p-4 cursor-pointer"
          onClick={() => setActiveSection(section)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                  {title}
                </h3>
                <p className={`text-sm ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                  {section === 'why' && 'Purpose & Belief'}
                  {section === 'how' && 'Process & Values'}
                  {section === 'what' && 'Product & Service'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copySection(section);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                disabled={!content}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {isActive && content && (
          <div className="px-4 pb-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              {viewMode === 'edit' ? (
                <textarea
                  value={content}
                  onChange={(e) => setGeneratedCircle(prev => ({ ...prev, [section]: e.target.value }))}
                  rows={20}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                    {content}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Golden Circle Generator
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                viewMode === 'preview' 
                  ? 'bg-blue-100 border-blue-300 text-blue-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4 mr-1 inline" />
              {viewMode === 'edit' ? 'Preview' : 'Edit'}
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mt-2">
          Create compelling messaging using Simon Sinek's Golden Circle framework: Why → How → What
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Configuration Panel */}
        <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup</h3>
          
          {/* Contact Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Contact
            </label>
            <select
              value={selectedContact}
              onChange={(e) => setSelectedContact(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a contact...</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} - {contact.company}
                </option>
              ))}
            </select>
          </div>

          {/* Opportunity Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Opportunity (Optional)
            </label>
            <select
              value={selectedOpportunity}
              onChange={(e) => setSelectedOpportunity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an opportunity...</option>
              {opportunities.map(opportunity => (
                <option key={opportunity.id} value={opportunity.id}>
                  {opportunity.title}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Contact Info */}
          {selectedContactData && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedContactData.name}</h4>
                  <p className="text-sm text-gray-600">{selectedContactData.role}</p>
                  <p className="text-sm text-blue-600">{selectedContactData.company}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Key Challenges:</span>
                  <ul className="mt-1 space-y-1">
                    {selectedContactData.challenges.map((challenge, index) => (
                      <li key={index} className="text-gray-600">• {challenge}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Goals:</span>
                  <ul className="mt-1 space-y-1">
                    {selectedContactData.goals.map((goal, index) => (
                      <li key={index} className="text-gray-600">• {goal}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Values:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedContactData.values.map((value, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Inputs */}
          <div className="space-y-4 mb-6">
            <h4 className="text-md font-semibold text-gray-900">Custom Context</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Pain Points
              </label>
              <textarea
                value={customInputs.companyPain}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, companyPain: e.target.value }))}
                placeholder="Specific challenges this company is facing..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value Proposition
              </label>
              <textarea
                value={customInputs.valueProposition}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, valueProposition: e.target.value }))}
                placeholder="Unique value you bring to this company..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Differentiator
              </label>
              <textarea
                value={customInputs.differentiator}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, differentiator: e.target.value }))}
                placeholder="What makes your approach unique..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Outcomes
              </label>
              <textarea
                value={customInputs.outcomes}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, outcomes: e.target.value }))}
                placeholder="Specific results they can expect..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateGoldenCircle}
            disabled={isGenerating || !selectedContact}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                <span>Generate Golden Circle</span>
              </>
            )}
          </button>
        </div>

        {/* Golden Circle Display */}
        <div className="flex-1 flex flex-col">
          {/* Actions Bar */}
          {generatedCircle.why && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Golden Circle Framework</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyAll}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy All</span>
                  </button>
                  <button
                    onClick={saveCircle}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center space-x-1"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {/* Implement download */}}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Circle Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {generatedCircle.why ? (
              <div className="space-y-6">
                {renderCircleSection('why', Lightbulb, 'WHY', generatedCircle.why)}
                {renderCircleSection('how', Settings, 'HOW', generatedCircle.how)}
                {renderCircleSection('what', Package, 'WHAT', generatedCircle.what)}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <div className="w-24 h-24 mx-auto mb-6 relative">
                    {/* Golden Circle Visual */}
                    <div className="absolute inset-0 border-4 border-yellow-400 rounded-full"></div>
                    <div className="absolute inset-2 border-4 border-orange-400 rounded-full"></div>
                    <div className="absolute inset-4 border-4 border-red-400 rounded-full flex items-center justify-center">
                      <Target className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your Golden Circle</h3>
                  <p className="text-gray-600 max-w-md">
                    Select a contact and generate personalized messaging using the proven Golden Circle framework: 
                    Start with Why, then How, then What.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Circles Panel */}
      {savedCircles.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Golden Circles</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {savedCircles.slice(0, 3).map(circle => (
              <div key={circle.id} className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{circle.contact.name}</span>
                  <span className="text-xs text-gray-500">{circle.contact.company}</span>
                </div>
                {circle.opportunity && (
                  <p className="text-xs text-gray-600 truncate mb-2">{circle.opportunity.title}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(circle.createdAt).toLocaleDateString()}
                  </span>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Load
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoldenCircleGenerator;