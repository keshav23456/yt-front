import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header, Sidebar } from '../common';
import { useAuth } from '../../hooks/useAuth';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Check if current route should have sidebar
  const shouldShowSidebar = user && !location.pathname.startsWith('/auth');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header 
        onToggleSidebar={toggleSidebar}
        onToggleSidebarCollapse={toggleSidebarCollapse}
        isSidebarCollapsed={isSidebarCollapsed}
        showSidebarToggle={shouldShowSidebar}
      />

      <div className="flex">
        {/* Sidebar */}
        {shouldShowSidebar && (
          <>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                onClick={closeSidebar}
              />
            )}
            
            {/* Sidebar */}
            <Sidebar 
              isOpen={isSidebarOpen}
              isCollapsed={isSidebarCollapsed}
              onClose={closeSidebar}
            />
          </>
        )}

        {/* Main Content */}
        <main 
          className={`
            flex-1 transition-all duration-300 ease-in-out
            ${shouldShowSidebar ? (
              isSidebarCollapsed 
                ? 'lg:ml-16' 
                : 'lg:ml-64'
            ) : ''}
            pt-16
          `}
        >
          <div className="min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className={`
        bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700
        ${shouldShowSidebar ? (
          isSidebarCollapsed 
            ? 'lg:ml-16' 
            : 'lg:ml-64'
        ) : ''}
        transition-all duration-300 ease-in-out
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Video Platform
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Share your creativity with the world. Upload, watch, and connect with creators everywhere.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Creators</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Support
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              © 2024 Video Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;