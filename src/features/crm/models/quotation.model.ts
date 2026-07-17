import mongoose, { Schema, Document } from 'mongoose';

export interface IQuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IQuotation extends Document {
  opportunityId: mongoose.Types.ObjectId;
  quotationNumber: string;
  items: IQuotationItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const quotationItemSchema = new Schema<IQuotationItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
});

const quotationSchema = new Schema<IQuotation>(
  {
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    quotationNumber: { type: String, required: true, unique: true },
    items: [quotationItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'rejected'],
      default: 'draft',
    },
    validUntil: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

quotationSchema.index({ opportunityId: 1 });
quotationSchema.index({ quotationNumber: 1 }, { unique: true });
quotationSchema.index({ status: 1 });

const Quotation = mongoose.models.Quotation || mongoose.model<IQuotation>('Quotation', quotationSchema);

export default Quotation;
