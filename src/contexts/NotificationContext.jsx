import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  collection, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'projects'),
      where('authorEmail', '==', currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allNotifications = [];
      querySnapshot.forEach((doc) => {
        const project = { id: doc.id, ...doc.data() };
        if (project.joinRequests && project.joinRequests.length > 0) {
          project.joinRequests.forEach((request, index) => {
            allNotifications.push({
              id: `${project.id}-${index}`,
              projectId: project.id,
              projectTitle: project.title,
              request,
              type: 'join_request',
              timestamp: request.timestamp
            });
          });
        }
      });
      
      // Sort notifications by timestamp (newest first)
      allNotifications.sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp : a.timestamp.toDate();
        const timeB = b.timestamp instanceof Date ? b.timestamp : b.timestamp.toDate();
        return timeB - timeA;
      });
      
      setNotifications(allNotifications);
      setUnreadCount(allNotifications.length);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = (notificationId) => {
    // In a full implementation, you might want to mark notifications as read
    // For now, we'll just remove them from the list
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
} 