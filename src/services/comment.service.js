import { api } from './api.js';

// Comment service with pagination support
export const getVideoComments = async (videoId, page = 1, limit = 10) => {
  const response = await api.get(`/comments/${videoId}`, {
    params: { page, limit }
  });
  return response.data;
};

export const addComment = async (videoId, commentData) => {
  const response = await api.post(`/comments/${videoId}`, commentData);
  return response.data;
};

export const updateComment = async (commentId, commentData) => {
  const response = await api.patch(`/comments/c/${commentId}`, commentData);
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/c/${commentId}`);
  return response.data;
};

export const toggleCommentLike = async (commentId) => {
  const response = await api.post(`/comments/c/${commentId}/toggle-like`);
  return response.data;
};

export const addReply = async (commentId, replyData) => {
  const response = await api.post(`/comments/c/${commentId}/reply`, replyData);
  return response.data;
};

export const getReplies = async (commentId, page = 1, limit = 5) => {
  const response = await api.get(`/comments/c/${commentId}/replies`, {
    params: { page, limit }
  });
  return response.data;
};

export const commentService = {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  addReply,
  getReplies
};