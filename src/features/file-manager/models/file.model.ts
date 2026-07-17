import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFile extends Document {
  originalName: string;
  storedName: string;
  path: string;
  mimeType: string;
  size: number;
  uploadedBy: Types.ObjectId;
  module?: string;
  entityId?: Types.ObjectId;
  createdAt: Date;
}

const FileSchema = new Schema<IFile>(
  {
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    storedName: {
      type: String,
      required: [true, 'Stored file name is required'],
      trim: true,
    },
    path: {
      type: String,
      required: [true, 'File path is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size cannot be negative'],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    module: {
      type: String,
      default: null,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ module: 1, entityId: 1 });

const File = mongoose.models.File || mongoose.model<IFile>('File', FileSchema);

export default File;
