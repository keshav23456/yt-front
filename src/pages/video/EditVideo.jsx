// src/pages/video/EditVideo.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Loading } from '../../components/common';
import { videoService } from '../../services';
import { useAuth } from '../../hooks';

const EditVideo = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: null
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const response = await videoService.getVideoById(videoId);
      if (response.success) {
        const videoData = response.data;
        
        // Check if user owns this video
        if (videoData.owner._id !== user?._id) {
          navigate('/');
          return;
        }
        
        setVideo(videoData);
        setFormData({
          title: videoData.title,
          description: videoData.description || '',
          thumbnail: null
        });
      }
    } catch (err) {
      setError('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    setUpdating(true);
    setError('');

    try {
      const updateData = new FormData();
      updateData.append('title', formData.title);
      updateData.append('description', formData.description);
      if (formData.thumbnail) {
        updateData.append('thumbnail', formData.thumbnail);
      }

      const response = await videoService.updateVideo(videoId, updateData);
      if (response.success) {
        navigate(`/video/${videoId}`);
      }
    } catch (err) {
      setError(err.message || 'Update failed. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      try {
        await videoService.deleteVideo(videoId);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete video');
      }
    }
  };

  const togglePublish = async () => {
    try {
      const response = await videoService.togglePublishStatus(videoId);
      if (response.success) {
        setVideo({ ...video, isPublished: !video.isPublished });
      }
    } catch (err) {
      setError('Failed to update publish status');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Video Not Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Video</h1>
        <div className="flex space-x-4">
          <button
            onClick={togglePublish}
            className={`px-4 py-2 rounded-lg transition ${
              video.isPublished
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {video.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete Video
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Current Video</h3>
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              src={video.videoFile}
              poster={video.thumbnail}
              controls
              className="w-full h-auto"
            />
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Status: <span className={`font-semibold ${video.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                {video.isPublished ? 'Published' : 'Draft'}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Views: {video.views || 0}
            </p>
            <p className="text-sm text-gray-600">
              Created: {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter video title"
                required
                maxLength="100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell viewers about your video"
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                maxLength="5000"
              />
            </div>

            {/* New Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Thumbnail (Optional)
              </label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {video.thumbnail && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Current thumbnail:</p>
                  <img
                    src={video.thumbnail}
                    alt="Current thumbnail"
                    className="w-32 h-20 object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/video/${videoId}`)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                disabled={updating}
              >
                Cancel
              </button>
              <Button
                type="submit"
                loading={updating}
                disabled={updating}
              >
                Update Video
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditVideo;