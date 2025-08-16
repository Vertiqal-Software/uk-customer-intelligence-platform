import React, { useState, useEffect } from 'react';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    role: '',
    company_size: '',
    industry: '',
    primary_use_case: '',
    integration_preferences: [],
    notification_preferences: {
      email: true,
      push: false
    }
  });
  const [setupProgress, setSetupProgress] = useState({
    profile: false,
    integrations: false,
    sample_data: false,
    tour_completed: false
  });

  const totalSteps = 6;

  const steps = [
    {
      id: 1,
      title: 'Welcome to IntelliSource',
      subtitle: 'Let\'s get you set up for success',
      component: 'Welcome'
    },
    {
      id: 2,
      title: 'Tell us about yourself',
      subtitle: 'Help us personalize your experience',
      component: 'Profile'
    },
    {
      id: 3,
      title: 'Choose your focus',
      subtitle: 'What will you primarily use IntelliSource for?',
      component: 'UseCase'
    },
    {
      id: 4,
      title: 'Connect your data',
      subtitle: 'Set up integrations to get the most value',
      component: 'Integrations'
    },
    {
      id: 5,
      title: 'Sample data setup',
      subtitle: 'We\'ll create some sample data to get you started',
      component: 'SampleData'
    },
    {
      id: 6,
      title: 'Quick tour',
      subtitle: 'Let\'s show you around the platform',
      component: 'Tour'
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(totalSteps);
  };

  const handleFinish = () => {
    // Complete onboarding
    console.log('Onboarding completed', userData);
    window.location.href = '/dashboard';
  };

  const updateUserData = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createSampleData = async () => {
    setLoading(true);
    try {
      // Mock sample data creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSetupProgress(prev => ({ ...prev, sample_data: true }));
    } catch (error) {
      console.error('Failed to create sample data:', error);
    } finally {
      setLoading(false);
    }
  };

  const WelcomeStep = () => (
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to IntelliSource!</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Your intelligent business intelligence platform for company research, tender opportunities, 
        and competitive intelligence. Let's get you set up in just a few minutes.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Company Intelligence</h3>
          <p className="text-sm text-gray-600">Research companies, track filings, and monitor business changes</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Tender Opportunities</h3>
          <p className="text-sm text-gray-600">Find and track government and private sector tenders</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Sales Intelligence</h3>
          <p className="text-sm text-gray-600">Generate insights and automate outreach campaigns</p>
        </div>
      </div>
    </div>
  );

  const ProfileStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What's your role?</label>
          <div className="grid grid-cols-2 gap-3">
            {['Sales Manager', 'Business Development', 'Marketing Manager', 'CEO/Founder', 'Analyst', 'Other'].map((role) => (
              <button
                key={role}
                onClick={() => updateUserData('role', role)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  userData.role === role
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company size</label>
          <div className="grid grid-cols-2 gap-3">
            {['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '500+ employees', 'Enterprise'].map((size) => (
              <button
                key={size}
                onClick={() => updateUserData('company_size', size)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  userData.company_size === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
          <select
            value={userData.industry}
            onChange={(e) => updateUserData('industry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your industry</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="consulting">Consulting</option>
            <option value="retail">Retail</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const UseCaseStep = () => (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            id: 'company_research',
            title: 'Company Research',
            description: 'Research prospects, track company changes, and identify decision makers',
            icon: '🔍'
          },
          {
            id: 'tender_tracking',
            title: 'Tender Tracking',
            description: 'Find tender opportunities and track government contracts',
            icon: '📋'
          },
          {
            id: 'sales_intelligence',
            title: 'Sales Intelligence',
            description: 'Generate insights for sales teams and automate outreach',
            icon: '💡'
          },
          {
            id: 'competitive_analysis',
            title: 'Competitive Analysis',
            description: 'Monitor competitors and track market changes',
            icon: '⚔️'
          }
        ].map((useCase) => (
          <button
            key={useCase.id}
            onClick={() => updateUserData('primary_use_case', useCase.id)}
            className={`p-6 text-left border rounded-lg transition-colors ${
              userData.primary_use_case === useCase.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-3xl mb-3">{useCase.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{useCase.title}</h3>
            <p className="text-sm text-gray-600">{useCase.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const IntegrationsStep = () => {
    const integrations = [
      { id: 'companies_house', name: 'Companies House', description: 'UK company data', enabled: true, required: true },
      { id: 'find_a_tender', name: 'Find a Tender', description: 'UK government tenders', enabled: false },
      { id: 'salesforce', name: 'Salesforce CRM', description: 'Sync with your CRM', enabled: false },
      { id: 'hubspot', name: 'HubSpot', description: 'Marketing automation', enabled: false },
      { id: 'slack', name: 'Slack', description: 'Team notifications', enabled: false },
      { id: 'teams', name: 'Microsoft Teams', description: 'Collaboration tools', enabled: false }
    ];

    const toggleIntegration = (integrationId) => {
      if (integrations.find(i => i.id === integrationId)?.required) return;
      
      const current = userData.integration_preferences || [];
      const updated = current.includes(integrationId)
        ? current.filter(id => id !== integrationId)
        : [...current, integrationId];
      updateUserData('integration_preferences', updated);
    };

    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You can set up integrations later. We'll help you get started with the essentials.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className={`p-4 border rounded-lg ${
                integration.enabled || (userData.integration_preferences || []).includes(integration.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                  {integration.required && (
                    <span className="text-xs text-blue-600 font-medium">Required</span>
                  )}
                </div>
                <button
                  onClick={() => toggleIntegration(integration.id)}
                  disabled={integration.required}
                  className={`ml-4 px-3 py-1 text-sm rounded transition-colors ${
                    integration.enabled || (userData.integration_preferences || []).includes(integration.id)
                      ? 'bg-green-600 text-white'
                      : integration.required
                      ? 'bg-blue-600 text-white cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {integration.enabled || (userData.integration_preferences || []).includes(integration.id) || integration.required
                    ? 'Enabled'
                    : 'Enable'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SampleDataStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      {!setupProgress.sample_data ? (
        <div>
          <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3 3-3" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Sample Data</h3>
          <p className="text-gray-600 mb-8">
            We'll create some sample companies, tenders, and contacts to help you explore the platform. 
            This will give you a feel for how everything works.
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Sample Companies</span>
              <span className="text-sm text-gray-600">~50 companies</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Sample Tenders</span>
              <span className="text-sm text-gray-600">~20 opportunities</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Sample Contacts</span>
              <span className="text-sm text-gray-600">~30 contacts</span>
            </div>
          </div>
          <button
            onClick={createSampleData}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating sample data...
              </div>
            ) : (
              'Create Sample Data'
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Sample Data Created!</h3>
          <p className="text-gray-600 mb-8">
            Great! We've created sample data for you to explore. You can now see how the platform works 
            with real-world examples.
          </p>
        </div>
      )}
    </div>
  );

  const TourStep = () => {
    const features = [
      {
        title: 'Dashboard',
        description: 'Your central hub for all insights and alerts',
        icon: '📊'
      },
      {
        title: 'Company Research',
        description: 'Search and analyze companies with detailed intelligence',
        icon: '🔍'
      },
      {
        title: 'Tender Opportunities',
        description: 'Find and track relevant tender opportunities',
        icon: '📋'
      },
      {
        title: 'Reports & Analytics',
        description: 'Generate insights and track your performance',
        icon: '📈'
      }
    ];

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">You're all set! 🎉</h3>
          <p className="text-gray-600">
            Here's a quick overview of what you can do with IntelliSource:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Explore {feature.title} →
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>💡 Pro Tip:</strong> Check out the sample data we created to get familiar with the platform. 
              You can always delete it later and add your own data.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleFinish}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Go to Dashboard
            </button>
            <div>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Take a guided tour instead
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <WelcomeStep />;
      case 2: return <ProfileStep />;
      case 3: return <UseCaseStep />;
      case 4: return <IntegrationsStep />;
      case 5: return <SampleDataStep />;
      case 6: return <TourStep />;
      default: return <WelcomeStep />;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 2: return userData.role && userData.company_size;
      case 3: return userData.primary_use_case;
      case 5: return setupProgress.sample_data;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="text-gray-400 hover:text-gray-600"
              >
                Skip setup
              </button>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-sm text-gray-600">
                  {currentStep} of {totalSteps}
                </span>
              </div>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {steps[currentStep - 1]?.title}
          </h1>
          <p className="text-lg text-gray-600">
            {steps[currentStep - 1]?.subtitle}
          </p>
        </div>

        <div className="mb-12">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStep < totalSteps && (
              <button
                onClick={handleSkip}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 5 && !setupProgress.sample_data ? 'Continue' : 'Next'}
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingFlow;