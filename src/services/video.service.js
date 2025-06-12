import { api } from './api.js';

export const getAllVideos = async (params = {}) => {
  const response = await api.get('/videos', { params });
  return response.data;
};

export const uploadVideo = async (videoData) => {
  const formData = new FormData();
  Object.keys(videoData).forEach(key => {
    if (key !== 'videoFile' && key !== 'thumbnail') {
      formData.append(key, videoData[key]);
    }
  });
  
  if (videoData.videoFile) formData.append('videoFile', videoData.videoFile);
  if (videoData.thumbnail) formData.append('thumbnail', videoData.thumbnail);

  return api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);
};

export const getVideoById = async (videoId) => {
  const response = await api.get(`/videos/${videoId}`);
  return response.data;
};

export const updateVideo = async (videoId, updateData) => {
  const formData = new FormData();
  Object.keys(updateData).forEach(key => {
    if (key !== 'thumbnail') formData.append(key, updateData[key]);
  });
  
  if (updateData.thumbnail) formData.append('thumbnail', updateData.thumbnail);

  return api.patch(`/videos/${videoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);
};

export const deleteVideo = async (videoId) => {
  const response = await api.delete(`/videos/${videoId}`);
  return response.data;
};

export const togglePublishStatus = async (videoId) => {
  const response = await api.patch(`/videos/toggle/publish/${videoId}`);
  return response.data;
};

export  const videoService={
    getAllVideos,
    uploadVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
;