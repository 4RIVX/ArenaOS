import { Link } from 'wouter';

interface FeatureCardProps {
  icon: React.ElementType;
  name: string;
  description: string;
  onClick?: () => void;
  href?: string;
}

export function FeatureCard({ icon: Icon, name, description, onClick, href }: FeatureCardProps) {
  const inner = (
    <div className="group glass-panel rounded-2xl p-6 h-full flex flex-col items-start transition-all duration-300 hover:border-primary/50 hover:bg-white/5 hover:glow-box hover:-translate-y-1">
      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
        <Icon className="h-6 w-6 text-primary group-hover:text-cyan-400 transition-colors" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
      <p className="text-sm text-muted-foreground flex-grow leading-relaxed">{description}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full" onClick={onClick} aria-label={`Open ${name} feature`}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="h-full w-full text-left" aria-label={`Open ${name} feature`}>
      {inner}
    </button>
  );
}
