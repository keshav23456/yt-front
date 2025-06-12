// src/components/playlist/CreatePlaylist.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '../common';
import PlaylistModal from './PlaylistModal';
// import { createPlaylist } from '../../store/slices/playlistSlice';

const CreatePlaylist = ({ className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCreate = async (playlistData) => {
    setLoading(true);
    try {
      await dispatch(createPlaylist(playlistData)).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="primary"
        className={className}
      >
        Create Playlist
      </Button>
      
      <PlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        title="Create New Playlist"
        loading={loading}
      />
    </>
  );
};

export default CreatePlaylist;