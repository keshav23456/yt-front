import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AuthLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  // If user is already authenticated, redirect to home
  React.useEffect(() => {
    if (user) {
      // This would typically be handled by protected routes
      // but we can add a notification here
      console.log('User already authenticated');
    }
  }, [user]);

  const isLoginPage = location.pathname === '/auth/login';
  const isSignupPage = location.pathname === '/auth/signup';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Video Platform
              </span>
            </Link>

            {/* Auth Toggle */}
            <div className="flex items-center space-x-4">
              {!user && (
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
                  <Link
                    to="/auth/login"
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isLoginPage
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isSignupPage
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              {/* Theme Toggle */}
              <button
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => {
                  // Theme toggle logic would go here
                  console.log('Toggle theme');
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Auth Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              {/* Welcome Message */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {isLoginPage ? 'Welcome Back!' : 'Join Video Platform'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {isLoginPage 
                    ? 'Sign in to your account to continue' 
                    : 'Create your account to start sharing'
                  }
                </p>
              </div>

              {/* Auth Form */}
              <Outlet />

              {/* Additional Links */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isLoginPage ? "Don't have an account? " : "Already have an account? "}
                  <Link
                    to={isLoginPage ? '/auth/signup' : '/auth/login'}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                  >
                    {isLoginPage ? 'Sign up' : 'Sign in'}
                  </Link>
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Upload Videos</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Share your content with the world</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Connect</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Follow creators and build community</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Discover</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Find amazing content creators</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;