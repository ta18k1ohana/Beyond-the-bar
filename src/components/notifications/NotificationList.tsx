import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  type Notification
} from '../../services/notification.service';

export const NotificationList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const notifs = await getUserNotifications(user.uid);
      setNotifications(notifs);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      await markAllAsRead(user.uid);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'badge_earned':
      case 'badge_upgraded':
        return '🏆';
      case 'review_received':
        return '⭐';
      case 'review_verification_pending':
        return '🤝';
      case 'review_verified':
        return '✅';
      default:
        return '🔔';
    }
  };

  const getNotificationLink = (notification: Notification): string => {
    switch (notification.type) {
      case 'badge_earned':
      case 'badge_upgraded':
        return '/badges';
      case 'review_received':
        return '/profile';
      case 'review_verification_pending':
        return '/verify-reviews';
      case 'review_verified':
        return '/profile';
      default:
        return '/profile';
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-600">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--color-coffee-primary)] font-heading">
          Notifications
        </h2>
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-[var(--color-coffee-accent)] hover:underline text-sm font-semibold"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications */}
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-3">🔔</div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No notifications yet</h3>
          <p className="text-gray-600">
            We'll notify you when you earn badges, receive reviews, and more!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <Link
              key={notification.id}
              to={getNotificationLink(notification)}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              className={`block border rounded-lg p-4 transition-all hover:shadow-md ${
                notification.read
                  ? 'bg-white border-gray-200'
                  : 'bg-[var(--color-coffee-accent)] bg-opacity-10 border-[var(--color-coffee-accent)]'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[var(--color-coffee-text)] mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-[var(--color-coffee-accent)] rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
