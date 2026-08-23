import React from 'react';
import { Wifi, Sparkles, ShieldCheck } from 'lucide-react';

const EcoCreditCard = ({
  holderName = 'ATHUL KRISHNA',
  cardNumber = '4582 8910 3412 9018',
  expiryDate = '12/28',
  balanceText = '500 PTS',
  cardType = 'CITIZEN ECO-CARD',
  rankBadge = 'ECO WARRIOR',
  theme = 'emerald' // 'emerald' | 'cyan' | 'gold'
}) => {
  // Theme gradients
  const themes = {
    emerald: {
      bg: 'linear-gradient(135deg, #064e3b 0%, #022c22 45%, #0f172a 100%)',
      border: '1px solid rgba(16, 185, 129, 0.4)',
      glow: '0 15px 35px rgba(16, 185, 129, 0.25)',
      accent: '#10b981',
      badgeBg: 'rgba(16, 185, 129, 0.2)',
      logoGrad: 'linear-gradient(45deg, #10b981, #34d399)'
    },
    cyan: {
      bg: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 45%, #0f172a 100%)',
      border: '1px solid rgba(0, 210, 255, 0.4)',
      glow: '0 15px 35px rgba(0, 210, 255, 0.25)',
      accent: '#00d2ff',
      badgeBg: 'rgba(0, 210, 255, 0.2)',
      logoGrad: 'linear-gradient(45deg, #00d2ff, #38bdf8)'
    },
    gold: {
      bg: 'linear-gradient(135deg, #78350f 0%, #451a03 45%, #0f172a 100%)',
      border: '1px solid rgba(245, 158, 11, 0.4)',
      glow: '0 15px 35px rgba(245, 158, 11, 0.25)',
      accent: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.2)',
      logoGrad: 'linear-gradient(45deg, #f59e0b, #fbbf24)'
    }
  };

  const activeTheme = themes[theme] || themes.emerald;

  return (
    <div style={{
      width: '100%',
      maxWidth: '360px',
      height: '215px',
      borderRadius: '16px',
      background: activeTheme.bg,
      border: activeTheme.border,
      boxShadow: activeTheme.glow,
      padding: '22px 24px',
      position: 'relative',
      overflow: 'hidden',
      color: '#ffffff',
      fontFamily: "'Courier New', Courier, monospace",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      margin: '0 auto',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    }}
    className="eco-credit-card-hover"
    >
      {/* Glossy Diagonal Shine Overlay */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
        pointerEvents: 'none',
        transform: 'rotate(25deg)'
      }} />

      {/* Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color={activeTheme.accent} />
          <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: 'rgba(255,255,255,0.85)', fontFamily: 'sans-serif' }}>
            {cardType}
          </span>
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: '800',
          padding: '3px 8px',
          borderRadius: '20px',
          background: activeTheme.badgeBg,
          color: activeTheme.accent,
          border: `1px solid ${activeTheme.accent}`,
          fontFamily: 'sans-serif',
          textTransform: 'uppercase'
        }}>
          {rankBadge}
        </span>
      </div>

      {/* EMV Microchip & Contactless Waves */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '8px 0', zIndex: 1 }}>
        {/* Golden Metallic EMV Chip */}
        <div style={{
          width: '42px',
          height: '30px',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 50%, #d97706 100%)',
          border: '1px solid #b45309',
          position: 'relative',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3)'
        }}>
          {/* Inner Chip Lines */}
          <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(0,0,0,0.3)' }} />
          <div style={{ position: 'absolute', top: 0, left: '33%', width: '1px', height: '100%', background: 'rgba(0,0,0,0.3)' }} />
          <div style={{ position: 'absolute', top: 0, left: '66%', width: '1px', height: '100%', background: 'rgba(0,0,0,0.3)' }} />
        </div>

        {/* Contactless Wifi Icon */}
        <Wifi size={20} color="rgba(255,255,255,0.7)" style={{ transform: 'rotate(90deg)' }} />
      </div>

      {/* Embossed Card Number */}
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        letterSpacing: '3px',
        color: '#f8fafc',
        textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 -1px 0 rgba(255,255,255,0.3)',
        zIndex: 1,
        margin: '4px 0'
      }}>
        {cardNumber}
      </div>

      {/* Card Footer: Holder Name, Expiry & Balance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
        <div>
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', fontFamily: 'sans-serif', marginBottom: '2px' }}>
            CARD HOLDER
          </div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#f8fafc', textTransform: 'uppercase' }}>
            {holderName}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', fontFamily: 'sans-serif', marginBottom: '2px' }}>
            EXPIRES
          </div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: '#f8fafc' }}>
            {expiryDate}
          </div>
        </div>

        {/* Overlapping Circles Hologram Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: activeTheme.accent,
            opacity: 0.85
          }} />
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#f59e0b',
            opacity: 0.85,
            marginLeft: '-10px'
          }} />
        </div>
      </div>
    </div>
  );
};

export default EcoCreditCard;
