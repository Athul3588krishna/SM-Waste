import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ style = {}, showLabel = false }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
      style={{
        background: 'var(--badge-bg)',
        border: '1px solid var(--border-glass)',
        borderRadius: '20px',
        padding: showLabel ? '6px 14px' : '8px',
        color: isDark ? '#fbbf24' : '#8b5cf6',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(10px)',
        outline: 'none',
        ...style
      }}
      className="theme-toggle-btn"
    >
      {isDark ? (
        <Sun size={18} style={{ transition: 'transform 0.4s ease, color 0.3s ease', transform: 'rotate(0deg)' }} />
      ) : (
        <Moon size={18} style={{ transition: 'transform 0.4s ease, color 0.3s ease', transform: 'rotate(0deg)' }} />
      )}
      {showLabel && (
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
