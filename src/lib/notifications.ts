import dbConnect from '@/lib/db';
import Notification from '@/features/notifications/models/notification.model';
import mongoose from 'mongoose';

interface CreateNotificationParams {
  recipientId: string | mongoose.Types.ObjectId;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  linkUrl?: string;
  relatedEntityId?: string | mongoose.Types.ObjectId;
  relatedEntityType?: string;
}

export const createNotification = async (params: CreateNotificationParams) => {
  try {
    await dbConnect();
    
    const notification = await Notification.create({
      recipientId: params.recipientId,
      title: params.title,
      message: params.message,
      type: params.type || 'info',
      linkUrl: params.linkUrl,
      relatedEntityId: params.relatedEntityId,
      relatedEntityType: params.relatedEntityType,
      read: false
    });
    
    return notification;
  } catch (error) {
    console.error('Failed to create notification system event:', error);
    return null;
  }
};
