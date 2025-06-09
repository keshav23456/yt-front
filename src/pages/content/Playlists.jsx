import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../../components/common/Loading';
import PlaylistCard from '../../components/playlist/PlaylistCard';
import CreatePlaylist from '../../components/playlist/CreatePlaylist';
import { getUserPlaylists } from '../../services';
const Playlists = () => {
  const { user } = useSelector(state => state.auth);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, public, private
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name, videos
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPlaylists = useCallback(async (isRefresh = false) => {
    if (!user?.id) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await getUserPlaylists(user.id);
      if (response.success) {
        setPlaylists(response.data);
      } else {
        setError(response.message || 'Failed to fetch playlists');
      }
    } catch (err) {
      setError('Error loading playlists');
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handlePlaylistCreated = useCallback((newPlaylist) => {
    setPlaylists(prevPlaylists => [newPlaylist, ...prevPlaylists]);
    setShowCreateModal(false);
  }, []);

  const handlePlaylistDeleted = useCallback((playlistId) => {
    setPlaylists(prevPlaylists => 
      prevPlaylists.filter(playlist => playlist._id !== playlistId)
    );
  }, []);

  const handlePlaylistUpdated = useCallback((updatedPlaylist) => {
    setPlaylists(prevPlaylists =>
      prevPlaylists.map(playlist =>
        playlist._id === updatedPlaylist._id ? updatedPlaylist : playlist
      )
    );
  }, []);

  const handleRefresh = () => {
    fetchPlaylists(true);
  };

  // Memoized filtered and sorted playlists
  const processedPlaylists = useMemo(() => {
    let filtered = playlists.filter(playlist => {
      // Filter by visibility
      const passesFilter = (() => {
        if (filter === 'all') return true;
        if (filter === 'public') return playlist.isPublic;
        if (filter === 'private') return !playlist.isPublic;
        return true;
      })();

      // Filter by search query
      const passesSearch = searchQuery === '' || 
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return passesFilter && passesSearch;
    });

    // Sort playlists
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        case 'videos':
          return (b.videos?.length || 0) - (a.videos?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [playlists, filter, sortBy, searchQuery]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to view your playlists.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !refreshing) return <Loading />;

  if (error && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Playlists</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => fetchPlaylists()}
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Playlists</h1>
              <p className="text-gray-600">
                {processedPlaylists.length} {processedPlaylists.length === 1 ? 'playlist' : 'playlists'}
                {filter !== 'all' && ` (${filter})`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {refreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </>
                )}
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>+</span>
                New Playlist
              </button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="videos">Most Videos</option>
              </select>
            </div>
          </div>
        </div>

        {processedPlaylists.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {searchQuery ? 'No Matching Playlists' :
               filter === 'all' ? 'No Playlists Yet' : 
               `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Playlists`
              }
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery ? `No playlists match "${searchQuery}". Try a different search term.` :
               filter === 'all' ? 'Create your first playlist to organize your favorite videos!' :
               `You don't have any ${filter} playlists yet.`
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Create Playlist
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedPlaylists.map(playlist => (
              <PlaylistCard
                key={playlist._id}
                playlist={playlist}
                onDelete={handlePlaylistDeleted}
                onUpdate={handlePlaylistUpdated}
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