// src/components/social/LikeButton.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '../common';
import { toggleVideoLike, toggleCommentLike, toggleTweetLike } from '../../store/slices/likeSlice';
import './LikeButton.css';

const LikeButton = ({ 
  targetId, 
  targetType, // 'video', 'comment', 'tweet'
  likesCount = 0, 
  isLiked = false,
  size = 'medium',
  showCount = true 
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleToggleLike = async () => {
    setLoading(true);
    try {
      let action;
      switch (targetType) {
        case 'video':
          action = toggleVideoLike(targetId);
          break;
        case 'comment':
          action = toggleCommentLike(targetId);
          break;
        case 'tweet':
          action = toggleTweetLike(targetId);
          break;
        default:
          throw new Error('Invalid target type');
      }
      
      await dispatch(action).unwrap();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggleLike}
      disabled={loading}
      variant="text"
      size={size}
      className={`like-button ${isLiked ? 'liked' : ''}`}
    >
      <span className="like-icon">
        {isLiked ? '👍' : '👍'}
      </span>
      {showCount && <span className="like-count">{likesCount}</span>}
    </Button>
  );
};

export default LikeButton;