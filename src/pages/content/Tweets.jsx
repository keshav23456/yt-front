import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../../components/common/Loading';
import TweetCard from '../../components/social/TweetCard';
import TweetForm from '../../components/social/TweetForm';
import { getUserTweets } from '../../services';

const Tweets = () => {
  const { user } = useSelector(state => state.auth);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTweetForm, setShowTweetForm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchTweets();
    }
  }, [user?.id]);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const response = await getUserTweets(user.id);
      if (response.success) {
        setTweets(response.data);
      } else {
        setError('Failed to fetch tweets');
      }
    } catch (err) {
      setError('Error loading tweets');
      console.error('Error fetching tweets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTweetCreated = (newTweet) => {
    setTweets(prevTweets => [newTweet, ...prevTweets]);
    setShowTweetForm(false);
  };

  const handleTweetDeleted = (tweetId) => {
    setTweets(prevTweets => 
      prevTweets.filter(tweet => tweet._id !== tweetId)
    );
  };

  const handleTweetUpdated = (updatedTweet) => {
    setTweets(prevTweets =>
      prevTweets.map(tweet =>
        tweet._id === updatedTweet._id ? updatedTweet : tweet
      )
    );
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tweets</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchTweets}
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tweets</h1>
              <p className="text-gray-600">
                {tweets.length} {tweets.length === 1 ? 'tweet' : 'tweets'}
              </p>
            </div>
            
            <button
              onClick={() => setShowTweetForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium"
            >
              Tweet
            </button>
          </div>
        </div>

        {showTweetForm && (
          <div className="mb-6">
            <TweetForm
              onTweetCreated={handleTweetCreated}
              onCancel={() => setShowTweetForm(false)}
            />
          </div>
        )}

        {tweets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Tweets Yet</h2>
            <p className="text-gray-600 mb-6">
              Share your thoughts with the world! Your tweets will appear here.
            </p>
            <button
              onClick={() => setShowTweetForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Write Your First Tweet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tweets.map(tweet => (
              <TweetCard
                key={tweet._id}
                tweet={tweet}
                onDelete={handleTweetDeleted}
                onUpdate={handleTweetUpdated}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tweets;
