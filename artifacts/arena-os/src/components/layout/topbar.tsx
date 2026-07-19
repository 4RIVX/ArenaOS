import { useAppContext } from '@/context/AppContext';
import { Link, useLocation } from 'wouter';
import { ChevronDown, Globe, Moon, Activity } from 'lucide-react';
import { RoleBadge } from './role-badge';

export function Topbar() {
  const { role, selectedStadium, selectedGate, selectedLanguage } = useAppContext();
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-x-0 border-t-0 rounded-none h-16 flex items-center px-4 md:px-6 justify-between shrink-0">
      <div className="flex items-center gap-6">
        <Link href={role === 'organizer' ? '/organizer' : '/dashboard'} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight glow-text hidden md:inline-block">ArenaOS</span>
        </Link>
        <div className="hidden sm:flex items-center bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse" />
          <span className="text-xs font-medium text-amber-500">Simulation Mode</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 transition-colors">
          <span className="text-sm font-medium">{selectedStadium}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="w-px h-4 bg-border mx-1" />
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 transition-colors">
          <span className="text-sm font-medium">{selectedGate}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/5 cursor-pointer">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium ml-1">{selectedLanguage}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
        </div>

        <button className="p-2 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
          <Moon className="h-4 w-4" />
        </button>

        <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

        <div className="flex items-center gap-3">
          <RoleBadge role={role} />
          <button 
            onClick={() => setLocation('/role')}
            className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Change
          </button>
        </div>
      </div>
    </header>
  );
}