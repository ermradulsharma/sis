import mongoose, { Schema, Document, Types } from 'mongoose';
import type { AuditAction } from '@/types';

export interface IActivityLog extends Document {
  userId: Types.ObjectId;
  action: AuditAction;
  module: string;
  entity: string;
  entityId?: Types.ObjectId;
  changes?: Record<string, { from: unknown; to: unknown }>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'login', 'logout', 'view', 'export'],
      required: [true, 'Action is required'],
    },
    module: {
      type: String,
      required: [true, 'Module is required'],
      trim: true,
    },
    entity: {
      type: String,
      required: [true, 'Entity is required'],
      trim: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    changes: {
      type: Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

/** Indexes for common query patterns. */
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ module: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1 });

const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
