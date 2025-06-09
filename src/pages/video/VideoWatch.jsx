import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoPlayer } from '../../components/video';
import { CommentSection, LikeButton, SubscribeButton } from '../../components/social';
import { Loading } from '../../components/common';

import { getVideoById } from '../../services';
import { useAuth } from '../../hooks';
const VideoWatch = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await getVideoById(videoId);
      if (response.success) {
        setVideo(response.data);
        if (response.data.owner) {
          setChannel(response.data.owner);
        }
      }
    } catch (err) {
      setError('Failed to load video');
      console.error('Error loading video:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Video Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The video you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="mb-6">
            <VideoPlayer video={video} />
          </div>

          {/* Video Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {video.title}
            </h1>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600">
                {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
              </div>
              
              <div className="flex items-center space-x-4">
                <LikeButton
                  targetId={video._id}
                  targetType="video"
                  initialLikes={video.likesCount}
                  initialIsLiked={video.isLiked}
                />
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                  <span>📤</span>
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                  <span>💾</span>
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Channel Info */}
            {channel && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={channel.avatar || '/assets/default-avatar.png'}
                    alt={channel.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {channel.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {channel.subscribersCount} subscribers
                    </p>
                  </div>
                </div>
                
                {user && user._id !== channel._id && (
                  <SubscribeButton
                    channelId={channel._id}
                    initialIsSubscribed={channel.isSubscribed}
                  />
                )}
              </div>
            )}

            {/* Description */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-700 whitespace-pre-wrap">
                {video.description || 'No description available.'}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection videoId={video._id} />
        </div>

        {/* Sidebar - Related Videos */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
          <div className="space-y-4">
            {/* This would be populated with related videos */}
            <div className="text-gray-500 text-center py-8">
              Related videos will be shown here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};