import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  featuredImage?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    tags: [{ type: String }],
    featuredImage: { type: String },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1 });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
