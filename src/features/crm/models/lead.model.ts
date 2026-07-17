import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  companyName?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
  source?: string;
  assignedTo?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    companyName: { type: String, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'lost', 'converted'],
      default: 'new',
    },
    source: { type: String, trim: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true }
);

// Indexes for common queries
leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ email: 1 });

const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', leadSchema);

export default Lead;
