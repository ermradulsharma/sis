import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  invoiceNumber: string;
  customerId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    amount: { type: Number, required: true, min: 0 },
    status: { 
      type: String, 
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], 
      default: 'draft',
      index: true 
    },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', invoiceSchema);
