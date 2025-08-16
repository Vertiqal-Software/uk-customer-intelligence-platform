import React, { useState, useEffect } from 'react';

const DataImportExport = () => {
  const [activeTab, setActiveTab] = useState('import');
  const [loading, setLoading] = useState(false);
  const [importHistory, setImportHistory] = useState([]);
  const [exportHistory, setExportHistory] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mappingConfig, setMappingConfig] = useState({});
  const [showMappingModal, setShowMappingModal] = useState(false);

  useEffect(() => {
    loadImportHistory();
    loadExportHistory();
  }, []);

  const loadImportHistory = async () => {
    try {
      // Mock import history
      const mockHistory = [
        {
          id: 'imp_001',
          filename: 'companies_q4_2024.csv',
          type: 'companies',
          status: 'completed',
          records_imported: 1245,
          records_failed: 12,
          started_at: '2025-01-15T09:30:00Z',
          completed_at: '2025-01-15T09:45:00Z',
          file_size: '2.3 MB',
          user: 'John Smith'
        },
        {
          id: 'imp_002',
          filename: 'contacts_export.xlsx',
          type: 'contacts',
          status: 'completed',
          records_imported: 856,
          records_failed: 3,
          started_at: '2025-01-14T14:20:00Z',
          completed_at: '2025-01-14T14:32:00Z',
          file_size: '1.8 MB',
          user: 'Sarah Johnson'
        },
        {
          id: 'imp_003',
          filename: 'tender_data.csv',
          type: 'tenders',
          status: 'failed',
          records_imported: 0,
          records_failed: 234,
          started_at: '2025-01-13T11:15:00Z',
          completed_at: '2025-01-13T11:16:00Z',
          file_size: '945 KB',
          user: 'Mike Brown',
          error_message: 'Invalid column format in row 5'
        }
      ];
      setImportHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load import history:', error);
    }
  };

  const loadExportHistory = async () => {
    try {
      // Mock export history
      const mockHistory = [
        {
          id: 'exp_001',
          filename: 'all_companies_2025-01-15.csv',
          type: 'companies',
          status: 'completed',
          records_exported: 2847,
          started_at: '2025-01-15T08:00:00Z',
          completed_at: '2025-01-15T08:05:00Z',
          file_size: '4.2 MB',
          download_url: '/exports/all_companies_2025-01-15.csv',
          expires_at: '2025-02-15T08:05:00Z'
        },
        {
          id: 'exp_002',
          filename: 'active_tenders_report.xlsx',
          type: 'tenders',
          status: 'completed',
          records_exported: 145,
          started_at: '2025-01-14T16:30:00Z',
          completed_at: '2025-01-14T16:32:00Z',
          file_size: '1.1 MB',
          download_url: '/exports/active_tenders_report.xlsx',
          expires_at: '2025-02-14T16:32:00Z'
        },
        {
          id: 'exp_003',
          filename: 'contact_list_filtered.csv',
          type: 'contacts',
          status: 'processing',
          records_exported: 0,
          started_at: '2025-01-15T10:00:00Z',
          file_size: null
        }
      ];
      setExportHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load export history:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      validateFile(file);
    }
  };

  const validateFile = async (file) => {
    setLoading(true);
    try {
      // Mock file validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockValidation = {
        valid: true,
        total_rows: 1250,
        columns_detected: ['Company Name', 'Company Number', 'Address', 'Industry', 'Phone', 'Email'],
        sample_data: [
          {
            'Company Name': 'TechFlow Solutions Ltd',
            'Company Number': '08123456',
            'Address': 'Innovation Hub, London',
            'Industry': 'Technology',
            'Phone': '+44 20 1234 5678',
            'Email': 'info@techflow.co.uk'
          },
          {
            'Company Name': 'Digital Health Partners',
            'Company Number': '09876543',
            'Address': 'Health Centre, Manchester',
            'Industry': 'Healthcare',
            'Phone': '+44 161 987 6543',
            'Email': 'contact@digitalhealth.co.uk'
          }
        ],
        warnings: [
          'Column "Phone" has 12 missing values',
          'Some email addresses may be invalid'
        ],
        suggested_mapping: {
          'Company Name': 'name',
          'Company Number': 'company_number',
          'Address': 'address',
          'Industry': 'industry',
          'Phone': 'phone',
          'Email': 'email'
        }
      };
      
      setValidationResults(mockValidation);
      setMappingConfig(mockValidation.suggested_mapping);
    } catch (error) {
      console.error('File validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !validationResults) return;
    
    setLoading(true);
    setUploadProgress(0);
    
    try {
      // Mock upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }
      
      // Add to import history
      const newImport = {
        id: `imp_${Date.now()}`,
        filename: selectedFile.name,
        type: 'companies',
        status: 'completed',
        records_imported: validationResults.total_rows - 15,
        records_failed: 15,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        file_size: `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`,
        user: 'Current User'
      };
      
      setImportHistory(prev => [newImport, ...prev]);
      setSelectedFile(null);
      setValidationResults(null);
      setUploadProgress(0);
      
      alert('Import completed successfully!');
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (exportType, format = 'csv') => {
    setLoading(true);
    
    try {
      // Mock export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newExport = {
        id: `exp_${Date.now()}`,
        filename: `${exportType}_export_${new Date().toISOString().split('T')[0]}.${format}`,
        type: exportType,
        status: 'completed',
        records_exported: Math.floor(Math.random() * 1000) + 500,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        file_size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        download_url: `/exports/${exportType}_export.${format}`,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      setExportHistory(prev => [newExport, ...prev]);
      alert('Export completed! Check the export history to download.');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExport = (exportItem) => {
    // Mock download
    console.log('Downloading:', exportItem.filename);
    alert(`Downloading ${exportItem.filename}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const importTemplates = [
    {
      name: 'Companies',
      description: 'Import company data with standard fields',
      filename: 'companies_template.csv',
      columns: ['Company Name', 'Company Number', 'Address', 'Industry', 'Phone', 'Email', 'Website']
    },
    {
      name: 'Contacts',
      description: 'Import contact information and details',
      filename: 'contacts_template.csv',
      columns: ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Job Title', 'Department']
    },
    {
      name: 'Tenders',
      description: 'Import tender opportunities',
      filename: 'tenders_template.csv',
      columns: ['Title', 'Description', 'Value', 'Deadline', 'Buyer', 'Location', 'CPV Codes']
    }
  ];

  const tabs = [
    { id: 'import', name: 'Import Data', icon: '📥' },
    { id: 'export', name: 'Export Data', icon: '📤' },
    { id: 'templates', name: 'Templates', icon: '📋' },
    { id: 'scheduled', name: 'Scheduled Exports', icon: '⏰' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Import/Export</h1>
              <p className="text-sm text-gray-600">Manage your data imports and exports</p>
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
        {activeTab === 'import' && (
          <div className="space-y-8">
            {/* File Upload */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Import Data</h3>
              
              {!selectedFile ? (
                <div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                    <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Upload your data file</h4>
                    <p className="text-gray-600 mb-4">CSV, Excel, or JSON files up to 10MB</p>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls,.json"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Supported Formats</h5>
                      <p className="text-sm text-gray-600">CSV, Excel (.xlsx, .xls), JSON</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">File Size Limit</h5>
                      <p className="text-sm text-gray-600">Up to 10MB per file</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Data Validation</h5>
                      <p className="text-sm text-gray-600">Automatic validation and mapping</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* File Info */}
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">{selectedFile.name}</h4>
                        <p className="text-sm text-blue-700">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setValidationResults(null);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Validation Results */}
                  {validationResults && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-green-900">Total Rows</h5>
                          <p className="text-2xl font-bold text-green-700">{validationResults.total_rows}</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-900">Columns</h5>
                          <p className="text-2xl font-bold text-blue-700">{validationResults.columns_detected.length}</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <h5 className="font-medium text-yellow-900">Warnings</h5>
                          <p className="text-2xl font-bold text-yellow-700">{validationResults.warnings.length}</p>
                        </div>
                      </div>

                      {/* Warnings */}
                      {validationResults.warnings.length > 0 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h5 className="font-medium text-yellow-800 mb-2">Warnings</h5>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            {validationResults.warnings.map((warning, index) => (
                              <li key={index}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Sample Data Preview */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Data Preview</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                {validationResults.columns_detected.map((column, index) => (
                                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {column}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {validationResults.sample_data.map((row, index) => (
                                <tr key={index}>
                                  {validationResults.columns_detected.map((column, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {row[column]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Import Button */}
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => setShowMappingModal(true)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Configure Mapping
                        </button>
                        
                        <div className="flex space-x-3">
                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{uploadProgress}%</span>
                            </div>
                          )}
                          
                          <button
                            onClick={handleImport}
                            disabled={loading || !validationResults.valid}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? 'Importing...' : 'Import Data'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {loading && !validationResults && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Validating file...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Import History */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Import History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {importHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.filename}</div>
                            <div className="text-sm text-gray-500">{item.file_size}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {item.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>✅ {item.records_imported}</div>
                          {item.records_failed > 0 && <div>❌ {item.records_failed}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(item.started_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            View Details
                          </button>
                          {item.status === 'failed' && (
                            <button className="text-green-600 hover:text-green-900">
                              Retry
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-8">
            {/* Export Options */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Export Data</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Companies</h4>
                  <p className="text-sm text-gray-600 mb-4">Export all company records and associated data</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleExport('companies', 'csv')}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('companies', 'xlsx')}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50"
                    >
                      Export as Excel
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Contacts</h4>
                  <p className="text-sm text-gray-600 mb-4">Export contact information and relationships</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleExport('contacts', 'csv')}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('contacts', 'xlsx')}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 disabled:opacity-50"
                    >
                      Export as Excel
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Tenders</h4>
                  <p className="text-sm text-gray-600 mb-4">Export tender opportunities and status</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleExport('tenders', 'csv')}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('tenders', 'xlsx')}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50 disabled:opacity-50"
                    >
                      Export as Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Export History */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Export History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {exportHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.filename}</div>
                            {item.file_size && <div className="text-sm text-gray-500">{item.file_size}</div>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {item.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.records_exported > 0 ? item.records_exported.toLocaleString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(item.started_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.expires_at ? formatDate(item.expires_at) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {item.status === 'completed' && item.download_url && (
                            <button
                              onClick={() => downloadExport(item)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Download
                            </button>
                          )}
                          <button className="text-gray-600 hover:text-gray-900">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Import Templates</h3>
              <p className="text-gray-600 mb-6">
                Download these templates to ensure your data is formatted correctly for import.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {importTemplates.map((template, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-3">{template.name} Template</h4>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Required Columns:</h5>
                      <div className="flex flex-wrap gap-1">
                        {template.columns.map((column, colIndex) => (
                          <span key={colIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {column}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        console.log('Downloading template:', template.filename);
                        alert(`Downloading ${template.filename}`);
                      }}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Download Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Scheduled Exports</h3>
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Scheduled export functionality coming soon</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Request Feature
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DataImportExport;