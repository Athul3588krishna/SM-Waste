import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Trash2, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Award, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Truck, 
  Sparkles,
  Smartphone,
  Shield,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleActionClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '5rem 1.5rem 4rem', 
        textAlign: 'center', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {/* Subtle Background Glow */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none',
          borderRadius: '50%',
          zIndex: 0
        }} />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--primary-color, #10b981)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} />
            <span>Smart Municipal Waste Management System</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            marginBottom: '1.2rem',
            background: 'linear-gradient(135deg, var(--text-primary) 30%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI Powered Smart Waste Management Portal
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary, #9ca3af)',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}>
            Report uncollected waste instantly, track cleanup operations in real-time, and earn rewards for keeping your neighborhood clean.
          </p>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <button
              onClick={() => handleActionClick('/report')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.8rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Trash2 size={20} />
              <span>Report Waste Issue</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => handleActionClick('/dashboard')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.8rem',
                borderRadius: '12px',
                background: 'var(--card-bg, rgba(255, 255, 255, 0.05))',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '1rem',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <BarChart3 size={20} />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Metrics Banner */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto 4rem',
        padding: '0 1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          padding: '2rem',
          borderRadius: '16px',
          background: 'var(--card-bg, rgba(255, 255, 255, 0.03))',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
          backdropFilter: 'blur(10px)'
        }}>
          {[
            { icon: CheckCircle2, label: 'Resolution Rate', value: '98.4%', color: '#10b981' },
            { icon: Trash2, label: 'Cleaned Locations', value: '12,450+', color: '#3b82f6' },
            { icon: Zap, label: 'Avg. Response Time', value: '< 45 Mins', color: '#f59e0b' },
            { icon: Users, label: 'Active Citizens', value: '8,900+', color: '#8b5cf6' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <stat.icon size={26} color={stat.color} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #9ca3af)', marginTop: '0.2rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* User Portals Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 5rem', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Portals Tailored for Everyone</h2>
          <p style={{ color: 'var(--text-secondary, #9ca3af)' }}>Dedicated dashboards designed for citizens, cleanup crews, and municipal administrators.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}
        >
          {/* Citizen Card */}
          <motion.div variants={itemVariants} style={{
            padding: '2rem',
            borderRadius: '16px',
            background: 'var(--card-bg, rgba(255, 255, 255, 0.03))',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Smartphone size={24} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.6rem' }}>Citizen Portal</h3>
              <p style={{ color: 'var(--text-secondary, #9ca3af)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Snap a photo, add geotagged location, and submit waste reports. Track progress live and earn EcoPoints for active participation.
              </p>
            </div>
            <button
              onClick={() => handleActionClick('/dashboard')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.2rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                width: 'fit-content'
              }}
            >
              <span>Access Citizen Portal</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Worker Card */}
          <motion.div variants={itemVariants} style={{
            padding: '2rem',
            borderRadius: '16px',
            background: 'var(--card-bg, rgba(255, 255, 255, 0.03))',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Truck size={24} color="#3b82f6" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.6rem' }}>Sanitation Worker Portal</h3>
              <p style={{ color: 'var(--text-secondary, #9ca3af)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                View assigned cleanup tasks, optimize route paths, upload resolution proof, and mark tasks completed seamlessly.
              </p>
            </div>
            <button
              onClick={() => handleActionClick('/dashboard')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.2rem',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                width: 'fit-content'
              }}
            >
              <span>Access Worker Portal</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Key Features Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 6rem', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Key Platform Features</h2>
          <p style={{ color: 'var(--text-secondary, #9ca3af)' }}>Smart solutions built for modern waste management ecosystems.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { icon: MapPin, title: 'Geotagged Reporting', desc: 'Pinpoint precise coordinates automatically via GPS for rapid dispatch.' },
            { icon: Activity, title: 'Real-time Tracking', desc: 'Track complaint status from pending to resolved with live notifications.' },
            { icon: Award, title: 'Eco Points & Rewards', desc: 'Earn points for verified reports and redeem environmental badges.' },
            { icon: ShieldCheck, title: 'AI Verification', desc: 'Automated AI image analysis to categorize and prioritize critical waste.' },
          ].map((feat, index) => (
            <div key={index} style={{
              padding: '1.8rem',
              borderRadius: '12px',
              background: 'var(--card-bg, rgba(255, 255, 255, 0.02))',
              border: '1px solid var(--border-color, rgba(255, 255, 255, 0.06))',
            }}>
              <feat.icon size={28} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{feat.title}</h4>
              <p style={{ color: 'var(--text-secondary, #9ca3af)', fontSize: '0.9rem', lineHeight: 1.5 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Simple Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-secondary, #9ca3af)',
        fontSize: '0.9rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            <Trash2 size={20} color="#10b981" />
            <span>EcoClean Smart Waste Management</span>
          </div>
          <p>© {new Date().getFullYear()} EcoClean Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
