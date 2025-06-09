import React, { useEffect, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'

// Contexts
import { useAuth } from './contexts/AuthContext.jsx'
import { useTheme } from './contexts/ThemeContext.jsx'


// Components
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Loading from './components/common/Loading'

// Pages - Lazy loaded for better performance
const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import('./pages/auth/Login'))
const Signup = React.lazy(() => import('./pages/auth/Signup'))
const VideoWatch = React.lazy(() => import('./pages/video/VideoWatch'))
const Upload = React.lazy(() => import('./pages/video/Upload'))
const EditVideo = React.lazy(() => import('./pages/video/EditVideo'))
const Channel = React.lazy(() => import('./pages/user/Channel'))
const Dashboard = React.lazy(() => import('./pages/user/Dashboard'))
const Profile = React.lazy(() => import('./pages/user/Profile'))
const Settings = React.lazy(() => import('./pages/user/Settings'))
const LikedVideos = React.lazy(() => import('./pages/content/LikedVideos'))
const History = React.lazy(() => import('./pages/content/History'))
const Playlists = React.lazy(() => import('./pages/content/Playlists'))
const Subscriptions = React.lazy(() => import('./pages/content/Subscriptions'))
const Tweets = React.lazy(() => import('./pages/content/Tweets'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

// Redux actions
import { getCurrentUser } from './store/slices/authSlice'
import { checkHealthStatus } from './store/slices/uiSlice'

import './App.css'

function App() {
  const dispatch = useDispatch()
  const { theme } = useTheme()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { isInitialized } = useSelector((state) => state.ui)

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check API health
        await dispatch(checkHealthStatus()).unwrap()
        
        // Get current user if token exists
        const token = localStorage.getItem('accessToken') || document.cookie.includes('accessToken')
        if (token && !isAuthenticated) {
          await dispatch(getCurrentUser()).unwrap()
        }
      } catch (error) {
        console.error('App initialization error:', error)
        // Handle initialization errors
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    }

    initializeApp()
  }, [dispatch, isAuthenticated])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Show loading screen while app initializes
  if (authLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Initializing application...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route index element={<Navigate to="/auth/login" replace />} />
          </Route>

          {/* Protected Routes */}
          <Route path="/" element={<Layout />}>
            {/* Home/Public Video Routes */}
            <Route index element={<Home />} />
            <Route path="watch/:videoId" element={<VideoWatch />} />
            <Route path="c/:username" element={<Channel />} />

            {/* User Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Video Management */}
              <Route path="upload" element={<Upload />} />
              <Route path="video/edit/:videoId" element={<EditVideo />} />

              {/* User Dashboard & Profile */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />

              {/* Content Pages */}
              <Route path="liked" element={<LikedVideos />} />
              <Route path="history" element={<History />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="tweets" element={<Tweets />} />
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#f9fafb' : '#1f2937',
            border: theme === 'dark' ? '1px solid #4b5563' : '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  )
}

export default App