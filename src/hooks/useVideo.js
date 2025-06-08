import { useState, useEffect, useCallback } from 'react';
import { videoService } from '../services';
import { useApi } from './useApi';

// Custom hook for video-related operations
export const useVideo = (videoId = null) => {
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { makeRequest, loading, error } = useApi();

  // Fetch single video
  const fetchVideo = useCallback(async (id = videoId) => {
    if (!id) return;

    return makeRequest(
      () => videoService.getVideoById(id),
      {
        onSuccess: (data) => setVideo(data)
      }
    );
  }, [videoId, makeRequest]);

  // Fetch all videos with filters
  const fetchVideos = useCallback(async (filters = {}) => {
    return makeRequest(
      () => videoService.getAllVideos(filters),
      {
        onSuccess: (data) => setVideos(data.videos || data)
      }
    );
  }, [makeRequest]);

  // Upload video with progress tracking
  const uploadVideo = useCallback(async (videoData, onProgress) => {
    try {
      setUploadProgress(0);
      
      const response = await videoService.uploadVideo(videoData, (progress) => {
        setUploadProgress(progress);
        onProgress?.(progress);
      });

      if (response.success) {
        setUploadProgress(100);
        // Add to videos list if it exists
        setVideos(prev => [response.data, ...prev]);
        return { success: true, data: response.data };
      }
      
      return { success: false, error: response.message };
    } catch (error) {
      setUploadProgress(0);
      return { success: false, error: error.message };
    }
  }, []);

  // Update video
  const updateVideo = useCallback(async (id, updateData) => {
    return makeRequest(
      () => videoService.updateVideo(id, updateData),
      {
        onSuccess: (data) => {
          setVideo(data);
          // Update in videos list if it exists
          setVideos(prev => prev.map(v => v._id === id ? data : v));
        }
      }
    );
  }, [makeRequest]);

  // Delete video
  const deleteVideo = useCallback(async (id) => {
    return makeRequest(
      () => videoService.deleteVideo(id),
      {
        onSuccess: () => {
          // Remove from videos list
          setVideos(prev => prev.filter(v => v._id !== id));
          // Clear video if it's the current one
          if (video?._id === id) {
            setVideo(null);
          }
        }
      }
    );
  }, [makeRequest, video]);

  // Toggle publish status
  const togglePublishStatus = useCallback(async (id) => {
    return makeRequest(
      () => videoService.togglePublishStatus(id),
      {
        onSuccess: (data) => {
          setVideo(data);
          // Update in videos list
          setVideos(prev => prev.map(v => v._id === id ? data : v));
        }
      }
    );
  }, [makeRequest]);

  // Like/unlike video
  const toggleLike = useCallback(async (id) => {
    return makeRequest(
      () => videoService.toggleLike(id),
      {
        onSuccess: (data) => {
          // Update video like status
          if (video?._id === id) {
            setVideo(prev => ({
              ...prev,
              isLiked: data.isLiked,
              likesCount: data.likesCount
            }));
          }
          
          // Update in videos list
          setVideos(prev => prev.map(v => 
            v._id === id 
              ? { ...v, isLiked: data.isLiked, likesCount: data.likesCount }
              : v
          ));
        }
      }
    );
  }, [makeRequest, video]);

  // Auto-fetch video on videoId change
  useEffect(() => {
    if (videoId) {
      fetchVideo();
    }
  }, [videoId, fetchVideo]);

  return {
    // State
    video,
    videos,
    loading,
    error,
    uploadProgress,
    
    // Actions
    fetchVideo,
    fetchVideos,
    uploadVideo,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    toggleLike,
    
    // Setters (for manual updates)
    setVideo,
    setVideos
  };
};

export default useVideo;