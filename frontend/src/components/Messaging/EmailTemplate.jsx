import React, { useState, useEffect } from 'react';
import { Mail, User, Building2, Send, Save, Copy, Download, Edit3, Eye, RefreshCw, Paperclip } from 'lucide-react';

const EmailTemplate = () => {
  const [selectedContact, setSelectedContact] = useState('');
  const [emailType, setEmailType] = useState('introduction');
  const [emailPurpose, setEmailPurpose] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [attachments, setAttachments] = useState([]);

  // Mock contacts data
  const contacts = [
    {
      id: 1,
      name: 'Ken Murphy',
      company: 'Tesco PLC',
      role: 'Chief Executive Officer',
      email: 'ken.murphy@tesco.com',
      lastContact: '2024-08-13',
      relationship: 8.5,
      interests: ['Digital Transformation', 'Operational Efficiency'],
      communicationStyle: 'Direct and data-driven',
      recentActivity: 'Quarterly business review meeting'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'ASDA',
      role: 'Head of Procurement',
      email: 'sarah.johnson@asda.com',
      lastContact: '2024-08-15',
      relationship: 9.2,
      interests: ['Supply Chain', 'Cost Optimization'],
      communicationStyle: 'Analytical and thorough',
      recentActivity: 'Technical requirements discussion'
    },
    {
      id: 3,
      name: 'David Smith',
      company: 'Marks & Spencer',
      role: 'Customer Experience Director',
      email: 'david.smith@marksandspencer.com',
      lastContact: '2024-08-14',
      relationship: 7.8,
      interests: ['Customer Journey', 'Personalization'],
      communicationStyle: 'Collaborative and enthusiastic',
      recentActivity: 'Customer experience strategy session'
    }
  ];

  const emailTypes = [
    { value: 'introduction', label: 'Introduction Email', description: 'First contact introduction' },
    { value: 'follow-up', label: 'Follow-up Email', description: 'After meeting or call' },
    { value: 'proposal', label: 'Proposal Email', description: 'Sending proposal or quote' },
    { value: 'check-in', label: 'Check-in Email', description: 'Relationship maintenance' },
    { value: 'thank-you', label: 'Thank You Email', description: 'After meeting or demo' },
    { value: 'scheduling', label: 'Meeting Request', description: 'Schedule a meeting' },
    { value: 'case-study', label: 'Case Study Share', description: 'Sharing success stories' },
    { value: 'resource-share', label: 'Resource Sharing', description: 'Sharing valuable content' }
  ];

  const generateEmail = async () => {
    if (!selectedContact || !emailType || !emailPurpose) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const contact = contacts.find(c => c.id === parseInt(selectedContact));
    const email = generateEmailContent(contact, emailType, emailPurpose, customContext);
    
    setGeneratedEmail(email.body);
    setEmailSubject(email.subject);
    setIsGenerating(false);
  };

  const generateEmailContent = (contact, type, purpose, context) => {
    const timeOfDay = getTimeOfDay();
    const templates = {
      introduction: {
        subject: `Introduction - ${purpose}`,
        body: `Subject: ${purpose}

Hi ${contact.name},

I hope this email finds you well. My name is [Your Name] and I'm reaching out from [Your Company] because ${purpose.toLowerCase()}.

I noticed that ${contact.company} has been focusing on ${contact.interests[0].toLowerCase()}, and I believe we might have some insights that could be valuable for your initiatives.

We've been helping companies like ${contact.company} achieve:
• Improved operational efficiency
• Cost reduction through optimization
• Enhanced ${contact.interests[0].toLowerCase()} capabilities

${context ? `Additionally, ${context}` : ''}

I'd love the opportunity to share some relevant case studies and discuss how we might be able to support ${contact.company}'s goals.

Would you be open to a brief 15-minute call next week to explore this further? I'm happy to work around your schedule.

Thank you for your time, and I look forward to hearing from you.

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Phone]
[Your Email]

P.S. I've attached a brief overview of our solutions that might be relevant to your ${contact.interests[0].toLowerCase()} initiatives.`
      },

      'follow-up': {
        subject: `Following up on our ${purpose}`,
        body: `Subject: Following up on our ${purpose}

Hi ${contact.name},

Thank you for taking the time to ${purpose.toLowerCase()} ${contact.recentActivity ? `and discuss ${contact.recentActivity.toLowerCase()}` : ''}.

It was great to learn more about ${contact.company}'s priorities, particularly your focus on ${contact.interests[0].toLowerCase()}. Based on our conversation, I wanted to follow up with:

${context ? `• ${context}` : '• The information you requested about our solution'}
• A case study from a similar company that achieved [specific results]
• Next steps for our discussion

Key takeaways from our conversation:
• Your main challenge: [Challenge discussed]
• Your timeline: [Timeline mentioned]
• Success criteria: [Success metrics discussed]

As promised, I've attached:
- [Relevant document/case study]
- [Additional resource]

For next steps, I suggest we:
1. [Specific action item 1]
2. [Specific action item 2]
3. Schedule a follow-up call for [suggested timeframe]

Please let me know what works best for your schedule, or if you have any questions about the attached materials.

Looking forward to continuing our conversation.

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Phone]
[Your Email]`
      },

      proposal: {
        subject: `Proposal - ${purpose} for ${contact.company}`,
        body: `Subject: Proposal - ${purpose} for ${contact.company}

Hi ${contact.name},

I'm pleased to send you our proposal for ${purpose.toLowerCase()} at ${contact.company}.

Based on our discussions about your objectives for ${contact.interests[0].toLowerCase()}, we've tailored this proposal to address your specific needs:

**Solution Overview:**
• [Key component 1 addressing their challenge]
• [Key component 2 delivering specific value]
• [Key component 3 ensuring successful implementation]

**Expected Outcomes:**
• [Specific measurable result 1]
• [Specific measurable result 2]  
• [Specific measurable result 3]

**Investment:** [Investment details]
**Timeline:** [Implementation timeline]

${context ? `Special considerations: ${context}` : ''}

**Next Steps:**
1. Review the attached detailed proposal
2. Schedule a call to discuss any questions (I'm available [specific times])
3. Arrange a reference call with [similar company] if helpful

I'm confident this solution will deliver significant value for ${contact.company}. The attached proposal includes:
- Detailed solution specifications
- Implementation timeline
- ROI analysis
- Reference customer case studies

Please don't hesitate to reach out with any questions. I'm excited about the opportunity to partner with ${contact.company} on this initiative.

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Phone]
[Your Email]

Attachments:
- ${contact.company} Proposal - ${purpose}
- ROI Calculator
- Implementation Timeline
- Reference Case Studies`
      },

      'check-in': {
        subject: `Quick check-in - How are things at ${contact.company}?`,
        body: `Subject: Quick check-in - How are things at ${contact.company}?

Hi ${contact.name},

I hope you're having a great ${timeOfDay === 'morning' ? 'start to the week' : timeOfDay === 'afternoon' ? 'week so far' : 'end to the week'}.

I wanted to reach out for a quick check-in. It's been [time period] since we last spoke about ${purpose.toLowerCase()}, and I always like to stay connected with colleagues at innovative companies like ${contact.company}.

I've been following some of the industry developments around ${contact.interests[0].toLowerCase()}, and thought you might find this interesting: [relevant industry insight or trend].

${context ? context : 'How are things progressing with your initiatives in this area?'}

A few things I thought might be valuable to share:
• [Relevant industry insight/trend]
• [New development or case study]
• [Resource or connection that might help]

No agenda on my end - just wanted to see how you're doing and if there's anything I can help with. Whether that's industry insights, introductions, or just a sounding board for ideas.

How are things going with [specific initiative they mentioned previously]?

Hope all is well, and I look forward to hearing from you.

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Phone]
[Your Email]

P.S. If you're ever in [your city], coffee is on me!`
      },

      'thank-you': {
        subject: `Thank you for ${purpose}`,
        body: `Subject: Thank you for ${purpose}

Hi ${contact.name},

Thank you so much for ${purpose.toLowerCase()} ${contact.recentActivity ? `and the engaging discussion about ${contact.recentActivity.toLowerCase()}` : ''}.

I really enjoyed learning more about ${contact.company}'s approach to ${contact.interests[0].toLowerCase()}, and I'm impressed by your team's innovative thinking around [specific topic discussed].

As we discussed, I'm following up with:
${context ? `• ${context}` : '• The information you requested'}
• Contact details for [relevant connection/reference]
• Links to the resources we mentioned

Key points from our conversation:
• Your interest in [specific area]
• The timeline for [project/initiative]
• Next steps: [agreed actions]

I've attached:
- [Relevant document/resource]
- [Case study we discussed]
- [Additional helpful material]

Based on our discussion, I believe there's a strong alignment between your needs and our capabilities, particularly around ${contact.interests[0].toLowerCase()}.

Next steps:
1. [Specific action you committed to]
2. [Specific action they committed to]
3. [Scheduled follow-up]

Thank you again for your time and insights. I look forward to [next interaction/meeting/call].

Please don't hesitate to reach out if any questions come up.

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Phone]
[Your Email]`
      },

      scheduling: {
        subject: `Meeting Request - ${purpose}`,
        body: `Subject: Meeting Request - ${purpose}

Hi ${contact.name},

I hope this email finds you well.

I'd like to schedule a meeting to ${purpose.toLowerCase()}. Based on our previous conversations about ${contact.interests[0].toLowerCase()}, I believe this would be a valuable discussion for ${contact.company}.

**Meeting Purpose:** ${purpose}
**Duration:** [30/45/60] minutes
**Format:** [In-person/Video call/Phone]

**Agenda:**
• [Key topic 1]
• [Key topic 2]
• [Key topic 3]
• Q&A and next steps

${context ? `Additional context: ${context}` : ''}

I'm available:
• [Option 1: Day, Date, Time]
• [Option 2: Day, Date, Time]  
• [Option 3: Day, Date, Time]

Alternatively, feel free to suggest times that work better for your schedule.

I'll prepare:
• [Relevant materials/demo/presentation]
• [Case studies specific to your industry]
• [Questions tailored to ${contact.company}'s situation]

Please let me know which option works best, and I'll send a calendar invitation with all the details.

Looking forward to our conversation.

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Phone]
[Your Email]

P.S. If you have any specific topics you'd like to cover, please let me know and I'll make sure to address them.`
      },

      'case-study': {
        subject: `Success Story - ${purpose} Results`,
        body: `Subject: Success Story - ${purpose} Results

Hi ${contact.name},

I hope you're doing well.

Following our conversation about ${contact.interests[0].toLowerCase()}, I wanted to share a relevant success story that I think you'll find interesting.

**Case Study: [Similar Company] Achieves ${purpose}**

The challenge was very similar to what we discussed for ${contact.company}:
• [Challenge 1 that mirrors their situation]
• [Challenge 2 that mirrors their situation]
• [Challenge 3 that mirrors their situation]

**Solution Implemented:**
• [Solution component 1]
• [Solution component 2]
• [Solution component 3]

**Results Achieved:**
• [Specific metric 1] improvement
• [Specific metric 2] increase  
• [Specific metric 3] reduction
• ROI of [specific percentage] within [timeframe]

${context ? `Additional context: ${context}` : ''}

What I found particularly relevant to ${contact.company}'s situation:
• [Specific parallel 1]
• [Specific parallel 2]
• [Specific parallel 3]

The implementation timeline was [X months], and they saw initial results within [timeframe].

I've attached the complete case study, which includes:
- Detailed before/after metrics
- Implementation timeline
- Lessons learned
- ROI analysis

I'd be happy to arrange a reference call with their team if you'd like to hear directly about their experience.

Would you like to discuss how a similar approach might work for ${contact.company}?

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Phone]
[Your Email]

Attachments:
- Case Study: [Company] Success Story
- ROI Analysis Template`
      },

      'resource-share': {
        subject: `Thought you'd find this interesting - ${purpose}`,
        body: `Subject: Thought you'd find this interesting - ${purpose}

Hi ${contact.name},

I hope you're having a productive week.

I came across something I thought you'd find valuable, given our recent conversation about ${contact.interests[0].toLowerCase()} at ${contact.company}.

**Resource:** ${purpose}

This [report/article/study/tool] covers:
• [Key insight 1 relevant to their interests]
• [Key insight 2 relevant to their challenges]
• [Key insight 3 relevant to their industry]

What I found particularly relevant to your situation:
• [Specific insight that applies to their company]
• [Trend that affects their industry]
• [Best practice they might implement]

${context ? `Additional context: ${context}` : ''}

Key takeaways that might interest you:
1. [Takeaway 1]
2. [Takeaway 2]
3. [Takeaway 3]

I've attached/linked the full resource, along with a few additional materials that complement this topic:
- [Additional resource 1]
- [Additional resource 2]

I'd be curious to hear your thoughts on [specific aspect]. How does this align with what you're seeing at ${contact.company}?

No need for a detailed response - just thought this might be useful for your work on ${contact.interests[0].toLowerCase()}.

Hope you find it valuable!

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Phone]
[Your Email]

P.S. If you come across anything interesting related to [relevant topic], I'd love to see it. Always learning!`
      }
    };

    return templates[type] || templates.introduction;
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const copyToClipboard = () => {
    const fullEmail = `Subject: ${emailSubject}\n\n${generatedEmail}`;
    navigator.clipboard.writeText(fullEmail);
    alert('Email copied to clipboard!');
  };

  const saveTemplate = () => {
    const template = {
      id: Date.now(),
      contact: contacts.find(c => c.id === parseInt(selectedContact)),
      type: emailType,
      purpose: emailPurpose,
      subject: emailSubject,
      body: generatedEmail,
      context: customContext,
      createdAt: new Date().toISOString()
    };
    
    setSavedTemplates(prev => [template, ...prev]);
    alert('Email template saved successfully!');
  };

  const sendEmail = () => {
    const contact = contacts.find(c => c.id === parseInt(selectedContact));
    const emailData = {
      to: contact.email,
      subject: emailSubject,
      body: generatedEmail,
      attachments: attachments
    };
    
    // In a real app, this would integrate with an email service
    console.log('Sending email:', emailData);
    alert(`Email would be sent to ${contact.email}`);
  };

  const addAttachment = () => {
    const newAttachment = {
      id: Date.now(),
      name: 'document.pdf',
      size: '1.2 MB',
      type: 'application/pdf'
    };
    setAttachments(prev => [...prev, newAttachment]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const selectedContactData = contacts.find(c => c.id === parseInt(selectedContact));
  const selectedEmailType = emailTypes.find(t => t.value === emailType);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Template Generator
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                previewMode 
                  ? 'bg-blue-100 border-blue-300 text-blue-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4 mr-1 inline" />
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Configuration Panel */}
        <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Setup</h3>
          
          {/* Contact Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient
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
                  <p className="text-sm text-blue-600">{selectedContactData.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Communication Style:</span>
                  <span className="ml-2 text-gray-600">{selectedContactData.communicationStyle}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Recent Activity:</span>
                  <span className="ml-2 text-gray-600">{selectedContactData.recentActivity}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Interests:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedContactData.interests.map((interest, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Type
            </label>
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {emailTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {selectedEmailType && (
              <p className="text-sm text-gray-600 mt-1">{selectedEmailType.description}</p>
            )}
          </div>

          {/* Email Purpose */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Purpose
            </label>
            <textarea
              value={emailPurpose}
              onChange={(e) => setEmailPurpose(e.target.value)}
              placeholder="Describe the purpose of this email..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Custom Context */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Context
            </label>
            <textarea
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              placeholder="Any specific details to include..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="space-y-2">
              {attachments.map(attachment => (
                <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{attachment.name}</span>
                    <span className="text-xs text-gray-500">({attachment.size})</span>
                  </div>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addAttachment}
                className="w-full py-2 px-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                + Add Attachment
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateEmail}
            disabled={isGenerating || !selectedContact || !emailPurpose}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Generate Email</span>
              </>
            )}
          </button>
        </div>

        {/* Email Display */}
        <div className="flex-1 flex flex-col">
          {/* Email Actions */}
          {generatedEmail && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Generated Email</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={saveTemplate}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center space-x-1"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={sendEmail}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {generatedEmail ? (
              previewMode ? (
                // Preview Mode
                <div className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg shadow">
                  {/* Email Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-16">To:</span>
                        <span className="text-gray-900">{selectedContactData?.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-16">From:</span>
                        <span className="text-gray-900">your.email@company.com</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-16">Subject:</span>
                        <span className="text-gray-900">{emailSubject}</span>
                      </div>
                      {attachments.length > 0 && (
                        <div className="flex items-start text-sm">
                          <span className="font-medium text-gray-700 w-16">Attachments:</span>
                          <div className="space-y-1">
                            {attachments.map(attachment => (
                              <div key={attachment.id} className="flex items-center space-x-2">
                                <Paperclip className="w-3 h-3 text-gray-500" />
                                <span className="text-gray-700">{attachment.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Email Body */}
                  <div className="p-6">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                        {generatedEmail}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-4">
                  {/* Subject Line */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Email Body */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Body
                    </label>
                    <textarea
                      value={generatedEmail}
                      onChange={(e) => setGeneratedEmail(e.target.value)}
                      rows={25}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Email Generated</h3>
                  <p className="text-gray-600">
                    Select a contact, email type, and purpose to generate a personalized email template.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Templates Panel */}
      {savedTemplates.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {savedTemplates.slice(0, 3).map(template => (
              <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{template.contact.name}</span>
                  <span className="text-xs text-gray-500">{emailTypes.find(t => t.value === template.type)?.label}</span>
                </div>
                <p className="text-xs text-gray-600 truncate">{template.subject}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Use Template
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

export default EmailTemplate;