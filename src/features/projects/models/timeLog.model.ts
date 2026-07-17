import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeLog extends Document {
  taskId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  hours: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const timeLogSchema = new Schema<ITimeLog>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    hours: {
      type: Number,
      required: true,
      min: [0.1, 'Hours must be greater than 0'],
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes for reporting
timeLogSchema.index({ projectId: 1, userId: 1 });
timeLogSchema.index({ date: -1 });

export default mongoose.models.TimeLog || mongoose.model<ITimeLog>('TimeLog', timeLogSchema);
