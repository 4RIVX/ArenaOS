import { ArrowUpRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export function SuggestionChips() {
  const { setActiveFeature } = useAppContext();
  
  const suggestions = [
    "Take me to Seat D42",
    "Find shortest queue",
    "Nearest restroom",
    "Accessible route",
    "Lost backpack",
    "Translate announcement"
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-6">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => setActiveFeature(s)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          {s}
          <ArrowUpRight className="h-3 w-3 opacity-50" />
        </button>
      ))}
    </div>
  );
}
