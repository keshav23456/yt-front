// src/components/playlist/AddToPlaylist.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from '../common';
import CreatePlaylist from './CreatePlaylist';
import { fetchUserPlaylists, addVideoToPlaylist, removeVideoFromPlaylist } from '../../store/slices/playlistSlice';

const AddToPlaylist = ({ videoId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState(new Set());
  const dispatch = useDispatch();
  
  const { playlists, loading: playlistsLoading } = useSelector(state => state.playlist);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (isOpen && user) {
      dispatch(fetchUserPlaylists(user._id));
    }
  }, [isOpen, user, dispatch]);

  useEffect(() => {
    // Set initial selected playlists based on video presence
    const videoPlaylists = new Set();
    playlists.forEach(playlist => {
      if (playlist.videos.some(video => video._id === videoId)) {
        videoPlaylists.add(playlist._id);
      }
    });
    setSelectedPlaylists(videoPlaylists);
  }, [playlists, videoId]);

  const handlePlaylistToggle = async (playlistId) => {
    setLoading(true);
    try {
      if (selectedPlaylists.has(playlistId)) {
        await dispatch(removeVideoFromPlaylist({ videoId, playlistId })).unwrap();
        setSelectedPlaylists(prev => {
          const newSet = new Set(prev);
          newSet.delete(playlistId);
          return newSet;
        });
      } else {
        await dispatch(addVideoToPlaylist({ videoId, playlistId })).unwrap();
        setSelectedPlaylists(prev => new Set([...prev, playlistId]));
      }
    } catch (error) {
      console.error('Failed to update playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Playlist">
      <div className="add-to-playlist">
        <div className="playlist-list">
          {playlistsLoading ? (
            <div className="loading-text">Loading playlists...</div>
          ) : playlists.length === 0 ? (
            <div className="no-playlists">
              <p>You don't have any playlists yet.</p>
              <CreatePlaylist />
            </div>
          ) : (
            <>
              {playlists.map(playlist => (
                <div key={playlist._id} className="playlist-item">
                  <label className="playlist-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPlaylists.has(playlist._id)}
                      onChange={() => handlePlaylistToggle(playlist._id)}
                      disabled={loading}
                    />
                    <span className="checkmark"></span>
                    <div className="playlist-info">
                      <span className="playlist-name">{playlist.name}</span>
                      <span className="playlist-count">
                        {playlist.videos.length} videos
                      </span>
                    </div>
                  </label>
                </div>
              ))}
              <div className="create-new-playlist">
                <CreatePlaylist className="btn-outline" />
              </div>
            </>
          )}
        </div>
        
        <div className="modal-actions">
          <Button onClick={onClose} variant="primary">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddToPlaylist;