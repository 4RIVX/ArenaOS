import { motion } from 'framer-motion';
import { User, Users, Shield, Megaphone } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAppContext } from '@/context/AppContext';

const roles = [
  {
    id: 'fan' as const,
    name: 'Fan',
    description: 'Find your seat, order food, and beat the queues.',
    icon: User,
    color: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'group-hover:border-emerald-500/50',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'volunteer' as const,
    name: 'Volunteer',
    description: 'Assist fans, report issues, and view schedules.',
    icon: Users,
    color: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'group-hover:border-blue-500/50',
    iconColor: 'text-blue-400',
  },
  {
    id: 'staff' as const,
    name: 'Staff',
    description: 'Manage incidents, coordinate responses, and view tasks.',
    icon: Shield,
    color: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'group-hover:border-amber-500/50',
    iconColor: 'text-amber-400',
  },
  {
    id: 'organizer' as const,
    name: 'Organizer',
    description: 'Command center view of full stadium operations.',
    icon: Megaphone,
    color: 'from-purple-500/20 to-purple-500/5',
    borderColor: 'group-hover:border-purple-500/50',
    iconColor: 'text-purple-400',
  },
];

export default function RoleSelection() {
  const [, setLocation] = useLocation();
  const { setRole } = useAppContext();

  const handleSelect = (roleId: typeof roles[0]['id']) => {
    setRole(roleId);
    if (roleId === 'organizer') {
      setLocation('/organizer');
    } else {
      setLocation('/dashboard');
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Who are you today?</h1>
        <p className="text-lg text-slate-400">Select your role to configure your ArenaOS experience.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full z-10">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              onClick={() => handleSelect(role.id)}
              className={`group glass-panel rounded-3xl p-8 text-left transition-all duration-300 hover:scale-105 hover:-translate-y-2 flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-primary/50 ${role.borderColor}`}
            >
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 ring-1 ring-white/10 group-hover:ring-white/30 transition-all`}>
                <Icon className={`h-8 w-8 ${role.iconColor}`} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                {role.name}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {role.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}