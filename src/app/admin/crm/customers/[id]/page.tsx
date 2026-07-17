'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FollowUpsFeed } from '@/components/data/FollowUpsFeed';
import { apiService } from '@/services/api.service';
import { ArrowLeft, Building, Globe, MapPin, Mail, Phone } from 'lucide-react';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchCustomer = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<any>(`/crm/customers/${params.id}`);
      if (response.success && response.data) {
        setCustomer(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  if (isLoading) {
    return (
      <ContentArea>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
        </div>
      </ContentArea>
    );
  }

  if (!customer) {
    return (
      <ContentArea>
        <div className="text-center mt-12 text-slate-400">Customer not found.</div>
      </ContentArea>
    );
  }

  return (
    <ContentArea>
      <div className="mb-6">
        <button 
          onClick={() => router.push('/crm/customers')}
          className="flex items-center text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
        </button>
      </div>

      {/* Header Profile */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Building className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant={customer.status === 'active' ? 'success' : 'default'}>
                  {customer.status === 'active' ? 'Active Account' : 'Inactive'}
                </Badge>
                {customer.industry && (
                  <span className="text-sm text-slate-400">{customer.industry}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline">Edit Profile</Button>
            <Button>New Opportunity</Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['overview', 'contacts', 'opportunities', 'quotations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium capitalize
                ${activeTab === tab
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Fixed Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Contact Information</h3>
            <div className="space-y-4">
              {customer.website && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-slate-500 shrink-0" />
                  <div>
                    <div className="text-sm text-slate-400">
                      <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                        {customer.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              {customer.address?.city && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-500 shrink-0" />
                  <div>
                    <div className="text-sm text-slate-400">
                      {customer.address.street && <div>{customer.address.street}</div>}
                      <div>{customer.address.city}, {customer.address.state} {customer.address.zipCode}</div>
                      <div>{customer.address.country}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {customer.accountManager && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Account Manager</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-medium">
                    {customer.accountManager.firstName.charAt(0)}{customer.accountManager.lastName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{customer.accountManager.firstName} {customer.accountManager.lastName}</div>
                    <div className="text-xs text-slate-500">{customer.accountManager.email}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <FollowUpsFeed entityType="Customer" entityId={params.id as string} />
            </div>
          )}
          
          {activeTab === 'contacts' && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-500">
              <p>Contacts linked to this customer will appear here.</p>
              {/* Note: In a full app, we'd render a DataTable component querying the Contacts API with ?customerId=X */}
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-500">
              <p>Sales pipeline opportunities will appear here.</p>
            </div>
          )}

          {activeTab === 'quotations' && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-500">
              <p>Quotations sent to this customer will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </ContentArea>
  );
}
