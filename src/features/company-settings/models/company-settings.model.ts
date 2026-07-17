import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanySettings extends Document {
  companyName: string;
  logo: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  website: string;
  taxId: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  updatedAt: Date;
}

const CompanySettingsSchema = new Schema<ICompanySettings>(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    logo: { type: String, default: '' },
    email: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zipCode: { type: String, default: '' },
    },
    website: { type: String, trim: true, default: '' },
    taxId: { type: String, trim: true, default: '' },
    timezone: { type: String, default: 'UTC' },
    currency: { type: String, default: 'USD' },
    dateFormat: { type: String, default: 'MMM dd, yyyy' },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
      website: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  },
);

const CompanySettings =
  mongoose.models.CompanySettings ||
  mongoose.model<ICompanySettings>('CompanySettings', CompanySettingsSchema);

export default CompanySettings;
