import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  company?: string;
  role?: string;
  content: string;
  rating: number;
  image?: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema(
  {
    clientName: { type: String, required: true },
    company: { type: String },
    role: { type: String },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: { type: String },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TestimonialSchema.index({ isFeatured: -1 });

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
