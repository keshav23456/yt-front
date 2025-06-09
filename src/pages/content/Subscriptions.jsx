import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../../components/common/Loading';

import { getSubscribedChannels } from '../../services';
import { getChannelVideos } from '../../services';

const Subscriptions = () => {
  const { user } = useSelector(state => state.auth);
  const [channels, setChannels] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('channels'); // channels, videos

  useEffect(() => {
    if (user?.id) {
      fetchSubscriptions();
    }
  }, [user?.id]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const channelsResponse = await getSubscribedChannels(user.id);
      
      if (channelsResponse.success) {
        setChannels(channelsResponse.data);
        
        // Fetch recent videos from subscribed channels
        if (channelsResponse.data.length > 0) {
          const videosPromises = channelsResponse.data.map(channel =>
            getUserVideos(channel._id).catch(() => ({ data: [] }))
          );
          
          const videosResponses = await Promise.all(videosPromises);
          const allVideos = videosResponses
            .flatMap(response => response.data || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 20); // Get latest 20 videos
          
          setRecentVideos(allVideos);
        }
      } else {
        setError('Failed to fetch subscriptions');
      }
    } catch (err) {
      setError('Error loading subscriptions');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (channelId) => {
    try {
      // Assuming toggleSubscription API
      // await toggleSubscription(channelId);
      setChannels(prevChannels =>
        prevChannels.filter(channel => channel._id !== channelId)
      );
    } catch (err) {
      console.error('Error unsubscribing:', err);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Subscriptions</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchSubscriptions}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscriptions</h1>
          
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('channels')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'channels'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Channels ({channels.length})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recent Videos ({recentVideos.length})
            </button>
          </div>
        </div>

        {activeTab === 'channels' && (
          <div>
            {channels.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📺</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Subscriptions Yet</h2>
                <p className="text-gray-600 mb-6">
                  Follow channels you love to see their latest content here.
                </p>
                <a
                  href="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Discover Channels
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {channels.map(channel => (
                  <div key={channel._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={channel.avatar || '/assets/default-avatar.png'}
                        alt={channel.fullName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {channel.fullName}
                        </h3>
                        <p className="text-gray-600">@{channel.username}</p>
                        <p className="text-sm text-gray-500">
                          {channel.subscribersCount || 0} subscribers
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <a
                        href={`/channel/${channel.username}`}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center"
                      >
                        View Channel
                      </a>
                      <button
                        onClick={() => handleUnsubscribe(channel._id)}
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Unsubscribe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            {recentVideos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎬</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Recent Videos</h2>
                <p className="text-gray-600 mb-6">
                  {channels.length === 0
                    ? 'Subscribe to channels to see their latest videos here.'
                    : 'Your subscribed channels haven\'t posted any videos recently.'
                  }
                </p>
                {channels.length === 0 && (
                  <a
                    href="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                  >
                    Discover Channels
                  </a>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentVideos.map(video => (
                  <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {video.owner?.fullName}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{video.views || 0} views</span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;