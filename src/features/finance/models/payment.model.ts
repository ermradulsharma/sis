import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  invoiceId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  amount: number;
  paymentDate: Date;
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'check';
  referenceNumber?: string;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true, default: Date.now },
    method: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'cash', 'check'],
      required: true,
    },
    referenceNumber: { type: String },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed',
    },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Indexes
PaymentSchema.index({ invoiceId: 1 });
PaymentSchema.index({ customerId: 1 });
PaymentSchema.index({ paymentDate: -1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
