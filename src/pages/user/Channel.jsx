import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { VideoGrid, VideoCard } from '../../components/video';
import { SubscribeButton } from '../../components/social';
import { Button, Loading } from '../../components/common';
import { getUserChannelService,getChannelVideosService } from '../../services';
import { getChannelStats } from '../../services';


import { formatNumber, formatDate } from '../../utils/formatters';

const Channel = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector(state => state.auth);
  
  const [channelData, setChannelData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChannelData();
  }, [username]);

  const loadChannelData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load channel profile
      const channelResponse = await getUserChannelService(username);
      if (channelResponse.success) {
        setChannelData(channelResponse.data);
        
        // Load channel videos
        const videosResponse = await getChannelVideosService(channelResponse.data._id);
        if (videosResponse.success) {
         
          setVideos(videosResponse.data.videos || []);
        }

        // Load channel stats if it's the current user's channel
        if (currentUser && currentUser.username === username) {
          const statsResponse = await getChannelStats();
          if (statsResponse.success) {
            setStats(statsResponse.data);
          }
        }
      } else {
        setError('Channel not found');
      }
    } catch (err) {
      console.error('Error loading channel:', err);
      setError('Failed to load channel');
    } finally {
      setLoading(false);
    }
  };

  const isOwnChannel = currentUser && channelData && currentUser._id === channelData._id;

  const handleEditChannel = () => {
    navigate('/settings');
  };

  const handleUploadVideo = () => {
    navigate('/upload');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Channel Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  if (!channelData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Channel Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Cover Image */}
          {channelData.coverImage && (
            <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6">
              <img
                src={channelData.coverImage}
                alt="Channel Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Channel Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src={channelData.avatar || '/assets/default-avatar.png'}
                alt={channelData.fullName}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {channelData.fullName}
              </h1>
              <p className="text-gray-600 mb-2">@{channelData.username}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <span>{formatNumber(channelData.subscribersCount || 0)} subscribers</span>
                <span>{formatNumber(videos.length)} videos</span>
                <span>Joined {formatDate(channelData.createdAt)}</span>
              </div>

              {channelData.description && (
                <p className="text-gray-700 mb-4 max-w-2xl">
                  {channelData.description}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              {isOwnChannel ? (
                <>
                  <Button onClick={handleEditChannel} variant="outline">
                    Edit Channel
                  </Button>
                  <Button onClick={handleUploadVideo}>
                    Upload Video
                  </Button>
                </>
              ) : (
                <SubscribeButton channelId={channelData._id} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Channel Stats (Only for own channel) */}
      {isOwnChannel && stats && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(stats.totalViews || 0)}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(stats.totalVideos || 0)}
                </div>
                <div className="text-sm text-gray-600">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatNumber(stats.totalSubscribers || 0)}
                </div>
                <div className="text-sm text-gray-600">Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(stats.totalLikes || 0)}
                </div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Channel Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'videos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Videos ({videos.length})
            </button>
            <button
              onClick={() => setActiveTab('playlists')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'playlists'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Playlists
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'videos' && (
          <div>
            {videos.length > 0 ? (
              <VideoGrid videos={videos} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No videos yet</h3>
                <p className="text-gray-500">
                  {isOwnChannel ? 'Upload your first video!' : 'This channel has no videos yet.'}
                </p>
                {isOwnChannel && (
                  <Button onClick={handleUploadVideo} className="mt-4">
                    Upload Video
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No playlists yet</h3>
            <p className="text-gray-500">
              {isOwnChannel ? 'Create your first playlist!' : 'This channel has no playlists yet.'}
            </p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              
              {channelData.description ? (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{channelData.description}</p>
                </div>
              ) : (
                <p className="text-gray-500 mb-6">No description available.</p>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Joined:</span>
                  <span className="text-gray-900">{formatDate(channelData.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total videos:</span>
                  <span className="text-gray-900">{formatNumber(videos.length)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscribers:</span>
                  <span className="text-gray-900">{formatNumber(channelData.subscribersCount || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;