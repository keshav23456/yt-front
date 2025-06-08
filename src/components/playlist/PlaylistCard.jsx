// src/components/playlist/PlaylistCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import './PlaylistCard.css';

const PlaylistCard = ({ playlist, onEdit, onDelete, showActions = false }) => {
  const { _id, name, description, videos, createdAt, owner } = playlist;
  const videoCount = videos?.length || 0;
  const firstVideo = videos?.[0];

  return (
    <div className="playlist-card">
      <Link to={`/playlist/${_id}`} className="playlist-thumbnail">
        {firstVideo?.thumbnail ? (
          <img src={firstVideo.thumbnail} alt={name} />
        ) : (
          <div className="playlist-placeholder">
            <span className="video-count">{videoCount} videos</span>
          </div>
        )}
        <div className="playlist-overlay">
          <span className="video-count">{videoCount} videos</span>
        </div>
      </Link>
      
      <div className="playlist-info">
        <Link to={`/playlist/${_id}`}>
          <h3 className="playlist-title">{name}</h3>
        </Link>
        {description && (
          <p className="playlist-description">{description}</p>
        )}
        <div className="playlist-meta">
          <span className="playlist-owner">{owner?.fullName}</span>
          <span className="playlist-date">{formatDate(createdAt)}</span>
        </div>
        
        {showActions && (
          <div className="playlist-actions">
            <button 
              onClick={() => onEdit(playlist)}
              className="btn-secondary"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(_id)}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;