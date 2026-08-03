import React from 'react';
import { getStatusMeta } from '../utils/formatters';

const StatusBadge = ({ status }) => {
  const { label, colorClass, bgClass } = getStatusMeta(status);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${bgClass} ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {label}
    </span>
  );
};

export default StatusBadge;
