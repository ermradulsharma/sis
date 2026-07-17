'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api.service';
import { formatDistanceToNow } from 'date-fns';
import { Phone, Mail, Users, StickyNote, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface FollowUpsFeedProps {
  entityType: 'Lead' | 'Customer' | 'Opportunity';
  entityId: string;
}

export function FollowUpsFeed({ entityType, entityId }: FollowUpsFeedProps) {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFollowUps = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        entityType,
        entityId,
        limit: '20'
      });
      const response = await apiService.get<any[]>(`/crm/follow-ups?${params.toString()}`);
      if (response.success && response.data) {
        setFollowUps(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch follow-ups:', error);
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchFollowUps();
  }, [fetchFollowUps]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4 text-emerald-400" />;
      case 'email': return <Mail className="h-4 w-4 text-blue-400" />;
      case 'meeting': return <Users className="h-4 w-4 text-indigo-400" />;
      case 'note': return <StickyNote className="h-4 w-4 text-amber-400" />;
      default: return <StickyNote className="h-4 w-4 text-slate-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-200">Recent Activity</h3>
        <Button variant="outline" size="sm">Add Note</Button>
      </div>

      {followUps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/30 p-8 text-center text-sm text-slate-500">
          No activities logged yet.
        </div>
      ) : (
        <div className="space-y-4">
          {followUps.map((item) => (
            <div key={item._id} className="relative flex gap-4">
              <div className="absolute left-5 top-10 -bottom-4 w-px bg-slate-800 last:hidden" />
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200 capitalize">{item.type}</span>
                    <Badge variant={item.status === 'completed' ? 'success' : 'default'} className="scale-90">
                      {item.status}
                    </Badge>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400 whitespace-pre-wrap">{item.notes}</p>
                {item.assignedTo && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 border-t border-slate-800 pt-3">
                    <div className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center">
                      {item.assignedTo.firstName?.charAt(0)}{item.assignedTo.lastName?.charAt(0)}
                    </div>
                    Logged by {item.assignedTo.firstName} {item.assignedTo.lastName}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
