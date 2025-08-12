import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { toast } from 'sonner';
import { 
  doc,
  updateDoc,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Bell, X, Mail, User, Clock, Check, MessageCircle } from 'lucide-react';

function NotificationSystem() {
  const { currentUser } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, clearAllNotifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const notificationRef = useRef(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleDismissNotification = async (notification) => {
    try {
      setActionLoading(true);
      const projectRef = doc(db, 'projects', notification.projectId);
      await updateDoc(projectRef, {
        joinRequests: arrayRemove(notification.request)
      });
      markAsRead(notification.id);
      toast.success('Request dismissed successfully');
    } catch (error) {
      console.error('Error dismissing notification:', error);
      toast.error('Failed to dismiss request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptRequest = async (notification) => {
    try {
      setActionLoading(true);
      // For now, we'll just dismiss the notification
      // In a full implementation, you might want to add the user to a 'team' field
      await handleDismissNotification(notification);
      
      toast.success(`Accepted ${notification.request.userName}'s request!`);
      
      // Send email notification (this would be handled by a backend service)
      window.location.href = `mailto:${notification.request.userEmail}?subject=Accepted: ${notification.projectTitle}&body=Hi ${notification.request.userName},%0D%0A%0D%0AGreat news! I'd love to have you join my project "${notification.projectTitle}". Let's discuss the next steps.%0D%0A%0D%0ABest regards`;
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAll = () => {
    clearAllNotifications();
    toast.success('All notifications cleared');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative" ref={notificationRef}>
      <Button
        onClick={() => setShowNotifications(!showNotifications)}
        variant="ghost"
        size="sm"
        className="relative p-2 hover:bg-gray-100 transition-colors"
        disabled={loading || actionLoading}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    onClick={handleClearAll}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-600 hover:text-gray-900"
                    disabled={actionLoading}
                  >
                    Clear all
                  </Button>
                )}
                <Button
                  onClick={() => setShowNotifications(false)}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} new {unreadCount === 1 ? 'request' : 'requests'}
              </p>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No notifications</p>
                <p className="text-sm mt-1">You'll see join requests here when people want to collaborate on your projects.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex-shrink-0">
                            {notification.request.userPhoto ? (
                              <img
                                src={notification.request.userPhoto}
                                alt={notification.request.userName}
                                className="h-6 w-6 rounded-full"
                              />
                            ) : (
                              <User className="h-6 w-6 text-blue-600" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 truncate">
                            {notification.request.userName}
                          </span>
                          <span className="text-sm text-gray-500">wants to join</span>
                        </div>
                        
                        <p className="text-sm font-medium text-gray-900 mb-2 truncate">
                          "{notification.projectTitle}"
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{notification.request.userEmail}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(notification.timestamp)}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(notification)}
                            disabled={actionLoading}
                            className="flex items-center space-x-1"
                          >
                            <Check className="h-3 w-3" />
                            <span>Accept</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              window.location.href = `mailto:${notification.request.userEmail}?subject=Re: ${notification.projectTitle}&body=Hi ${notification.request.userName},%0D%0A%0D%0AThank you for your interest in joining my project "${notification.projectTitle}". I'd love to discuss this further with you.%0D%0A%0D%0ABest regards`;
                            }}
                            disabled={actionLoading}
                            className="flex items-center space-x-1"
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span>Reply</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismissNotification(notification)}
                            disabled={actionLoading}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <p className="text-xs text-gray-500 text-center">
                Click "Accept" to approve the request or "Reply" to discuss further
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationSystem;

