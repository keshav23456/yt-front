import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VideoGrid, Loading } from '../components/common';
import { videoService } from '../services';
import { useAuth } from '../hooks';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await videoService.getAllVideos();
      if (response.success) {
        setVideos(response.data.videos || response.data);
      }
    } catch (err) {
      setError('Failed to load videos');
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to VideoHub
          </h1>
          <p className="text-xl mb-8">
            Discover, share, and enjoy amazing videos from creators worldwide
          </p>
          {!user && (
            <div className="space-x-4">
              <Link
                to="/auth/signup"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <Link
                to="/auth/login"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Featured Videos */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {user ? 'Recommended for You' : 'Featured Videos'}
            </h2>
            {user && (
              <Link
                to="/upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Upload Video
              </Link>
            )}
          </div>

          {videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No videos available at the moment.</p>
              {user && (
                <Link
                  to="/upload"
                  className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Upload First Video
                </Link>
              )}
            </div>
          )}
        </section>

        {/* Categories or Trending Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Gaming', icon: '🎮', color: 'bg-red-500' },
              { name: 'Music', icon: '🎵', color: 'bg-purple-500' },
              { name: 'Education', icon: '📚', color: 'bg-green-500' },
              { name: 'Technology', icon: '💻', color: 'bg-blue-500' },
              { name: 'Entertainment', icon: '🎬', color: 'bg-yellow-500' },
              { name: 'Sports', icon: '⚽', color: 'bg-orange-500' },
              { name: 'News', icon: '📰', color: 'bg-gray-500' },
              { name: 'Lifestyle', icon: '✨', color: 'bg-pink-500' }
            ].map((category) => (
              <div
                key={category.name}
                className={`${category.color} text-white p-6 rounded-lg text-center hover:opacity-90 transition cursor-pointer`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;