import mongoose, { Schema, Document } from 'mongoose';
import type { EntityStatus, Address } from '@/types';

export interface IBranch extends Document {
  name: string;
  code: string;
  address: Address;
  phone: string;
  email: string;
  isHeadquarters: boolean;
  status: EntityStatus;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSubSchema = new Schema<Address>(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zipCode: { type: String, trim: true },
  },
  { _id: false },
);

const BranchSchema = new Schema<IBranch>(
  {
    name: {
      type: String,
      required: [true, 'Branch name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Branch code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    address: {
      type: AddressSubSchema,
      default: {},
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    isHeadquarters: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

BranchSchema.index({ code: 1 });

const Branch = mongoose.models.Branch || mongoose.model<IBranch>('Branch', BranchSchema);

export default Branch;
