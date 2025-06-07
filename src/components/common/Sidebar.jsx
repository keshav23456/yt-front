import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Home, 
  TrendingUp, 
  PlaySquare, 
  Clock, 
  ThumbsUp, 
  List, 
  Users, 
  Twitter,
  Settings,
  BarChart3
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', public: true },
    { icon: TrendingUp, label: 'Trending', path: '/trending', public: true },
    { icon: PlaySquare, label: 'Subscriptions', path: '/subscriptions', public: false },
    { icon: Clock, label: 'History', path: '/history', public: false },
    { icon: ThumbsUp, label: 'Liked Videos', path: '/liked', public: false },
    { icon: List, label: 'Playlists', path: '/playlists', public: false },
    { icon: Twitter, label: 'Tweets', path: '/tweets', public: false },
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard', public: false },
    { icon: Settings, label: 'Settings', path: '/settings', public: false },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
        w-64
      `}>
        <div className="p-4 h-full overflow-y-auto">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              
              if (!item.public && !isAuthenticated) {
                return null;
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive(item.path)
                      ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {!isAuthenticated && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Sign in to access more features</h3>
              <p className="text-xs text-gray-600 mb-3">
                Like videos, comment, and subscribe to channels you love.
              </p>
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;