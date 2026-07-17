import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  ticketNumber: string;
  customerId: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    ticketNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['open', 'pending', 'resolved', 'closed'], 
      default: 'open',
      index: true 
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', ticketSchema);
