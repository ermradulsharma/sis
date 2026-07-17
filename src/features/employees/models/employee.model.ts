import mongoose, { Schema, Document, Types } from 'mongoose';
import type { EmploymentType, EntityStatus, Address } from '@/types';

export interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface IEmployee extends Document {
  userId?: Types.ObjectId;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  departmentId: Types.ObjectId;
  branchId: Types.ObjectId;
  employmentType: EmploymentType;
  joiningDate: Date;
  salary: number;
  status: EntityStatus;
  address?: Address;
  emergencyContact?: IEmergencyContact;
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

const EmergencyContactSubSchema = new Schema<IEmergencyContact>(
  {
    name: { type: String, trim: true },
    relationship: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { _id: false },
);

const EmployeeSchema = new Schema<IEmployee>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: [true, 'Branch is required'],
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'intern'],
      default: 'full-time',
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    salary: {
      type: Number,
      default: 0,
      min: [0, 'Salary cannot be negative'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    address: {
      type: AddressSubSchema,
      default: null,
    },
    emergencyContact: {
      type: EmergencyContactSubSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/** Virtual for full name. */
EmployeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/** Ensure virtuals are included in JSON output. */
EmployeeSchema.set('toJSON', { virtuals: true });
EmployeeSchema.set('toObject', { virtuals: true });

/** Indexes for common queries. */
EmployeeSchema.index({ departmentId: 1 });
EmployeeSchema.index({ branchId: 1 });
EmployeeSchema.index({ status: 1 });
EmployeeSchema.index({ employeeId: 1 });

const Employee = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
