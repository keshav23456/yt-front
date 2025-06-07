import React from 'react';
import VideoCard from './VideoCard';
import { Loading } from '../common';

const VideoList = ({ videos, loading, error, layout = 'grid' }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loading size="lg" text="Loading videos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No videos found</p>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="space-y-2">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} layout="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} layout="grid" />
      ))}
    </div>
  );
};

export default VideoList;