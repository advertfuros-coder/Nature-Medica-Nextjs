'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Package, Gift, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/user/notifications');
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/user/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`/api/user/notifications/${id}`, { method: 'DELETE' });
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return Package;
      case 'offer': return Gift;
      case 'alert': return AlertCircle;
      default: return Bell;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'order': return 'bg-blue-50 text-blue-600';
      case 'offer': return 'bg-yellow-50 text-yellow-600';
      case 'alert': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3a5d1e] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Notifications</h1>
        </div>
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
            {notifications.filter(n => !n.read).length} New
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-sm text-gray-600">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const iconColor = getIconColor(notification.type);

            return (
              <div
                key={notification._id}
                onClick={() => !notification.read && markAsRead(notification._id)}
                className={`bg-white rounded-xl p-4 ${!notification.read ? 'border-2 border-[#3a5d1e]' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-[#3a5d1e] rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}