import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  title: string;
  amount: number;
  category: 'software' | 'travel' | 'office_supplies' | 'marketing' | 'other';
  expenseDate: Date;
  incurredBy?: mongoose.Types.ObjectId; // Employee reference
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
  receiptUrl?: string;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      enum: ['software', 'travel', 'office_supplies', 'marketing', 'other'],
      required: true,
    },
    expenseDate: { type: Date, required: true, default: Date.now },
    incurredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'reimbursed'],
      default: 'pending',
    },
    receiptUrl: { type: String },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ status: 1 });
ExpenseSchema.index({ expenseDate: -1 });

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
