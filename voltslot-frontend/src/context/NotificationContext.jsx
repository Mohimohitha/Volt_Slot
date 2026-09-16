import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('voltslot_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeToast, setActiveToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('voltslot_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = ({ title, message, type = 'success' }) => {
    const newNotif = {
      id: 'notif_' + Date.now(),
      title,
      message,
      type, // 'success' | 'refund' | 'info' | 'error'
      read: false,
      timestamp: new Date().toISOString()
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Trigger popup toast
    setActiveToast(newNotif);
    setTimeout(() => {
      setActiveToast((current) => (current?.id === newNotif.id ? null : current));
    }, 4500);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        clearNotifications,
        activeToast,
        dismissToast: () => setActiveToast(null)
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);