import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import VideoGrid from '../../components/video/VideoGrid';
import Loading from '../../components/common/Loading';

import { getWatchHistory } from '../../services';

const History = () => {
  const { user } = useSelector(state => state.auth);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getWatchHistory();
      if (response.success) {
        let filteredVideos = response.data;
        
        // Apply date filter
        if (filter !== 'all') {
          const now = new Date();
          const filterDate = new Date();
          
          switch (filter) {
            case 'today':
              filterDate.setHours(0, 0, 0, 0);
              break;
            case 'week':
              filterDate.setDate(now.getDate() - 7);
              break;
            case 'month':
              filterDate.setMonth(now.getMonth() - 1);
              break;
            default:
              break;
          }
          
          filteredVideos = response.data.filter(video => 
            new Date(video.watchedAt) >= filterDate
          );
        }
        
        setVideos(filteredVideos);
      } else {
        setError('Failed to fetch watch history');
      }
    } catch (err) {
      setError('Error loading watch history');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your entire watch history?')) {
      try {
        // Assuming there's an API endpoint to clear history
        // await clearWatchHistory();
        setVideos([]);
      } catch (err) {
        console.error('Error clearing history:', err);
      }
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading History</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchHistory}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Watch History</h1>
              <p className="text-gray-600">
                {videos.length} {videos.length === 1 ? 'video' : 'videos'} watched
              </p>
            </div>
            
            <div className="flex gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              
              {videos.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {filter === 'all' ? 'No Watch History' : `No Videos Watched ${filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'This Month'}`}
            </h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Videos you watch will appear here. Start exploring!'
                : 'Try changing the time filter or watch some videos.'
              }
            </p>
            <a
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Discover Videos
            </a>
          </div>
        ) : (
          <div>
            <VideoGrid videos={videos} showWatchedDate={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default History;