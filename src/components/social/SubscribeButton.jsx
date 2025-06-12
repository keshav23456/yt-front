// src/components/social/SubscribeButton.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../common';
import { toggleSubscription } from '../../store/slices/subscriptionSlice';
// import './SubscribeButton.css';

const SubscribeButton = ({ 
  channelId, 
  isSubscribed = false, 
  subscribersCount = 0,
  size = 'medium' 
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  // Don't show subscribe button if user is viewing their own channel
  if (user?._id === channelId) {
    return null;
  }

  const handleToggleSubscription = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    setLoading(true);
    try {
      await dispatch(toggleSubscription(channelId)).unwrap();
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggleSubscription}
      disabled={loading}
      variant={isSubscribed ? 'secondary' : 'primary'}
      size={size}
      className={`subscribe-button ${isSubscribed ? 'subscribed' : ''}`}
    >
      {loading ? 'Loading...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
      {subscribersCount > 0 && (
        <span className="subscribers-count">
          {subscribersCount.toLocaleString()}
        </span>
      )}
    </Button>
  );
};

export default SubscribeButton;