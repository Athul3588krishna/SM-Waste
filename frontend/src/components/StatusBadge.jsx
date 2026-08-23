import React from 'react';
import { getStatusMeta } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

const StatusBadge = ({ status }) => {
  const { t } = useLanguage();
  const { label, colorClass, bgClass } = getStatusMeta(status);

  // Map default english label to i18n key if available
  const getI18nLabel = (rawStatus) => {
    const s = (rawStatus || '').toLowerCase();
    if (s === 'pending') return t('statusPending', 'Pending');
    if (s === 'assigned') return t('statusAssigned', 'Assigned');
    if (s === 'in_progress') return t('statusInProgress', 'In Progress');
    if (s === 'resolved' || s === 'completed') return t('statusCompleted', 'Completed');
    if (s === 'rejected') return t('statusRejected', 'Rejected');
    return label;
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${bgClass} ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {getI18nLabel(status)}
    </span>
  );
};

export default StatusBadge;
