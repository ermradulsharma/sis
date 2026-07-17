'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FollowUpsFeed } from '@/components/data/FollowUpsFeed';
import { apiService } from '@/services/api.service';
import { ArrowLeft, Mail, Phone, Building2, Calendar, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLead = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<any>(`/crm/leads/${params.id}`);
      if (response.success && response.data) {
        setLead(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch lead:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  if (isLoading) {
    return (
      <ContentArea>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
        </div>
      </ContentArea>
    );
  }

  if (!lead) {
    return (
      <ContentArea>
        <div className="text-center mt-12 text-slate-400">Lead not found.</div>
      </ContentArea>
    );
  }

  return (
    <ContentArea>
      <div className="mb-6">
        <button 
          onClick={() => router.push('/crm/leads')}
          className="flex items-center text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leads
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 text-xl font-bold">
                {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{lead.firstName} {lead.lastName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={lead.status === 'converted' ? 'success' : lead.status === 'lost' ? 'error' : 'info'}>
                    {lead.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {lead.companyName && (
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-slate-500 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-300">Company</div>
                    <div className="text-sm text-slate-400">{lead.companyName}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-slate-500 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-slate-300">Email</div>
                  <div className="text-sm text-slate-400">
                    <a href={`mailto:${lead.email}`} className="text-indigo-400 hover:underline">{lead.email}</a>
                  </div>
                </div>
              </div>

              {lead.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-slate-500 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-300">Phone</div>
                    <div className="text-sm text-slate-400">
                      <a href={`tel:${lead.phone}`} className="text-indigo-400 hover:underline">{lead.phone}</a>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-500 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-slate-300">Created</div>
                  <div className="text-sm text-slate-400">{format(new Date(lead.createdAt), 'MMMM d, yyyy')}</div>
                </div>
              </div>
            </div>

            {lead.status !== 'converted' && (
              <div className="mt-8 pt-6 border-t border-slate-800">
                <Button className="w-full" variant="primary" leftIcon={<UserCheck className="h-4 w-4" />}>
                  Convert to Customer
                </Button>
              </div>
            )}
          </div>
          
          {lead.notes && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Notes</h3>
              <p className="text-sm text-slate-400 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column: Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <FollowUpsFeed entityType="Lead" entityId={params.id as string} />
          </div>
        </div>

      </div>
    </ContentArea>
  );
}
