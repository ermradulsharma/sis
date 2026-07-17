import mongoose, { Schema, Document } from 'mongoose';

export type PipelineStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';

export interface IOpportunity extends Document {
  title: string;
  customerId?: mongoose.Types.ObjectId;
  leadId?: mongoose.Types.ObjectId;
  value: number;
  stage: PipelineStage;
  probability: number;
  expectedCloseDate?: Date;
  assignedTo?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const opportunitySchema = new Schema<IOpportunity>(
  {
    title: { type: String, required: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
    value: { type: Number, required: true, min: 0 },
    stage: {
      type: String,
      enum: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
      default: 'prospecting',
    },
    probability: { type: Number, min: 0, max: 100, default: 10 },
    expectedCloseDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true }
);

opportunitySchema.index({ stage: 1 });
opportunitySchema.index({ customerId: 1 });
opportunitySchema.index({ leadId: 1 });
opportunitySchema.index({ assignedTo: 1 });
opportunitySchema.index({ expectedCloseDate: 1 });

const Opportunity = mongoose.models.Opportunity || mongoose.model<IOpportunity>('Opportunity', opportunitySchema);

export default Opportunity;
