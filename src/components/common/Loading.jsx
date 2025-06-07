import React from 'react';

const Loading = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 ${sizes[size]}`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default Loading;