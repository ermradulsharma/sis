'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/services/api.service';
import { toast } from '@/stores/notification.store';
import { Building, Save, Mail, Globe, Phone, MapPin } from 'lucide-react';

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiService.get<{ data: any }>('/settings/company');
        if (response.success && response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        toast.error('Error', 'Failed to load company settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      address: { ...(prev?.address || {}), [field]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await apiService.put<{ data: any }>('/settings/company', settings);
      if (response.success) {
        toast.success('Success', 'Company settings updated successfully');
        setSettings(response.data);
      }
    } catch (error) {
      toast.error('Error', 'Failed to update company settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ContentArea>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
        </div>
      </ContentArea>
    );
  }

  return (
    <ContentArea>
      <PageHeader
        title="Company Settings"
        description="Manage global configuration, company profile, and regional settings."
        actions={
          <Button 
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSave}
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        }
      />

      <div className="mx-auto mt-6 max-w-4xl space-y-8">
        {/* Basic Information */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="mb-6 text-lg font-medium text-white flex items-center gap-2">
            <Building className="h-5 w-5 text-indigo-400" />
            Company Profile
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">Company Name *</label>
              <Input
                value={settings?.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Registration Number</label>
              <Input
                value={settings?.registrationNumber || ''}
                onChange={(e) => handleChange('registrationNumber', e.target.value)}
                placeholder="e.g. 12345678"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Tax ID</label>
              <Input
                value={settings?.taxId || ''}
                onChange={(e) => handleChange('taxId', e.target.value)}
                placeholder="e.g. US-12345"
              />
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="mb-6 text-lg font-medium text-white flex items-center gap-2">
            <Phone className="h-5 w-5 text-indigo-400" />
            Contact Details
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Primary Email *</label>
              <Input
                type="email"
                leftIcon={<Mail className="h-4 w-4" />}
                value={settings?.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="admin@company.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Phone Number</label>
              <Input
                type="tel"
                value={settings?.contactPhone || ''}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">Website</label>
              <Input
                type="url"
                leftIcon={<Globe className="h-4 w-4" />}
                value={settings?.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://www.acme.com"
              />
            </div>
          </div>
        </section>

        {/* Regional Settings */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="mb-6 text-lg font-medium text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-400" />
            Regional Settings
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Timezone *</label>
              <select
                value={settings?.timezone || 'UTC'}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (US)</option>
                <option value="America/Los_Angeles">Pacific Time (US)</option>
                <option value="Europe/London">London (UK)</option>
                <option value="Asia/Dubai">Dubai (UAE)</option>
                <option value="Asia/Kolkata">India Standard Time</option>
                <option value="Asia/Singapore">Singapore Time</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Currency *</label>
              <select
                value={settings?.currency || 'USD'}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Date Format *</label>
              <select
                value={settings?.dateFormat || 'YYYY-MM-DD'}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
          </div>
        </section>

      </div>
    </ContentArea>
  );
}
