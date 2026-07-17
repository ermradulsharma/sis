import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: mongoose.Types.ObjectId;
  assigneeId?: mongoose.Types.ObjectId;
  estimatedHours?: number;
  dueDate?: Date;
  order: number; // for Kanban board ordering
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'done'],
      default: 'todo',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    estimatedHours: {
      type: Number,
      min: 0,
    },
    dueDate: {
      type: Date,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize querying tasks for a specific project
taskSchema.index({ projectId: 1, status: 1, order: 1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);
