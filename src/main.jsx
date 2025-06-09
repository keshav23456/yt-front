import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Error boundary for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // In production, you might want to log to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full text-center p-6">
            <div className="mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Go Home
              </button>
            </div>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-800 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  <div>
                    <strong>Stack Trace:</strong>
                    <pre className="whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring (optional)
function reportWebVitals(metric) {
  if (import.meta.env.DEV) {
    console.log('Web Vital:', metric);
  }
  // In production, you might want to send to analytics
  // analytics.track('Web Vital', metric);
}

// Initialize the app
function initializeApp() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

// Check for browser compatibility
function checkBrowserSupport() {
  const isSupported = 
    'fetch' in window &&
    'Promise' in window &&
    'Map' in window &&
    'Set' in window &&
    'Symbol' in window;
    
  if (!isSupported) {
    document.getElementById('root').innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: system-ui, sans-serif;
        background: #f9fafb;
        padding: 20px;
      ">
        <div style="
          max-width: 500px;
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        ">
          <h1 style="color: #111827; margin-bottom: 16px;">Browser Not Supported</h1>
          <p style="color: #6b7280; margin-bottom: 24px;">
            Your browser doesn't support some features required by VideoTube. 
            Please update your browser or use a modern browser like Chrome, Firefox, Safari, or Edge.
          </p>
          <a 
            href="https://browsehappy.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            style="
              display: inline-block;
              background: #3b82f6;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 500;
            "
          >
            Update Browser
          </a>
        </div>
      </div>
    `;
    return false;
  }
  
  return true;
}

// Service Worker registration (optional)
function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Theme detection and application
function initializeTheme() {
  // Check for saved theme preference or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Apply theme immediately to prevent flash
  document.documentElement.setAttribute('data-theme', theme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

// Viewport height fix for mobile browsers
function fixViewportHeight() {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
}

// Initialize everything
function bootstrap() {
  // Check browser support first
  if (!checkBrowserSupport()) {
    return;
  }
  
  // Initialize theme
  initializeTheme();
  
  // Fix viewport height for mobile
  fixViewportHeight();
  
  // Register service worker
  registerServiceWorker();
  
  // Initialize the React app
  initializeApp();
  
  // Report web vitals
  if (import.meta.env.DEV) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(reportWebVitals);
      getFID(reportWebVitals);
      getFCP(reportWebVitals);
      getLCP(reportWebVitals);
      getTTFB(reportWebVitals);
    }).catch(() => {
      // web-vitals not available, continue without it
    });
  }
}

// Start the application
bootstrap();
