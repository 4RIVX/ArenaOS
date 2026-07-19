import { cn } from '@/lib/utils';
import { Shield, User, Users, Megaphone } from 'lucide-react';

interface RoleBadgeProps {
  role: 'fan' | 'volunteer' | 'staff' | 'organizer' | null;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  if (!role) return null;

  const config = {
    fan: { icon: User, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    volunteer: { icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    staff: { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    organizer: { icon: Megaphone, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  };

  const { icon: Icon, color, bg, border } = config[role];

  return (
    <div className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium', bg, border, color, className)}>
      <Icon className="h-3.5 w-3.5" />
      <span className="capitalize">{role}</span>
    </div>
  );
}
