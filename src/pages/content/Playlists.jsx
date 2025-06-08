import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../../components/common/Loading';
import PlaylistCard from '../../components/playlist/PlaylistCard';
import CreatePlaylist from '../../components/playlist/CreatePlaylist';
import { getUserPlaylists } from '../../services/playlist.service';

const Playlists = () => {
  const { user } = useSelector(state => state.auth);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, public, private

  useEffect(() => {
    if (user?.id) {
      fetchPlaylists();
    }
  }, [user?.id]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await getUserPlaylists(user.id);
      if (response.success) {
        setPlaylists(response.data);
      } else {
        setError('Failed to fetch playlists');
      }
    } catch (err) {
      setError('Error loading playlists');
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists(prevPlaylists => [newPlaylist, ...prevPlaylists]);
    setShowCreateModal(false);
  };

  const handlePlaylistDeleted = (playlistId) => {
    setPlaylists(prevPlaylists => 
      prevPlaylists.filter(playlist => playlist._id !== playlistId)
    );
  };

  const filteredPlaylists = playlists.filter(playlist => {
    if (filter === 'all') return true;
    if (filter === 'public') return playlist.isPublic;
    if (filter === 'private') return !playlist.isPublic;
    return true;
  });

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Playlists</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchPlaylists}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Playlists</h1>
              <p className="text-gray-600">
                {filteredPlaylists.length} {filteredPlaylists.length === 1 ? 'playlist' : 'playlists'}
                {filter !== 'all' && ` (${filter})`}
              </p>
            </div>
            
            <div className="flex gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Playlists</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>+</span>
                New Playlist
              </button>
            </div>
          </div>
        </div>

        {filteredPlaylists.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {filter === 'all' 
                ? 'No Playlists Yet' 
                : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Playlists`
              }
            </h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? 'Create your first playlist to organize your favorite videos!'
                : `You don't have any ${filter} playlists yet.`
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Create Playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaylists.map(playlist => (
              <PlaylistCard
                key={playlist._id}
                playlist={playlist}
                onDelete={handlePlaylistDeleted}
                showOwnerControls={true}
              />
            ))}
          </div>
        )}

        {showCreateModal && (
          <CreatePlaylist
            onClose={() => setShowCreateModal(false)}
            onPlaylistCreated={handlePlaylistCreated}
          />
        )}
      </div>
    </div>
  );
};

export default Playlists;