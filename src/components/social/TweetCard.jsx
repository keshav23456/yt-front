import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { likeService, tweetService } from '../../services';

const TweetCard = ({ tweet, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(tweet.isLiked || false);
  const [likeCount, setLikeCount] = useState(tweet.likesCount || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      setLoading(true);
      const response = await likeService.toggleTweetLike(tweet._id);
      
      if (response.success) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    
    try {
      setLoading(true);
      const response = await tweetService.updateTweet(tweet._id, {
        content: editContent.trim()
      });
      
      if (response.success) {
        onUpdate?.(response.data);
        setIsEditing(false);
        setShowMenu(false);
      }
    } catch (error) {
      console.error('Error updating tweet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tweet?')) return;
    
    try {
      setLoading(true);
      const response = await tweetService.deleteTweet(tweet._id);
      
      if (response.success) {
        onDelete?.(tweet._id);
      }
    } catch (error) {
      console.error('Error deleting tweet:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user?._id === tweet.owner?._id;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={tweet.owner?.avatar || '/assets/default-avatar.png'}
            alt={tweet.owner?.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-900">
              {tweet.owner?.fullName}
            </h4>
            <p className="text-sm text-gray-500">
              @{tweet.owner?.username} · {formatDistanceToNow(new Date(tweet.createdAt))} ago
            </p>
          </div>
        </div>
        
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-3">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="What's on your mind?"
              maxLength={280}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {editContent.length}/280
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(tweet.content);
                  }}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={loading || !editContent.trim() || editContent === tweet.content}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
            {tweet.content}
          </p>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked 
                ? 'text-red-600 hover:text-red-700' 
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <Heart 
              className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} 
            />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Reply</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors">
            <Share className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      )}
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default TweetCard;