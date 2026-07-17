import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  employeeId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'pending' | 'paid';
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollSchema = new Schema<IPayroll>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netPay: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paymentDate: { type: Date },
  },
  { timestamps: true }
);

PayrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.Payroll || mongoose.model<IPayroll>('Payroll', PayrollSchema);
