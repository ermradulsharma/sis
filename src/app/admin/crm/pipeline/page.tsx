'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContentArea } from '@/components/layout/ContentArea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiService } from '@/services/api.service';
import { format } from 'date-fns';
import { Plus, GripVertical, Building2, User, Clock, DollarSign } from 'lucide-react';
import { SlideOver } from '@/components/ui/SlideOver';
import { OpportunityForm } from '@/features/crm/components/OpportunityForm';

const PIPELINE_STAGES = [
  { id: 'prospecting', label: 'Prospecting', color: 'bg-slate-800 border-slate-700' },
  { id: 'qualification', label: 'Qualification', color: 'bg-indigo-900/40 border-indigo-800' },
  { id: 'proposal', label: 'Proposal', color: 'bg-blue-900/40 border-blue-800' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-amber-900/40 border-amber-800' },
  { id: 'closed-won', label: 'Closed Won', color: 'bg-emerald-900/40 border-emerald-800' },
  { id: 'closed-lost', label: 'Closed Lost', color: 'bg-rose-900/40 border-rose-800' },
];

export default function PipelinePage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<any[]>('/crm/opportunities?limit=100');
      if (response.success && response.data) {
        setOpportunities(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    setIsDragging(false);
    const oppId = e.dataTransfer.getData('text/plain');
    if (!oppId) return;

    const oppToMove = opportunities.find(o => o._id === oppId);
    if (!oppToMove || oppToMove.stage === targetStage) return;

    // Optimistic UI update
    setOpportunities(prev => 
      prev.map(o => o._id === oppId ? { ...o, stage: targetStage } : o)
    );

    try {
      await apiService.patch(`/crm/opportunities/${oppId}`, { stage: targetStage });
    } catch (error) {
      console.error('Failed to update opportunity stage:', error);
      // Revert on failure
      fetchOpportunities();
    }
  };

  return (
    <ContentArea>
      <PageHeader
        title="Sales Pipeline"
        description="Track and manage opportunities across all sales stages."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
            New Opportunity
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="mt-6 flex h-[calc(100vh-220px)] gap-6 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageOpps = getOpportunitiesByStage(stage.id);
            const totalValue = stageOpps.reduce((sum, opp) => sum + (opp.value || 0), 0);

            return (
              <div 
                key={stage.id} 
                className={`flex w-80 shrink-0 flex-col rounded-xl border ${stage.color} overflow-hidden`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="flex items-center justify-between border-b border-inherit bg-black/20 p-3">
                  <div>
                    <h3 className="font-semibold text-slate-200">{stage.label}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {stageOpps.length} deals • {formatCurrency(totalValue)}
                    </div>
                  </div>
                  <Badge variant="default" className="bg-black/40 text-slate-300">
                    {stageOpps.length}
                  </Badge>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {stageOpps.map((opp) => (
                    <div 
                      key={opp._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, opp._id)}
                      onDragEnd={() => setIsDragging(false)}
                      className="group cursor-grab rounded-lg border border-slate-700 bg-slate-800 p-3 shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm text-slate-200 line-clamp-2">{opp.title}</h4>
                        <GripVertical className="h-4 w-4 shrink-0 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <div className="mt-2 text-sm font-semibold text-emerald-400">
                        {formatCurrency(opp.value)}
                      </div>

                      {(opp.customerId || opp.leadId) && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                          {opp.customerId ? (
                            <><Building2 className="h-3 w-3" /> {opp.customerId.name}</>
                          ) : (
                            <><User className="h-3 w-3" /> {opp.leadId.firstName} {opp.leadId.lastName}</>
                          )}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between border-t border-slate-700/50 pt-2">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="h-3 w-3" />
                          {opp.expectedCloseDate ? format(new Date(opp.expectedCloseDate), 'MMM d') : 'No date'}
                        </div>
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">
                          {opp.probability}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {stageOpps.length === 0 && (
                    <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-800/30 text-xs text-slate-500">
                      No deals
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="New Opportunity"
        description="Create a new sales opportunity to track in your pipeline."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => document.getElementById('opportunity-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}>
              Create Opportunity
            </Button>
          </>
        }
      >
        <OpportunityForm 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchOpportunities();
          }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </SlideOver>
    </ContentArea>
  );
}
