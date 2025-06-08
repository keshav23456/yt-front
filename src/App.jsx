import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';

// Store
import { store, persistor } from './store';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout Components
import { Header, Sidebar } from './components/common';
import { ProtectedRoute } from './components/auth';

// Page Components
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Auth Pages
import { Login, Signup } from './pages/auth';

// User Pages
import { Channel, Dashboard, Profile, Settings } from './pages/user';

// Video Pages
import { VideoWatch, Upload, EditVideo } from './pages/video';

// Content Pages
import { LikedVideos, History, Playlists, Subscriptions, Tweets } from './pages/content';

// Styles
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={<AppLoading />} persistor={persistor}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="App">
                <AppContent 
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                  closeSidebar={closeSidebar}
                  isMobile={isMobile}
                />
                
                {/* Toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--surface-color)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                    },
                    success: {
                      iconTheme: {
                        primary: 'var(--success-color)',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: 'var(--error-color)',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

// App Content Component
function AppContent({ sidebarOpen, toggleSidebar, closeSidebar, isMobile }) {
  return (
    <div className="app-layout">
      {/* Header */}
      <Header onToggleSidebar={toggleSidebar} />
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
      />
      
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Main content */}
      <main className={`app-main ${!isMobile ? 'with-sidebar' : ''}`}>
        <div className="app-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/search" element={<SearchPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Video Routes */}
            <Route path="/watch/:videoId" element={<VideoWatch />} />
            <Route path="/video/:videoId" element={<VideoWatch />} />
            
            {/* Channel Routes */}
            <Route path="/channel/:username" element={<Channel />} />
            <Route path="/c/:username" element={<Channel />} />
            
            {/* Protected Routes */}
            <Route path="/upload" element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } />
            
            <Route path="/video/edit/:videoId" element={
              <ProtectedRoute>
                <EditVideo />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            <Route path="/liked-videos" element={
              <ProtectedRoute>
                <LikedVideos />
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            
            <Route path="/playlists" element={
              <ProtectedRoute>
                <Playlists />
              </ProtectedRoute>
            } />
            
            <Route path="/playlist/:playlistId" element={
              <ProtectedRoute>
                <PlaylistPage />
              </ProtectedRoute>
            } />
            
            <Route path="/subscriptions" element={
              <ProtectedRoute>
                <Subscriptions />
              </ProtectedRoute>
            } />
            
            <Route path="/tweets" element={
              <ProtectedRoute>
                <Tweets />
              </ProtectedRoute>
            } />
            
            {/* Redirects */}
            <Route path="/auth/login" element={<Navigate to="/login\" replace />} />
            <Route path="/auth/signup" element={<Navigate to="/signup\" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// Loading Component
function AppLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading VideoTube...</p>
      </div>
    </div>
  );
}

// Placeholder Components for missing pages
function TrendingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trending Videos</h1>
      <div className="text-center py-12">
        <p className="text-gray-500">Trending videos will be displayed here.</p>
      </div>
    </div>
  );
}

function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      <div className="text-center py-12">
        <p className="text-gray-500">Search results will be displayed here.</p>
      </div>
    </div>
  );
}

function PlaylistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Playlist</h1>
      <div className="text-center py-12">
        <p className="text-gray-500">Playlist content will be displayed here.</p>
      </div>
    </div>
  );
}

export default App;