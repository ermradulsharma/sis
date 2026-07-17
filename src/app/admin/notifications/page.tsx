'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/services/api.service';
import { toast } from '@/stores/notification.store';
import { Bell, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<any[]>('/notifications?limit=50');
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      const response = await apiService.put('/notifications', { notificationIds: [id], read: true });
      if (response.success) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (error) {
      toast.error('Error', 'Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    if (unreadIds.length === 0) return;

    try {
      const response = await apiService.put('/notifications', { notificationIds: unreadIds, read: true });
      if (response.success) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.success('Success', 'All notifications marked as read');
      }
    } catch (error) {
      toast.error('Error', 'Failed to mark all as read');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'system': return <Info className="h-5 w-5 text-blue-400" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'message': return <Bell className="h-5 w-5 text-indigo-400" />;
      default: return <Bell className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <ContentArea>
      <PageHeader
        title="Notifications"
        description="View all system alerts, updates, and messages."
        actions={
          <Button 
            variant="outline" 
            leftIcon={<CheckCircle className="h-4 w-4" />}
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        }
      />

      <div className="mt-6 max-w-4xl space-y-4">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 py-16">
            <Bell className="h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300">No notifications</h3>
            <p className="text-sm text-slate-500">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                notification.read 
                  ? 'border-slate-800 bg-slate-900/30' 
                  : 'border-indigo-500/30 bg-indigo-500/5'
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${notification.read ? 'text-slate-300' : 'text-slate-100'}`}>
                  {notification.title}
                </h4>
                <p className="mt-1 text-sm text-slate-400">{notification.message}</p>
                <span className="mt-2 block text-xs text-slate-500">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </div>
              {!notification.read && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => markAsRead(notification._id)}
                >
                  Mark read
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </ContentArea>
  );
}
