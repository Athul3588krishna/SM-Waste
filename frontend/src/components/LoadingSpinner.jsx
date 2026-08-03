import React from 'react';

const LoadingSpinner = ({ size = 'md', label = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin`}
      />
      {label && <p className="text-sm text-gray-400 font-medium animate-pulse">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
