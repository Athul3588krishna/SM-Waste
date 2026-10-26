import React, { useState } from 'react';
import { Wifi, ShieldCheck, Lock } from 'lucide-react';

const EcoCreditCard = ({
  holderName = 'ATHUL KRISHNA',
  cardNumber = '4582 8910 3412 9018',
  expiryDate = '12/28',
  cvv = '',
  isFlipped = false,
  onFlip = null,
  balanceText = null,
  showBalance = true,
  cardType = 'CITIZEN ECO-CARD',
  rankBadge = 'ECO WARRIOR',
  theme = 'emerald' // 'emerald' | 'cyan' | 'gold'
}) => {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const flipped = onFlip ? isFlipped : (isFlipped || internalFlipped);

  const handleCardClick = () => {
    if (onFlip) {
      onFlip(!flipped);
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

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
    <div
      style={{
        width: '100%',
        maxWidth: '360px',
        height: '215px',
        margin: '0 auto',
        perspective: '1000px',
        cursor: 'pointer'
      }}
      onClick={handleCardClick}
      title="Click card to flip"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* ==================== FRONT FACE ==================== */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            background: activeTheme.bg,
            border: activeTheme.border,
            boxShadow: activeTheme.glow,
            padding: '22px 24px',
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            color: '#ffffff',
            fontFamily: "'Courier New', Courier, monospace",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          {/* Glossy Diagonal Shine Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
              pointerEvents: 'none',
              transform: 'rotate(25deg)'
            }}
          />

          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color={activeTheme.accent} />
              <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: 'rgba(255,255,255,0.85)', fontFamily: 'sans-serif' }}>
                {cardType}
              </span>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: '20px',
                background: activeTheme.badgeBg,
                color: activeTheme.accent,
                border: `1px solid ${activeTheme.accent}`,
                fontFamily: 'sans-serif',
                textTransform: 'uppercase'
              }}
            >
              {rankBadge}
            </span>
          </div>

          {/* EMV Microchip, Contactless Waves & Balance Pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Golden Metallic EMV Chip */}
              <div
                style={{
                  width: '42px',
                  height: '30px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 50%, #d97706 100%)',
                  border: '1px solid #b45309',
                  position: 'relative',
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {/* Inner Chip Lines */}
                <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(0,0,0,0.3)' }} />
                <div style={{ position: 'absolute', top: 0, left: '33%', width: '1px', height: '100%', background: 'rgba(0,0,0,0.3)' }} />
                <div style={{ position: 'absolute', top: 0, left: '66%', width: '1px', height: '100%', background: 'rgba(0,0,0,0.3)' }} />
              </div>

              {/* Contactless Wifi Icon */}
              <Wifi size={20} color="rgba(255,255,255,0.7)" style={{ transform: 'rotate(90deg)' }} />
            </div>

            {/* Balance Display Pill */}
            {showBalance && balanceText && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: `1px solid ${activeTheme.accent}`,
                  borderRadius: '8px',
                  padding: '4px 10px',
                  textAlign: 'right',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.8px', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>
                  Balance
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: activeTheme.accent, fontFamily: 'sans-serif' }}>
                  {balanceText}
                </div>
              </div>
            )}
          </div>

          {/* Embossed Card Number */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '3px',
              color: '#f8fafc',
              textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 -1px 0 rgba(255,255,255,0.3)',
              zIndex: 1,
              margin: '4px 0'
            }}
          >
            {cardNumber || '•••• •••• •••• ••••'}
          </div>

          {/* Card Footer: Holder Name, Expiry & Circles Logo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
            <div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', fontFamily: 'sans-serif', marginBottom: '2px' }}>
                CARD HOLDER
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#f8fafc', textTransform: 'uppercase' }}>
                {holderName || 'CARD HOLDER'}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', fontFamily: 'sans-serif', marginBottom: '2px' }}>
                EXPIRES
              </div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: '#f8fafc' }}>
                {expiryDate || 'MM/YY'}
              </div>
            </div>

            {/* Overlapping Circles Hologram Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: activeTheme.accent,
                  opacity: 0.85
                }}
              />
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  opacity: 0.85,
                  marginLeft: '-10px'
                }}
              />
            </div>
          </div>
        </div>

        {/* ==================== BACK FACE ==================== */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            background: activeTheme.bg,
            border: activeTheme.border,
            boxShadow: activeTheme.glow,
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '14px 0 16px 0',
            color: '#ffffff',
            transition: 'box-shadow 0.3s ease'
          }}
        >
          {/* Glossy Diagonal Shine Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
              pointerEvents: 'none',
              transform: 'rotate(25deg)'
            }}
          />

          {/* Top Section: Magnetic Stripe & Signature/CVV Strip */}
          <div>
            {/* Magnetic Stripe */}
            <div
              style={{
                width: '100%',
                height: '40px',
                background: 'linear-gradient(180deg, #05080e 0%, #171d2b 50%, #05080e 100%)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)'
              }}
            />

            {/* Signature & CVV Row */}
            <div style={{ padding: '12px 22px 0 22px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3px' }}>
                <span style={{ fontSize: '8px', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', fontFamily: 'sans-serif' }}>
                  CVV / CVC
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', height: '34px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                {/* Signature Strip */}
                <div
                  style={{
                    flex: 1,
                    height: '100%',
                    background: 'repeating-linear-gradient(45deg, #e2e8f0, #e2e8f0 6px, #cbd5e1 6px, #cbd5e1 12px)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px',
                    color: '#334155',
                    fontSize: '11px',
                    fontFamily: 'cursive, sans-serif',
                    fontStyle: 'italic',
                    fontWeight: '600',
                    userSelect: 'none'
                  }}
                >
                  {holderName || 'Authorized Signature'}
                </div>

                {/* CVV Display Box */}
                <div
                  style={{
                    width: '65px',
                    height: '100%',
                    background: '#ffffff',
                    borderLeft: '1px solid #94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f172a',
                    fontSize: '15px',
                    fontWeight: '900',
                    fontFamily: "'Courier New', Courier, monospace",
                    letterSpacing: '3px'
                  }}
                >
                  {cvv || '•••'}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Security Disclaimer & Badges */}
          <div style={{ padding: '0 22px', position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontSize: '8px',
                lineHeight: '1.35',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'sans-serif',
                margin: '0 0 10px 0'
              }}
            >
              Authorized municipal payout instrument. Valid for smart waste fund clearance. Unauthorized duplication prohibited under Municipal Act.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={12} color={activeTheme.accent} />
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: activeTheme.accent, letterSpacing: '0.8px', fontFamily: 'sans-serif' }}>
                  PROTECTED 256-BIT ESCROW
                </span>
              </div>

              {/* Overlapping Circles Logo */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: activeTheme.accent,
                    opacity: 0.85
                  }}
                />
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    opacity: 0.85,
                    marginLeft: '-8px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoCreditCard;
