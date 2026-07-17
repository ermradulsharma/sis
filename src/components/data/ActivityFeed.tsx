import { Avatar } from '@/components/ui/Avatar';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { AuditAction } from '@/types';

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string | null;
  };
  action: AuditAction;
  entity: string;
  timestamp: string | Date;
  details?: string;
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="flex h-full items-center justify-center py-8 text-sm text-slate-500">
        No recent activity
      </div>
    );
  }

  const getActionText = (action: AuditAction) => {
    switch (action) {
      case 'create': return 'created';
      case 'update': return 'updated';
      case 'delete': return 'deleted';
      case 'login': return 'logged in';
      case 'logout': return 'logged out';
      case 'view': return 'viewed';
      case 'export': return 'exported';
      default: return 'modified';
    }
  };

  const getActionColor = (action: AuditAction) => {
    switch (action) {
      case 'create': return 'text-emerald-400';
      case 'update': return 'text-amber-400';
      case 'delete': return 'text-rose-400';
      default: return 'text-indigo-400';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative flex gap-4">
          {/* Timeline connector */}
          {index !== activities.length - 1 && (
            <div className="absolute left-4 top-10 bottom-[-24px] w-[1px] bg-slate-800" />
          )}
          
          <div className="relative z-10 shrink-0">
            <Avatar
              src={activity.user.avatar}
              fallback={activity.user.name}
              size="sm"
              className="ring-4 ring-slate-900"
            />
          </div>
          
          <div className="flex flex-col pb-1 pt-1.5">
            <p className="text-sm text-slate-300">
              <span className="font-medium text-white">{activity.user.name}</span>{' '}
              <span className={getActionColor(activity.action)}>{getActionText(activity.action)}</span>{' '}
              <span className="font-medium text-slate-200">{activity.entity}</span>
            </p>
            {activity.details && (
              <p className="mt-1 text-sm text-slate-400">{activity.details}</p>
            )}
            <span className="mt-1.5 text-xs text-slate-500">
              {formatRelativeTime(activity.timestamp)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
