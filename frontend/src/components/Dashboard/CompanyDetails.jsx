import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

const CompanyDetails = ({ selectedCompany }) => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [monitoring, setMonitoring] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (selectedCompany?.company_number) {
      loadCompanyDetails();
    }
  }, [selectedCompany]);

  const loadCompanyDetails = async () => {
    if (!selectedCompany?.company_number) return;

    try {
      setLoading(true);
      setError('');
      
      const result = await apiService.getCompanyDetails(selectedCompany.company_number);
      if (result.success) {
        setCompanyData(result.data.company);
      } else {
        setError(result.error || 'Failed to load company details');
      }
    } catch (err) {
      setError('Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  const handleMonitoringToggle = async () => {
    if (!companyData?.companies_house_number) return;

    try {
      setMonitoring(true);
      if (companyData.is_monitored) {
        const result = await apiService.removeFromMonitoring(companyData.companies_house_number);
        if (result.success) {
          setCompanyData(prev => ({ ...prev, is_monitored: false }));
        }
      } else {
        const result = await apiService.addToMonitoring(companyData.companies_house_number);
        if (result.success) {
          setCompanyData(prev => ({ ...prev, is_monitored: true, monitoring_since: new Date().toISOString() }));
        }
      }
    } catch (err) {
      console.error('Failed to toggle monitoring:', err);
    } finally {
      setMonitoring(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'dissolved': return 'bg-red-100 text-red-800';
      case 'liquidation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedCompany) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Selected</h3>
          <p className="text-gray-500">Search for a company above to view detailed information</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Company</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadCompanyDetails}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'overview', name: 'Overview', icon: '📋' },
    { id: 'address', name: 'Address', icon: '📍' },
    { id: 'business', name: 'Business', icon: '🏢' },
    { id: 'accounts', name: 'Accounts', icon: '💰' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {companyData?.name || selectedCompany.company_name}
              </h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(companyData?.status || selectedCompany.company_status)}`}>
                {companyData?.status || selectedCompany.company_status || 'Unknown'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Company #{companyData?.companies_house_number || selectedCompany.company_number}
            </p>
            {companyData?.is_monitored && companyData?.monitoring_since && (
              <p className="text-xs text-blue-600 mt-1">
                Monitored since {formatDate(companyData.monitoring_since)}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/company/${companyData?.companies_house_number || selectedCompany.company_number}`)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View Full Details
            </button>
            <button
              onClick={handleMonitoringToggle}
              disabled={monitoring}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                companyData?.is_monitored
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {monitoring ? 'Processing...' : (companyData?.is_monitored ? 'Stop Monitoring' : 'Start Monitoring')}
            </button>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="px-6 border-b border-gray-200">
        <nav className="flex space-x-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{companyData?.name || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{companyData?.companies_house_number || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{companyData?.status || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Incorporation Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(companyData?.incorporation_date)}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Monitoring Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Currently Monitored</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    companyData?.is_monitored 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {companyData?.is_monitored ? 'Yes' : 'No'}
                  </span>
                </div>
                {companyData?.is_monitored && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      🔔 You'll receive alerts for this company when important changes occur
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'address' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Registered Office Address</h3>
            {companyData?.registered_office_address ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <address className="not-italic text-sm text-gray-900 leading-relaxed">
                  {companyData.registered_office_address.address_line_1 && (
                    <div>{companyData.registered_office_address.address_line_1}</div>
                  )}
                  {companyData.registered_office_address.address_line_2 && (
                    <div>{companyData.registered_office_address.address_line_2}</div>
                  )}
                  {companyData.registered_office_address.locality && (
                    <div>{companyData.registered_office_address.locality}</div>
                  )}
                  {companyData.registered_office_address.postal_code && (
                    <div className="font-medium">{companyData.registered_office_address.postal_code}</div>
                  )}
                  {companyData.registered_office_address.country && (
                    <div className="mt-2 text-gray-600">{companyData.registered_office_address.country}</div>
                  )}
                </address>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Address information not available</p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'business' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Activities</h3>
            {companyData?.sic_codes && companyData.sic_codes.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Standard Industrial Classification (SIC) codes describe what the company does:
                </p>
                <div className="grid gap-3">
                  {companyData.sic_codes.map((sic, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                        {sic}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          Business activity code - detailed description would be available from SIC code lookup
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-500">No business activity information available</p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'accounts' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
            {companyData?.accounts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companyData.accounts.next_due && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">Next Accounts Due</h4>
                    <p className="text-lg font-semibold text-yellow-900">
                      {formatDate(companyData.accounts.next_due)}
                    </p>
                  </div>
                )}
                
                {companyData.accounts.last_accounts && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Last Accounts Filed</h4>
                    <p className="text-lg font-semibold text-green-900">
                      {formatDate(companyData.accounts.last_accounts.made_up_to)}
                    </p>
                  </div>
                )}

                {companyData.accounts.accounting_reference_date && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Accounting Reference Date</h4>
                    <p className="text-lg font-semibold text-blue-900">
                      {formatDate(companyData.accounts.accounting_reference_date)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No account information available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Last updated: {formatDate(new Date().toISOString())}
          </div>
          <div className="flex space-x-3">
            <button className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
              Export Data
            </button>
            <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors">
              Set Alert Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;