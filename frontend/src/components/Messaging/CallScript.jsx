import React, { useState, useEffect } from 'react';
import { Phone, User, Building2, Target, Clock, Download, Copy, RefreshCw, Save, Edit3, Play, Pause } from 'lucide-react';

const CallScript = () => {
  const [selectedContact, setSelectedContact] = useState('');
  const [callPurpose, setCallPurpose] = useState('');
  const [callType, setCallType] = useState('discovery');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedScripts, setSavedScripts] = useState([]);
  const [customNotes, setCustomNotes] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Mock contacts data
  const contacts = [
    {
      id: 1,
      name: 'Ken Murphy',
      company: 'Tesco PLC',
      role: 'Chief Executive Officer',
      lastContact: '2024-08-13',
      relationship: 8.5,
      interests: ['Digital Transformation', 'Operational Efficiency'],
      challenges: ['Budget constraints', 'Legacy systems']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'ASDA',
      role: 'Head of Procurement',
      lastContact: '2024-08-15',
      relationship: 9.2,
      interests: ['Supply Chain', 'Cost Optimization'],
      challenges: ['Integration complexity', 'Vendor management']
    },
    {
      id: 3,
      name: 'David Smith',
      company: 'Marks & Spencer',
      role: 'Customer Experience Director',
      lastContact: '2024-08-14',
      relationship: 7.8,
      interests: ['Customer Journey', 'Personalization'],
      challenges: ['Budget limitations', 'Internal buy-in']
    }
  ];

  const callTypes = [
    { value: 'discovery', label: 'Discovery Call', duration: '30-45 min' },
    { value: 'demo', label: 'Product Demo', duration: '45-60 min' },
    { value: 'followup', label: 'Follow-up Call', duration: '15-30 min' },
    { value: 'negotiation', label: 'Negotiation Call', duration: '30-60 min' },
    { value: 'closing', label: 'Closing Call', duration: '20-40 min' },
    { value: 'check-in', label: 'Relationship Check-in', duration: '15-25 min' }
  ];

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setCallDuration(time => time + 1);
      }, 1000);
    } else if (!isTimerRunning && callDuration !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, callDuration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateScript = async () => {
    if (!selectedContact || !callPurpose || !callType) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const contact = contacts.find(c => c.id === parseInt(selectedContact));
    const callTypeInfo = callTypes.find(t => t.value === callType);

    const script = generateCallScript(contact, callPurpose, callType, callTypeInfo);
    setGeneratedScript(script);
    setIsGenerating(false);
  };

  const generateCallScript = (contact, purpose, type, typeInfo) => {
    const scripts = {
      discovery: `
**DISCOVERY CALL SCRIPT**
**Contact:** ${contact.name} - ${contact.role} at ${contact.company}
**Purpose:** ${purpose}
**Duration:** ${typeInfo.duration}

**OPENING (2-3 minutes)**
"Good ${getTimeOfDay()}, ${contact.name}. Thank you for taking the time to speak with me today. I'm calling because ${purpose.toLowerCase()}. 

Based on our previous interactions and what I know about ${contact.company}, I believe we might have some solutions that could be valuable for your ${type === 'discovery' ? 'upcoming initiatives' : 'current challenges'}.

Do you have about ${typeInfo.duration.split('-')[0]} minutes to discuss this?"

**DISCOVERY QUESTIONS (15-20 minutes)**
${contact.interests.map(interest => `• "I noticed ${contact.company} has been focusing on ${interest.toLowerCase()}. Can you tell me more about your current initiatives in this area?"`).join('\n')}

• "What are the biggest challenges you're facing with ${contact.challenges[0].toLowerCase()}?"
• "How are you currently handling [specific process related to our solution]?"
• "What would success look like for you in this area?"
• "Who else would be involved in evaluating a solution like this?"

**PAIN POINT EXPLORATION (5-10 minutes)**
"You mentioned ${contact.challenges[0].toLowerCase()} - can you help me understand:
• How is this impacting your day-to-day operations?
• What's the cost of not addressing this issue?
• Have you looked at other solutions? What did you find?"

**VALUE PROPOSITION (5-7 minutes)**
"Based on what you've shared, I think our solution could help you with:
• [Specific benefit related to their challenge]
• [ROI or efficiency gain]
• [Competitive advantage]

We've helped similar companies like [relevant case study] achieve [specific results]."

**NEXT STEPS (3-5 minutes)**
"I'd love to show you exactly how this would work for ${contact.company}. 
Would you be open to a brief demo next week? I can also send you a case study from [similar company] that shows the results they achieved.

Who else should be involved in this conversation?"

**CLOSING**
"Thank you for your time today, ${contact.name}. I'll send you a calendar invite for [agreed next step] and follow up with the case study. 

Is ${contact.name.split(' ')[0]} the best email to reach you at?"

**FOLLOW-UP NOTES:**
- Key interests: ${contact.interests.join(', ')}
- Main challenges: ${contact.challenges.join(', ')}
- Next step: [To be filled during call]
- Decision makers: [To be identified during call]
`,

      demo: `
**PRODUCT DEMO SCRIPT**
**Contact:** ${contact.name} - ${contact.role} at ${contact.company}
**Purpose:** ${purpose}
**Duration:** ${typeInfo.duration}

**PRE-DEMO SETUP (5 minutes)**
"Hi ${contact.name}, thank you for joining today's demo. Before we start, I want to make sure we focus on what's most relevant for ${contact.company}.

From our last conversation, you mentioned [key challenge/interest]. Is that still your top priority?
Who else is joining us today, and what's their role in this decision?"

**DEMO STRUCTURE (30-40 minutes)**

**1. Problem Statement (5 minutes)**
"Let me start by showing you how we address ${contact.challenges[0].toLowerCase()} that you mentioned..."

**2. Core Solution Demo (20-25 minutes)**
[Screen sharing begins]
"Here's how ${contact.company} would use our platform:

• Dashboard Overview: "This is what your team would see every morning..."
• Specific Feature 1: "Remember you mentioned [challenge]? Here's how we solve that..."
• Specific Feature 2: "For ${contact.interests[0].toLowerCase()}, you'd use this feature..."
• Integration: "This connects with your existing systems like..."

**3. ROI Discussion (5-10 minutes)**
"Based on your current situation, here's what other companies similar to ${contact.company} have achieved:
• [Specific metric improvement]
• [Cost savings]
• [Efficiency gains]"

**Q&A AND OBJECTION HANDLING (10-15 minutes)**
Common questions to prepare for:
• "How does this integrate with our current systems?"
• "What's the implementation timeline?"
• "What kind of training is required?"
• "How do you ensure data security?"

**NEXT STEPS (5 minutes)**
"What questions do you have about what we've shown today?
Based on what you've seen, how does this align with ${contact.company}'s needs?

I'd like to propose:
1. [Specific next step - pilot, trial, proposal]
2. [Timeline]
3. [Who needs to be involved]

Does that make sense as a next step?"

**FOLLOW-UP COMMITMENTS:**
- Demo recording and slides
- ROI calculator customized for ${contact.company}
- Reference calls with similar customers
- Detailed implementation timeline
`,

      followup: `
**FOLLOW-UP CALL SCRIPT**
**Contact:** ${contact.name} - ${contact.role} at ${contact.company}
**Purpose:** ${purpose}
**Duration:** ${typeInfo.duration}

**OPENING (2 minutes)**
"Hi ${contact.name}, I hope you're doing well. I'm following up on our conversation from ${contact.lastContact} about ${purpose.toLowerCase()}.

I wanted to check in and see if you had any additional questions, and share some updates that might be relevant for ${contact.company}."

**RECAP AND STATUS CHECK (5-8 minutes)**
"To recap our last conversation:
• We discussed [key points from last call]
• You were going to [their action items]
• I was going to [your action items]

How did those go on your end?"

**NEW INFORMATION/UPDATES (5-10 minutes)**
"Since we last spoke, I wanted to share:
• [Relevant update, new feature, case study]
• [Industry insight that affects them]
• [Specific solution to challenge they mentioned]

Also, I've prepared [resource/demo/proposal] that addresses the [specific need] you mentioned."

**ADDRESSING CONCERNS (5-10 minutes)**
"In our last conversation, you mentioned some concerns about [specific concern].
I've done some research and here's how we typically handle that:
[Specific solution/answer]

Have you had any other questions come up since we talked?"

**PROGRESSION (5 minutes)**
"Where do you stand on [the decision/evaluation process]?
What would be most helpful for you at this stage?

Options:
• Another demo for your team
• A pilot project
• Speaking with references
• Detailed proposal
• Technical deep-dive"

**NEXT STEPS (2-3 minutes)**
"Based on our conversation today, I suggest:
[Specific next step with timeline]

Does [proposed date/time] work for you?
Who else should be involved in the next conversation?"

**CLOSING**
"Thanks for the update, ${contact.name}. I'll [follow-up action] and send you [specific deliverable] by [date].

Feel free to reach out if any questions come up before then."
`,

      negotiation: `
**NEGOTIATION CALL SCRIPT**
**Contact:** ${contact.name} - ${contact.role} at ${contact.company}
**Purpose:** ${purpose}
**Duration:** ${typeInfo.duration}

**OPENING (3 minutes)**
"Hi ${contact.name}, thank you for making time for this important conversation. 

I know you've been evaluating our proposal, and I want to make sure we address any final questions or concerns you have so we can move forward with the best solution for ${contact.company}."

**PROPOSAL REVIEW (10-15 minutes)**
"Let's review the key components of our proposal:
• Solution scope: [key features/services]
• Investment: [pricing structure]
• Timeline: [implementation schedule]
• Success metrics: [agreed-upon KPIs]

Are these still aligned with your requirements and expectations?"

**ADDRESSING OBJECTIONS (15-20 minutes)**

**Price Objection:**
"I understand budget is always a consideration. Let's look at the ROI:
• Current cost of [their problem]: [quantified cost]
• Our solution saves: [specific savings]
• Payback period: [timeframe]
• Additional value: [other benefits]

What if we structured the investment differently? We could:
• Phase the implementation
• Adjust the payment terms
• Start with a pilot project"

**Feature/Scope Concerns:**
"You mentioned concerns about [specific feature]. Let me clarify:
[Detailed explanation]
Would you like us to include [additional feature] to address this?"

**Timeline Concerns:**
"Regarding the implementation timeline, we can:
• Prioritize the most critical features first
• Provide additional resources to accelerate
• Offer phased rollout to minimize disruption"

**FINDING COMMON GROUND (10-15 minutes)**
"What I'm hearing is that you want:
• [Their key requirement 1]
• [Their key requirement 2]  
• [Their key requirement 3]

From our side, we need:
• [Your requirement 1]
• [Your requirement 2]

Where can we find a solution that works for both of us?"

**CLOSING AND NEXT STEPS (5-10 minutes)**
"Based on our discussion today, here's what I propose:
[Modified proposal/compromise]

If we can agree on these terms, what would the approval process look like on your end?
Who else needs to sign off on this decision?
What timeline are you working towards for implementation?"

**COMMITMENT (2 minutes)**
"${contact.name}, I want to make sure we get this right for ${contact.company}. 
What do you need from me to move this forward?
When can we expect a decision?"

**FOLLOW-UP PLAN:**
- Revised proposal document
- Reference calls if needed
- Executive sponsor meeting if required
- Contract review timeline
`,

      closing: `
**CLOSING CALL SCRIPT**
**Contact:** ${contact.name} - ${contact.role} at ${contact.company}
**Purpose:** ${purpose}
**Duration:** ${typeInfo.duration}

**OPENING (2 minutes)**
"Hi ${contact.name}, I'm excited to speak with you today. Based on our previous conversations and the progress we've made, it sounds like you're ready to move forward with our solution for ${contact.company}.

Is that correct, or are there any final items you'd like to discuss?"

**FINAL CONFIRMATION (10-15 minutes)**
"Let me confirm the final details:

**Solution Summary:**
• Scope: [specific solution components]
• Benefits: [key value propositions for their company]
• Investment: [final pricing]
• Timeline: [implementation schedule]
• Success metrics: [agreed KPIs]

Does this accurately reflect what we've discussed?"

**IMPLEMENTATION PLANNING (10-15 minutes)**
"Assuming we move forward today, here's what the next steps would look like:

**Week 1-2:** Contract execution and project kickoff
• Legal review and signatures
• Project team introductions
• Technical requirements gathering

**Week 3-4:** Implementation phase 1
• [Specific milestones]
• Team training begins
• Initial configuration

**Month 2:** [Subsequent phases]

Does this timeline work with your plans?"

**ADDRESSING FINAL CONCERNS (5-10 minutes)**
"Before we finalize this, are there any last concerns or questions?

Common final concerns:
• 'What if it doesn't work as expected?' - [Implementation guarantee/support]
• 'What about ongoing support?' - [Support structure details]
• 'How do we measure success?' - [Success metrics and review process]"

**THE CLOSE (5 minutes)**
"${contact.name}, based on everything we've discussed:
• Our solution addresses your key challenges with ${contact.challenges[0].toLowerCase()}
• You'll see [specific benefits] within [timeframe]
• We have a clear implementation plan
• The investment delivers strong ROI

Are you ready to move forward with this partnership?

[Wait for response]

Excellent! What do we need to do to get the contract process started?
Who handles procurement on your end?"

**NEXT STEPS CONFIRMATION (3-5 minutes)**
"Here's what happens next:
1. I'll send the final contract today
2. [Contact person] will review with legal
3. We'll schedule a kickoff meeting for [date]
4. Implementation begins [date]

Who should I copy on the contract and project communications?
What's the best way to stay in touch during implementation?"

**CLOSING GRATITUDE (1 minute)**
"${contact.name}, thank you for choosing us as your partner. We're excited to help ${contact.company} achieve [specific goals].

I'll personally ensure this implementation goes smoothly. You have my direct contact information if you need anything."
`,

      'check-in': `
**RELATIONSHIP CHECK-IN SCRIPT**
**Contact:** ${contact.name} - ${contact.role} at ${contact.company}
**Purpose:** ${purpose}
**Duration:** ${typeInfo.duration}

**WARM OPENING (2-3 minutes)**
"Hi ${contact.name}, I hope you're having a good week. 

I wanted to reach out for a quick check-in. It's been [time period] since we last spoke, and I always like to stay connected with key partners like ${contact.company}.

How have things been going for you lately?"

**CURRENT STATE CHECK (5-8 minutes)**
"What's keeping you busy these days? Any exciting projects or initiatives at ${contact.company}?

[Listen actively and take notes]

That sounds [interesting/challenging/exciting]. How is that [project/initiative] progressing?"

**VALUE-ADD CONVERSATION (8-12 minutes)**
Based on what they share, provide relevant value:

**If they mention challenges:**
"That's interesting you mention [challenge]. We've actually been seeing similar situations with other companies in your industry. 

One thing that's been working well is [solution/approach]. Would you like me to share some insights on how others have handled this?"

**If they mention opportunities:**
"That sounds like a great opportunity. Have you considered [relevant suggestion]?

We recently helped [similar company] with something similar and they saw [specific results]."

**If they mention industry trends:**
"Yes, we're seeing that trend across the industry. In fact, [relevant insight/data].

How is ${contact.company} positioning itself around this trend?"

**RELATIONSHIP BUILDING (3-5 minutes)**
"Speaking of [topic they mentioned], have you had a chance to [follow up on previous conversation topic]?

I remember you were [interested in/working on] [specific thing from previous interaction]."

**SOFT OPPORTUNITY EXPLORATION (2-5 minutes)**
"While I have you, is there anything on your radar where our expertise might be helpful?

We're always looking for ways to add value to partners like ${contact.company}, whether that's:
• Industry insights and benchmarking
• Introductions to other professionals
• Solutions to operational challenges
• Strategic planning support"

**CLOSING AND NEXT STEPS (2-3 minutes)**
"It's been great catching up, ${contact.name}. I really appreciate you taking the time.

Based on our conversation, I'd love to [specific follow-up]:
• Send you that article about [relevant topic]
• Introduce you to [relevant contact]
• Schedule a deeper conversation about [opportunity they mentioned]

What would be most valuable for you?"

**FINAL WARM CLOSE (1 minute)**
"Thanks again for the time today. I'll [specific follow-up action] and we'll touch base again in [timeframe].

Don't hesitate to reach out if anything comes up where I might be helpful. I'm always happy to chat."

**POST-CALL NOTES:**
- Current priorities: [What they're focused on]
- Challenges mentioned: [Any problems they shared]
- Opportunities: [Potential areas for collaboration]
- Personal notes: [Relationship building information]
- Next contact: [Planned follow-up timeline]
`
    };

    return scripts[type] || scripts.discovery;
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    alert('Script copied to clipboard!');
  };

  const saveScript = () => {
    const script = {
      id: Date.now(),
      contact: contacts.find(c => c.id === parseInt(selectedContact)),
      purpose: callPurpose,
      type: callType,
      script: generatedScript,
      notes: customNotes,
      createdAt: new Date().toISOString(),
      duration: callDuration
    };
    
    setSavedScripts(prev => [script, ...prev]);
    alert('Script saved successfully!');
  };

  const selectedContactData = contacts.find(c => c.id === parseInt(selectedContact));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Call Script Generator
          </h2>
          
          {/* Call Timer */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-lg font-mono text-gray-900">{formatTime(callDuration)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-1 rounded ${isTimerRunning ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setCallDuration(0);
                  setIsTimerRunning(false);
                }}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Configuration Panel */}
        <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Setup</h3>
          
          {/* Contact Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact
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
                  <p className="text-sm text-blue-600">{selectedContactData.company}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Last Contact:</span>
                  <span className="ml-2 text-gray-600">{selectedContactData.lastContact}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Relationship:</span>
                  <span className="ml-2 text-gray-600">{selectedContactData.relationship}/10</span>
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

          {/* Call Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call Type
            </label>
            <select
              value={callType}
              onChange={(e) => setCallType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {callTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} ({type.duration})
                </option>
              ))}
            </select>
          </div>

          {/* Call Purpose */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call Purpose
            </label>
            <textarea
              value={callPurpose}
              onChange={(e) => setCallPurpose(e.target.value)}
              placeholder="Describe the purpose of this call..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Custom Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Any specific points to cover or avoid..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateScript}
            disabled={isGenerating || !selectedContact || !callPurpose}
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
                <span>Generate Script</span>
              </>
            )}
          </button>
        </div>

        {/* Script Display */}
        <div className="flex-1 flex flex-col">
          {/* Script Actions */}
          {generatedScript && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Generated Call Script</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={saveScript}
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

          {/* Script Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {generatedScript ? (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                  {generatedScript}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Script Generated</h3>
                  <p className="text-gray-600">
                    Select a contact, call type, and purpose to generate a personalized call script.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Scripts Panel */}
      {savedScripts.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Scripts</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {savedScripts.slice(0, 3).map(script => (
              <div key={script.id} className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{script.contact.name}</span>
                  <span className="text-xs text-gray-500">{callTypes.find(t => t.value === script.type)?.label}</span>
                </div>
                <p className="text-xs text-gray-600 truncate">{script.purpose}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(script.createdAt).toLocaleDateString()}
                  </span>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    View
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

export default CallScript;