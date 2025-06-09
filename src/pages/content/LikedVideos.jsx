import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import VideoGrid from '../../components/video/VideoGrid';
import Loading from '../../components/common/Loading';
import { getLikedVideos } from '../../services';
const LikedVideos = () => {
  const { user } = useSelector(state => state.auth);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLikedVideos = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await getLikedVideos();
      if (response.success) {
        setVideos(response.data);
      } else {
        setError(response.message || 'Failed to fetch liked videos');
      }
    } catch (err) {
      setError('Error loading liked videos');
      console.error('Error fetching liked videos:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchLikedVideos();
    }
  }, [user, fetchLikedVideos]);

  const handleRefresh = () => {
    fetchLikedVideos(true);
  };

  const handleVideoUpdate = (updatedVideo) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === updatedVideo.id ? updatedVideo : video
      )
    );
  };

  const handleVideoRemove = (videoId) => {
    setVideos(prevVideos => 
      prevVideos.filter(video => video.id !== videoId)
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to view your liked videos.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !refreshing) return <Loading />;

  if (error && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Liked Videos</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => fetchLikedVideos()}
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Liked Videos</h1>
            <p className="text-gray-600">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} you've liked
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {refreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Liked Videos Yet</h2>
            <p className="text-gray-600 mb-6">
              Videos you like will appear here. Start exploring and like videos you enjoy!
            </p>
            <a
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Discover Videos
            </a>
          </div>
        ) : (
          <VideoGrid 
            videos={videos} 
            onVideoUpdate={handleVideoUpdate}
            onVideoRemove={handleVideoRemove}
          />
        )}
      </div>
    </div>
  );
};

export default LikedVideos;