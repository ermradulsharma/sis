import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  customerId?: mongoose.Types.ObjectId;
  leadId?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    position: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Ensure a contact belongs to either a customer or a lead, but rarely both
contactSchema.index({ customerId: 1 });
contactSchema.index({ leadId: 1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);

export default Contact;
