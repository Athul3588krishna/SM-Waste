import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import API from '../utils/api';

export const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  
  // Settings
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    return localStorage.getItem('ecoclean_sound_enabled') !== 'false';
  });

  const [desktopNotifEnabled, setDesktopNotifEnabledState] = useState(() => {
    return localStorage.getItem('ecoclean_desktop_notif') === 'true' && Notification?.permission === 'granted';
  });

  const socketRef = useRef(null);

  const setSoundEnabled = (val) => {
    setSoundEnabledState(val);
    localStorage.setItem('ecoclean_sound_enabled', val ? 'true' : 'false');
  };

  const setDesktopNotifEnabled = async (val) => {
    if (val) {
      if ('Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setDesktopNotifEnabledState(true);
          localStorage.setItem('ecoclean_desktop_notif', 'true');
        } else {
          setDesktopNotifEnabledState(false);
          localStorage.setItem('ecoclean_desktop_notif', 'false');
          alert('Notification permission was denied in your browser settings.');
        }
      }
    } else {
      setDesktopNotifEnabledState(false);
      localStorage.setItem('ecoclean_desktop_notif', 'false');
    }
  };

  // Web Audio API chime player
  const playNotificationSound = useCallback((type = 'info') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playNote = (frequency, startTime, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type === 'success' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(frequency, startTime);
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      const now = audioCtx.currentTime;
      if (type === 'success' || type === 'completed') {
        playNote(523.25, now, 0.12); // C5
        playNote(659.25, now + 0.1, 0.12); // E5
        playNote(783.99, now + 0.2, 0.25); // G5
      } else if (type === 'warning') {
        playNote(440, now, 0.15); // A4
        playNote(349.23, now + 0.12, 0.25); // F4
      } else {
        playNote(523.25, now, 0.12); // C5
        playNote(659.25, now + 0.1, 0.2); // E5
      }
    } catch (err) {
      console.warn('Audio playback not permitted yet:', err.message);
    }
  }, [soundEnabled]);

  // Desktop Notification Trigger
  const triggerDesktopNotification = useCallback((title, body) => {
    if (desktopNotifEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.warn('Desktop notification error:', err);
      }
    }
  }, [desktopNotifEnabled]);

  // Fetch persistent notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to load notifications:', error.message);
    }
  }, [user]);

  // Toast Queue Helpers
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', complaintId = null, duration = 6000 }) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, title, message, type, complaintId, createdAt: Date.now() };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Keep max 5 active toasts
    playNotificationSound(type);
    triggerDesktopNotification(title, message);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [playNotificationSound, triggerDesktopNotification, removeToast]);

  // API Notification Actions
  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const clearNotifications = async () => {
    try {
      await API.delete('/notifications/clear-all');
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Setup Socket Connection
  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    fetchNotifications();

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5002';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    const joinRooms = () => {
      const uId = (user._id || user.id)?.toString();
      if (uId) {
        newSocket.emit('join', uId);
      }
      if (user.role) {
        newSocket.emit('join_role', user.role);
      }
    };

    if (newSocket.connected) {
      setIsConnected(true);
      joinRooms();
    }

    newSocket.on('connect', () => {
      setIsConnected(true);
      joinRooms();
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', () => {
      setIsConnected(false);
    });

    // Core Socket Event Listeners
    newSocket.on('complaint_updated', () => {
      fetchNotifications();
    });
    newSocket.on('new_complaint', (data) => {
      addToast({
        title: 'New Waste Report 📍',
        message: `A ${data.severity} severity ${data.wasteType} report was submitted by ${data.citizenName || 'a citizen'}: "${data.title}"`,
        type: 'warning',
        complaintId: data._id
      });
      fetchNotifications();
    });

    newSocket.on('new_task_assigned', (data) => {
      addToast({
        title: data.title || 'New Task Assigned 👷',
        message: data.message || 'You have been assigned a new cleanup task.',
        type: 'info',
        complaintId: data.complaintId
      });
      fetchNotifications();
    });

    newSocket.on('complaint_status_updated', (data) => {
      addToast({
        title: data.title || 'Report Status Updated ⚙️',
        message: data.message || 'Your reported complaint status has changed.',
        type: data.status === 'rejected' ? 'warning' : 'info',
        complaintId: data.complaintId
      });
      fetchNotifications();
    });

    newSocket.on('task_in_progress', (data) => {
      addToast({
        title: data.title || 'Task In Progress 🛠️',
        message: data.message || 'Sanitation worker has started cleaning.',
        type: 'info',
        complaintId: data.complaintId
      });
      fetchNotifications();
    });

    newSocket.on('task_cleaned', (data) => {
      addToast({
        title: 'Cleanup Submitted 🧹',
        message: data.message || 'Worker completed cleanup and uploaded photos.',
        type: 'success',
        complaintId: data.complaintId
      });
      fetchNotifications();
    });

    newSocket.on('complaint_completed', (data) => {
      addToast({
        title: 'Cleanup Verified & Points Awarded 🎉',
        message: data.message || 'Your report was verified and points were awarded!',
        type: 'success',
        complaintId: data.complaintId
      });
      fetchNotifications();
    });

    newSocket.on('points_updated', (data) => {
      addToast({
        title: data.title || 'Eco-Points Updated 🏆',
        message: data.message || 'You have received points for your contribution.',
        type: 'success'
      });
      fetchNotifications();
    });

    newSocket.on('new_announcement', (data) => {
      addToast({
        title: 'Municipal Notice 📢',
        message: `"${data.title}": ${data.content}`,
        type: 'announcement'
      });
      fetchNotifications();
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    };
  }, [user, addToast, fetchNotifications]);

  const value = {
    socket,
    isConnected,
    notifications,
    toasts,
    soundEnabled,
    setSoundEnabled,
    desktopNotifEnabled,
    setDesktopNotifEnabled,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addToast,
    removeToast,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
