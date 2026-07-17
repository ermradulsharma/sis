import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Role description is required'],
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

RoleSchema.index({ name: 1 });

const Role = mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);

export default Role;
