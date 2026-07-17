import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  description?: string;
  category: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, index: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, default: 0 },
    minStockLevel: { type: Number, required: true, default: 10 },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
