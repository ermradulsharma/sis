import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  industry?: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  taxId?: string;
  accountManager?: mongoose.Types.ObjectId;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, trim: true },
    website: { type: String, trim: true },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    taxId: { type: String, trim: true },
    accountManager: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

customerSchema.index({ status: 1 });
customerSchema.index({ accountManager: 1 });
customerSchema.index({ name: 'text' });

const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', customerSchema);

export default Customer;
