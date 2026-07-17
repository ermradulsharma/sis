import mongoose, { Schema, Document, Types } from 'mongoose';
import type { EntityStatus } from '@/types';

export interface IDepartment extends Document {
  name: string;
  code: string;
  description: string;
  headId?: Types.ObjectId;
  parentDepartmentId?: Types.ObjectId;
  status: EntityStatus;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    headId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    parentDepartmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
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

DepartmentSchema.index({ code: 1 });
DepartmentSchema.index({ status: 1 });

const Department =
  mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);

export default Department;
