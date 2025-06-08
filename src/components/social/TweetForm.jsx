import React, { useState } from 'react';
import { Image, Smile, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { tweetService } from '../../services';

const TweetForm = ({ onTweetCreated, className = '' }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const maxLength = 280;
  const remainingChars = maxLength - content.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Tweet content cannot be empty');
      return;
    }

    if (content.length > maxLength) {
      setError(`Tweet cannot exceed ${maxLength} characters`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await tweetService.createTweet({
        content: content.trim()
      });

      if (response.success) {
        setContent('');
        onTweetCreated?.(response.data);
      }
    } catch (error) {
      console.error('Error creating tweet:', error);
      setError(error.message || 'Failed to post tweet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-start space-x-3 mb-4">
          <img
            src={user?.avatar || '/assets/default-avatar.png'}
            alt={user?.fullName}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's happening?"
              className="w-full p-3 text-lg border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              rows="3"
              disabled={loading}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Media options */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              disabled={loading}
              title="Add image (coming soon)"
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              disabled={loading}
              title="Add emoji (coming soon)"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              disabled={loading}
              title="Add location (coming soon)"
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>

          {/* Character count and submit */}
          <div className="flex items-center space-x-3">
            {/* Character counter */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                  remainingChars < 0
                    ? 'border-red-500 text-red-500'
                    : remainingChars < 20
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {remainingChars < 20 ? remainingChars : ''}
              </div>
              
              {/* Progress circle */}
              <div className="relative w-6 h-6">
                <svg className="transform -rotate-90 w-6 h-6">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 10}`}
                    strokeDashoffset={`${2 * Math.PI * 10 * (1 - (content.length / maxLength))}`}
                    className={
                      remainingChars < 0
                        ? 'text-red-500'
                        : remainingChars < 20
                        ? 'text-yellow-500'
                        : 'text-blue-500'
                    }
                  />
                </svg>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !content.trim() || content.length > maxLength}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>Tweet</span>
            </button>
          </div>
        </div>

        {/* Helper text */}
        <div className="mt-2 text-xs text-gray-500">
          <p>Press Ctrl+Enter to tweet quickly</p>
        </div>
      </form>
    </div>
  );
};

export default TweetForm;