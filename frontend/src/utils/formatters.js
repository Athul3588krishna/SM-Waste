/**
 * Utility functions for formatting dates, distances, and status labels in EcoClean UI
 */

/**
 * Format ISO date string into a human-readable date and time format
 * @param {string|Date} dateInput 
 * @returns {string} Formatted date string
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

/**
 * Format distance in kilometers or meters
 * @param {number} distanceInKm 
 * @returns {string} Formatted distance
 */
export const formatDistance = (distanceInKm) => {
  if (distanceInKm === undefined || distanceInKm === null) return '0 m';
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
};

/**
 * Get CSS color class and label for complaint status
 * @param {string} status 
 * @returns {{ label: string, colorClass: string, bgClass: string }}
 */
export const getStatusMeta = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'pending':
      return { label: 'Pending Verification', colorClass: 'text-amber-400', bgClass: 'bg-amber-500/10 border-amber-500/20' };
    case 'assigned':
    case 'in_progress':
      return { label: 'In Cleanup Progress', colorClass: 'text-blue-400', bgClass: 'bg-blue-500/10 border-blue-500/20' };
    case 'resolved':
    case 'completed':
      return { label: 'Cleaned & Verified', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10 border-emerald-500/20' };
    default:
      return { label: status || 'Unknown', colorClass: 'text-gray-400', bgClass: 'bg-gray-500/10 border-gray-500/20' };
  }
};
