import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      title={language === 'en' ? 'Switch to Malayalam (മലയാളം)' : 'Switch to English'}
      style={{
        background: 'var(--badge-bg)',
        border: '1px solid var(--border-glass)',
        padding: '5px 12px',
        borderRadius: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-primary)',
        fontSize: '12px',
        fontWeight: '700',
        transition: 'all 0.25s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      className="lang-toggle-btn"
    >
      <Globe size={14} color="var(--color-primary)" />
      <span style={{ letterSpacing: '0.5px' }}>
        {language === 'en' ? 'EN' : 'ML'}
      </span>
      <span style={{
        fontSize: '10px',
        opacity: 0.6,
        borderLeft: '1px solid var(--border-glass)',
        paddingLeft: '5px',
        marginLeft: '2px'
      }}>
        {language === 'en' ? 'മലയാളം' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle;
