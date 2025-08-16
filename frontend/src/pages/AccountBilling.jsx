import React, { useState, useEffect } from 'react';

const AccountBilling = () => {
  const [activeTab, setActiveTab] = useState('subscription');
  const [loading, setLoading] = useState(false);
  const [billingData, setBillingData] = useState({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    setLoading(true);
    try {
      // Mock billing data
      const mockData = {
        subscription: {
          plan: 'Professional',
          status: 'active',
          billing_cycle: 'monthly',
          price: 99,
          currency: 'GBP',
          next_billing_date: '2025-02-15',
          auto_renew: true,
          features: [
            'Up to 10,000 company records',
            'Advanced analytics',
            'Tender intelligence',
            'Email sequences',
            'API access',
            'Priority support'
          ]
        },
        usage: {
          current_period: {
            companies_tracked: 2847,
            api_calls: 15420,
            storage_used: 2.3,
            reports_generated: 45
          },
          limits: {
            companies_tracked: 10000,
            api_calls: 50000,
            storage_gb: 10,
            reports_per_month: 100
          }
        },
        billing_history: [
          {
            id: 'inv_001',
            date: '2025-01-15',
            amount: 99,
            status: 'paid',
            description: 'Professional Plan - January 2025',
            download_url: '/invoices/inv_001.pdf'
          },
          {
            id: 'inv_002',
            date: '2024-12-15',
            amount: 99,
            status: 'paid',
            description: 'Professional Plan - December 2024',
            download_url: '/invoices/inv_002.pdf'
          },
          {
            id: 'inv_003',
            date: '2024-11-15',
            amount: 99,
            status: 'paid',
            description: 'Professional Plan - November 2024',
            download_url: '/invoices/inv_003.pdf'
          }
        ],
        payment_methods: [
          {
            id: 'pm_001',
            type: 'card',
            brand: 'Visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2028,
            is_default: true
          }
        ]
      };
      setBillingData(mockData);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'GBP') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getUsagePercentage = (used, limit) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleUpgradePlan = (plan) => {
    console.log('Upgrading to plan:', plan);
    setShowUpgradeModal(false);
    alert(`Upgrade to ${plan} plan initiated`);
  };

  const handleDownloadInvoice = (invoiceUrl) => {
    window.open(invoiceUrl, '_blank');
  };

  const plans = [
    {
      name: 'Starter',
      price: 29,
      billing: 'monthly',
      features: [
        'Up to 1,000 company records',
        'Basic analytics',
        'Email support',
        'Core integrations'
      ],
      limits: {
        companies: 1000,
        api_calls: 10000,
        storage: 1,
        reports: 10
      }
    },
    {
      name: 'Professional',
      price: 99,
      billing: 'monthly',
      features: [
        'Up to 10,000 company records',
        'Advanced analytics',
        'Tender intelligence',
        'Email sequences',
        'API access',
        'Priority support'
      ],
      limits: {
        companies: 10000,
        api_calls: 50000,
        storage: 10,
        reports: 100
      },
      current: true
    },
    {
      name: 'Enterprise',
      price: 299,
      billing: 'monthly',
      features: [
        'Unlimited company records',
        'Custom analytics',
        'Advanced tender intelligence',
        'White-label options',
        'Dedicated support',
        'Custom integrations'
      ],
      limits: {
        companies: 'Unlimited',
        api_calls: 'Unlimited',
        storage: 100,
        reports: 'Unlimited'
      }
    }
  ];

  const tabs = [
    { id: 'subscription', name: 'Subscription', icon: '📊' },
    { id: 'usage', name: 'Usage & Limits', icon: '📈' },
    { id: 'billing', name: 'Billing History', icon: '🧾' },
    { id: 'payment', name: 'Payment Methods', icon: '💳' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading billing information...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account & Billing</h1>
              <p className="text-sm text-gray-600">Manage your subscription and billing</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                billingData.subscription?.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {billingData.subscription?.status?.charAt(0).toUpperCase() + billingData.subscription?.status?.slice(1)}
              </span>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Plan
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
        {activeTab === 'subscription' && (
          <div className="space-y-8">
            {/* Current Plan */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Current Plan</h3>
                  <p className="text-gray-600">Your active subscription details</p>
                </div>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Change Plan
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="mb-4">
                    <h4 className="text-2xl font-bold text-gray-900">{billingData.subscription?.plan}</h4>
                    <p className="text-gray-600">
                      {formatCurrency(billingData.subscription?.price)} / {billingData.subscription?.billing_cycle}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Next billing date:</span>
                      <span className="ml-2 text-gray-900">{formatDate(billingData.subscription?.next_billing_date)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Auto-renewal:</span>
                      <span className={`ml-2 ${billingData.subscription?.auto_renew ? 'text-green-600' : 'text-red-600'}`}>
                        {billingData.subscription?.auto_renew ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Plan Features</h5>
                  <ul className="space-y-2">
                    {billingData.subscription?.features?.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-8">
            {/* Usage Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-medium text-gray-700 mb-2">Companies Tracked</h4>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {billingData.usage?.current_period?.companies_tracked?.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    / {billingData.usage?.limits?.companies_tracked?.toLocaleString()}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(
                        billingData.usage?.current_period?.companies_tracked,
                        billingData.usage?.limits?.companies_tracked
                      ))}`}
                      style={{
                        width: `${getUsagePercentage(
                          billingData.usage?.current_period?.companies_tracked,
                          billingData.usage?.limits?.companies_tracked
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-medium text-gray-700 mb-2">API Calls</h4>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {billingData.usage?.current_period?.api_calls?.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    / {billingData.usage?.limits?.api_calls?.toLocaleString()}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(
                        billingData.usage?.current_period?.api_calls,
                        billingData.usage?.limits?.api_calls
                      ))}`}
                      style={{
                        width: `${getUsagePercentage(
                          billingData.usage?.current_period?.api_calls,
                          billingData.usage?.limits?.api_calls
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-medium text-gray-700 mb-2">Storage Used</h4>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {billingData.usage?.current_period?.storage_used}GB
                  </span>
                  <span className="text-sm text-gray-500">
                    / {billingData.usage?.limits?.storage_gb}GB
                  </span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(
                        billingData.usage?.current_period?.storage_used,
                        billingData.usage?.limits?.storage_gb
                      ))}`}
                      style={{
                        width: `${getUsagePercentage(
                          billingData.usage?.current_period?.storage_used,
                          billingData.usage?.limits?.storage_gb
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-medium text-gray-700 mb-2">Reports Generated</h4>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {billingData.usage?.current_period?.reports_generated}
                  </span>
                  <span className="text-sm text-gray-500">
                    / {billingData.usage?.limits?.reports_per_month}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(
                        billingData.usage?.current_period?.reports_generated,
                        billingData.usage?.limits?.reports_per_month
                      ))}`}
                      style={{
                        width: `${getUsagePercentage(
                          billingData.usage?.current_period?.reports_generated,
                          billingData.usage?.limits?.reports_per_month
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Billing History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billingData.billing_history?.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDownloadInvoice(invoice.download_url)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-8">
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Payment Methods</h3>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Payment Method
                </button>
              </div>

              <div className="space-y-4">
                {billingData.payment_methods?.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{method.brand}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          **** **** **** {method.last4}
                        </p>
                        <p className="text-sm text-gray-600">
                          Expires {method.exp_month}/{method.exp_year}
                        </p>
                      </div>
                      {method.is_default && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Choose Your Plan</h3>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`border rounded-lg p-6 ${
                      plan.current 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                      <div className="mt-2">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatCurrency(plan.price)}
                        </span>
                        <span className="text-gray-600">/{plan.billing}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleUpgradePlan(plan.name)}
                      disabled={plan.current}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        plan.current
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {plan.current ? 'Current Plan' : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountBilling;