// src/components/social/Comments/CommentItem.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../../common';
import LikeButton from '../LikeButton';
import CommentForm from './CommentForm';
import { updateComment, deleteComment } from '../../../store/slices/commentSlice';

const CommentItem = ({ comment, videoId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const isOwner = user?._id === comment.owner._id;
  const hasReplies = comment.replies?.length > 0;

  const handleUpdate = async (content) => {
    try {
      await dispatch(updateComment({ 
        commentId: comment._id, 
        content 
      })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment(comment._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-avatar">
        <img 
          src={comment.owner.avatar || '/assets/default-avatar.png'} 
          alt={comment.owner.fullName}
        />
      </div>
      
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.owner.fullName}</span>
          <span className="comment-date">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        {isEditing ? (
          <CommentForm
            initialValue={comment.content}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            placeholder="Edit your comment..."
            submitText="Update"
          />
        ) : (
          <p className="comment-text">{comment.content}</p>
        )}
        
        <div className="comment-actions">
          <LikeButton 
            targetId={comment._id}
            targetType="comment"
            likesCount={comment.likesCount}
            isLiked={comment.isLiked}
          />
          
          <Button
            variant="text"
            size="small"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </Button>
          
          {isOwner && !isEditing && (
            <>
              <Button
                variant="text"
                size="small"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={handleDelete}
                className="text-danger"
              >
                Delete
              </Button>
            </>
          )}
          
          {hasReplies && (
            <Button
              variant="text"
              size="small"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
            </Button>
          )}
        </div>
        
        {isReplying && (
          <div className="comment-reply-form">
            <CommentForm
              videoId={videoId}
              parentId={comment._id}
              onSubmit={() => setIsReplying(false)}
              onCancel={() => setIsReplying(false)}
              placeholder="Write a reply..."
            />
          </div>
        )}
        
        {showReplies && hasReplies && (
          <div className="comment-replies">
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply._id} 
                comment={reply}
                videoId={videoId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;