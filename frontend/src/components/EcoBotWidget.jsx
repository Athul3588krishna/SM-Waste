import React, { useState, useRef, useEffect, useContext } from 'react';
import API from '../utils/api';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const EcoBotWidget = () => {
  const { user } = useContext(AuthContext);
  const userRole = user ? user.role : 'guest';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am EcoBot, your Perinthalmanna municipal AI sanitation assistant. How can I help you keep our city clean today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const getGreeting = (role) => {
      if (role === 'admin') {
        return 'Hello Admin! I am EcoBot, your administrative advisor. How can I help you manage municipal reports, assignments, or analytics today?';
      }
      if (role === 'worker') {
        return 'Hello field crew! I am EcoBot, your field guide. Ask me about tasks, cleanup verification uploads, or safety rules.';
      }
      return 'Hello! I am EcoBot, your Perinthalmanna municipal AI sanitation assistant. How can I help you keep our city clean today?';
    };

    if (messages.length === 1) {
      setMessages([
        {
          sender: 'bot',
          text: getGreeting(userRole)
        }
      ]);
    }
  }, [userRole]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const { data } = await API.post('/complaints/chat', {
        message: userMessage.text,
        history: messages,
        role: userRole
      });

      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, I am facing connectivity issues at the moment. Please try again later.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, fontFamily: 'sans-serif' }}>
      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="glass-panel" 
            style={{
              position: 'absolute',
              bottom: '70px',
              right: '0',
              width: '340px',
              height: '440px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              background: 'rgba(10, 14, 23, 0.9)',
              padding: '0'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-glass)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={20} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>EcoBot Assistant</div>
                  <div style={{ fontSize: '10px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></span>
                    Online
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages List */}
            <div style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {messages.map((msg, index) => (
                <div key={index} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: msg.sender === 'user' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '13px',
                    lineHeight: '1.4'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <Loader2 size={12} className="animate-spin" />
                  EcoBot is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Input */}
            <form onSubmit={handleSend} style={{
              padding: '12px',
              borderTop: '1px solid var(--border-glass)',
              display: 'flex',
              gap: '8px'
            }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  userRole === 'admin' ? "Ask about assignments, analytics, stats..." :
                  userRole === 'worker' ? "Ask about tasks, photos, safety rules..." :
                  "Ask anything about waste/points..."
                }
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button 
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
          zIndex: 1000
        }}
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  );
};

export default EcoBotWidget;
