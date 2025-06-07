import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Clock, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const VideoCard = ({ video, layout = 'grid' }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  if (layout === 'list') {
    return (
      <div className="flex space-x-4 p-4 hover:bg-gray-50 rounded-lg">
        <Link
          to={`/video/${video._id}`}
          className="relative flex-shrink-0"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-48 h-28 object-cover rounded-lg"
          />
          {video.duration && (
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </span>
          )}
        </Link>
        
        <div className="flex-1">
          <Link to={`/video/${video._id}`}>
            <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 line-clamp-2">
              {video.title}
            </h3>
          </Link>
          
          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
            <Eye className="h-4 w-4" />
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
          </div>
          
          <Link
            to={`/channel/${video.owner.username}`}
            className="flex items-center space-x-2 mt-2 hover:text-indigo-600"
          >
            <img
              src={video.owner.avatar}
              alt={video.owner.fullName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-gray-600">{video.owner.fullName}</span>
          </Link>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {video.description}
          </p>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-full h-fit">
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="group">
      <Link to={`/video/${video._id}`} className="block relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-lg group-hover:rounded-none transition-all duration-200"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </span>
        )}
      </Link>
      
      <div className="mt-3">
        <div className="flex space-x-3">
          <Link to={`/channel/${video.owner.username}`} className="flex-shrink-0">
            <img
              src={video.owner.avatar}
              alt={video.owner.fullName}
              className="w-9 h-9 rounded-full object-cover"
            />
          </Link>
          
          <div className="flex-1">
            <Link to={`/video/${video._id}`}>
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2">
                {video.title}
              </h3>
            </Link>
            
            <Link
              to={`/channel/${video.owner.username}`}
              className="text-sm text-gray-600 hover:text-indigo-600 mt-1 block"
            >
              {video.owner.fullName}
            </Link>
            
            <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
            </div>
          </div>
          
          <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-full h-fit transition-opacity">
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;