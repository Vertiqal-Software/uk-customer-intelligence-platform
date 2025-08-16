import React from 'react';

// 404 Not Found Page
export const NotFoundPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleGoBack}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={handleGoToDashboard}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <a href="/help" className="text-blue-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// 500 Server Error Page
export const ServerErrorPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-red-600 mb-4">500</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Server Error</h1>
          <p className="text-gray-600 mb-8">
            Oops! Something went wrong on our end. We're working to fix this issue. 
            Please try again in a few moments.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleGoToDashboard}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Error persisting? <a href="/help" className="text-red-600 hover:underline">Report this issue</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// 403 Forbidden Page
export const ForbiddenPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m8-9V6a4 4 0 00-8 0v3h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this resource. 
            Contact your administrator if you believe this is a mistake.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleGoBack}
            className="w-full px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={handleGoToDashboard}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need access? <a href="/help" className="text-yellow-600 hover:underline">Request Permission</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Network Error Page
export const NetworkErrorPage = ({ onRetry }) => {
  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Problem</h1>
          <p className="text-gray-600 mb-8">
            We're having trouble connecting to our servers. 
            Please check your internet connection and try again.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={onRetry || (() => window.location.reload())}
            className="w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleGoToDashboard}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-500 space-y-2">
            <p>Check your internet connection</p>
            <p>Try refreshing the page</p>
            <p>
              Still having issues? <a href="/help" className="text-gray-600 hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Maintenance Mode Page
export const MaintenancePage = ({ estimatedTime }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Under Maintenance</h1>
          <p className="text-gray-600 mb-8">
            We're currently performing scheduled maintenance to improve your experience. 
            We'll be back online shortly.
          </p>
        </div>
        
        {estimatedTime && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Estimated completion:</span> {estimatedTime}
            </p>
          </div>
        )}
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-500 space-y-2">
            <p>Thank you for your patience</p>
            <p>
              Updates: <a href="/status" className="text-blue-600 hover:underline">System Status</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generic Error Boundary Component
export const ErrorBoundary = ({ children, fallback: Fallback = ServerErrorPage }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error('Error Boundary caught an error:', error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <Fallback />;
  }

  return children;
};

// Main Error Pages Component for Demo
const ErrorPages = () => {
  const [currentPage, setCurrentPage] = React.useState('404');

  const pages = {
    '404': <NotFoundPage />,
    '500': <ServerErrorPage />,
    '403': <ForbiddenPage />,
    'network': <NetworkErrorPage />,
    'maintenance': <MaintenancePage estimatedTime="2 hours" />
  };

  return (
    <div>
      {/* Demo Navigation */}
      <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-medium text-gray-800 mb-2">Error Pages Demo</h3>
        <div className="space-y-2">
          {Object.keys(pages).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`block w-full text-left px-3 py-1 rounded text-sm ${
                currentPage === page 
                ? 'bg-blue-100 text-blue-800' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Current Page */}
      {pages[currentPage]}
    </div>
  );
};

export default ErrorPages;