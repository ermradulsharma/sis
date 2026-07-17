import mongoose, { Schema, Document } from 'mongoose';

export interface IFollowUp extends Document {
  entityType: 'Lead' | 'Customer' | 'Opportunity';
  entityId: mongoose.Types.ObjectId;
  type: 'call' | 'email' | 'meeting' | 'note';
  notes: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const followUpSchema = new Schema<IFollowUp>(
  {
    entityType: {
      type: String,
      enum: ['Lead', 'Customer', 'Opportunity'],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, required: true },
    type: {
      type: String,
      enum: ['call', 'email', 'meeting', 'note'],
      required: true,
    },
    notes: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'completed',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

followUpSchema.index({ entityType: 1, entityId: 1 });
followUpSchema.index({ assignedTo: 1 });
followUpSchema.index({ date: 1 });
followUpSchema.index({ status: 1 });

const FollowUp = mongoose.models.FollowUp || mongoose.model<IFollowUp>('FollowUp', followUpSchema);

export default FollowUp;
