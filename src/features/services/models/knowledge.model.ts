import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeArticle extends Document {
  title: string;
  content: string;
  category: string;
  isInternal: boolean;
  authorId: mongoose.Types.ObjectId;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeArticleSchema = new Schema<IKnowledgeArticle>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    isInternal: { type: Boolean, default: false }, // if true, only visible to employees
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

KnowledgeArticleSchema.index({ category: 1 });
KnowledgeArticleSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.KnowledgeArticle || mongoose.model<IKnowledgeArticle>('KnowledgeArticle', KnowledgeArticleSchema);
