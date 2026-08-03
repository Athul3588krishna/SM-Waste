import React from 'react';

const EmptyState = ({ title = 'No Reports Found', description = 'There are no waste reports available at the moment.', icon = '🗑️' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-900/40 border border-gray-800 rounded-2xl">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      <p className="text-sm text-gray-400 mt-1 max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
