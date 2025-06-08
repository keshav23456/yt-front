import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VideoGrid from '../../components/video/VideoGrid';
import Loading from '../../components/common/Loading';
import { getLikedVideos } from '../../services/like.service';

const LikedVideos = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      setLoading(true);
      const response = await getLikedVideos();
      if (response.success) {
        setVideos(response.data);
      } else {
        setError('Failed to fetch liked videos');
      }
    } catch (err) {
      setError('Error loading liked videos');
      console.error('Error fetching liked videos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Liked Videos</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchLikedVideos}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Liked Videos</h1>
          <p className="text-gray-600">
            {videos.length} {videos.length === 1 ? 'video' : 'videos'} you've liked
          </p>
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
          <VideoGrid videos={videos} />
        )}
      </div>
    </div>
  );
};

export default LikedVideos;