import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  status: 'green' | 'amber' | 'red';
  progress?: number;
}

export function MetricCard({ title, value, icon: Icon, trend, status, progress }: MetricCardProps) {
  const statusColors = {
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    red: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  };

  const statusBg = {
    green: 'bg-emerald-400',
    amber: 'bg-amber-400',
    red: 'bg-rose-400',
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <div className={cn("p-2 rounded-lg border", statusColors[status])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        {trend && (
          <span className={cn("text-xs font-medium", status === 'red' ? 'text-rose-400' : 'text-slate-400')}>
            {trend}
          </span>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-auto pt-2">
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div 
              className={cn("h-full rounded-full", statusBg[status])}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
