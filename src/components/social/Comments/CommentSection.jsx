// src/components/social/Comments/CommentSection.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { Loading } from '../../common';
import { fetchComments } from '../../../store/slices/commentSlice';
import './CommentSection.css';

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();
  const { comments, loading, totalComments } = useSelector(state => state.comment);

  useEffect(() => {
    if (videoId) {
      dispatch(fetchComments(videoId));
    }
  }, [videoId, dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>{totalComments} Comments</h3>
      </div>
      
      <CommentForm videoId={videoId} />
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem 
              key={comment._id} 
              comment={comment}
              videoId={videoId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;