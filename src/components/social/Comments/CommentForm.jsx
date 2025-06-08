// src/components/social/Comments/CommentForm.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../common';
import { addComment } from '../../../store/slices/commentSlice';

const CommentForm = ({ 
  videoId, 
  parentId = null, 
  onSubmit, 
  onCancel,
  initialValue = '',
  placeholder = 'Add a comment...',
  submitText = 'Comment'
}) => {
  const [content, setContent] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      if (onSubmit && typeof onSubmit === 'function' && initialValue) {
        // This is an edit form
        await onSubmit(content);
      } else {
        // This is a new comment
        await dispatch(addComment({ 
          videoId, 
          content: content.trim(),
          parentId 
        })).unwrap();
        setContent('');
        if (onSubmit) onSubmit();
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent(initialValue);
    if (onCancel) onCancel();
  };

  if (!user) {
    return (
      <div className="comment-form-placeholder">
        <p>Please log in to comment</p>
      </div>
    );
  }

  return (
    <div className="comment-form">
      <div className="comment-form-avatar">
        <img 
          src={user.avatar || '/assets/default-avatar.png'} 
          alt={user.fullName}
        />
      </div>
      
      <form onSubmit={handleSubmit} className="comment-form-content">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="comment-textarea"
          rows="3"
          disabled={loading}
        />
        
        <div className="comment-form-actions">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={!content.trim() || loading}
            loading={loading}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;