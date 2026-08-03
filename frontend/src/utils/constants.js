/**
 * Application Constants for EcoClean Frontend
 */

export const WASTE_CATEGORIES = [
  { id: 'plastic', label: 'Plastic Waste', color: '#3b82f6', icon: '🥤' },
  { id: 'organic', label: 'Organic / Wet Waste', color: '#10b981', icon: '🍏' },
  { id: 'hazardous', label: 'Hazardous Waste', color: '#ef4444', icon: '⚠️' },
  { id: 'ewaste', label: 'E-Waste', color: '#8b5cf6', icon: '💻' },
];

export const SEVERITY_LEVELS = [
  { id: 'low', label: 'Low Severity', points: 10 },
  { id: 'medium', label: 'Medium Severity', points: 30 },
  { id: 'high', label: 'High Priority', points: 50 },
];
