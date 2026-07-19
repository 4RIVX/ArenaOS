import { motion } from 'framer-motion';
import { ArrowRight, Globe, MapPin, Navigation, Shield, Users, Radio, Bus, Leaf } from 'lucide-react';
import { Link } from 'wouter';
import { FeatureCard } from '@/components/layout/feature-card';

const features = [
  { icon: Navigation, name: 'Navigation', description: 'Real-time stadium wayfinding and accessible routes.' },
  { icon: Users, name: 'Crowd Intelligence', description: 'Predictive density mapping to avoid bottlenecks.' },
  { icon: Shield, name: 'Accessibility', description: 'Tailored assistance and barrier-free routing.' },
  { icon: Bus, name: 'Transportation', description: 'Live transit updates and smart ride orchestration.' },
  { icon: Globe, name: 'Multilingual', description: 'Instant translation for 40+ global languages.' },
  { icon: Radio, name: 'Emergency', description: 'Rapid response protocols and instant alerts.' },
  { icon: MapPin, name: 'Lost & Found', description: 'AI-assisted item recovery across all zones.' },
  { icon: Leaf, name: 'Sustainability', description: 'Waste tracking and energy optimization metrics.' },
];

export default function Landing() {
  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-background">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background opacity-30 blur-[100px]" />
        {/* Grain Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <main className="flex-1 relative z-10 flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-32 text-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 max-w-4xl"
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse mr-2"></span>
              FIFA World Cup 2026 Ready
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl">
              <span className="glow-text">Arena</span>OS
            </h1>
            
            <h2 className="text-2xl md:text-4xl font-medium text-slate-300">
              The Intelligent Stadium Operating System
            </h2>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto pt-4 leading-relaxed">
              One Conversation. Every Stadium Service. Transform how fans experience the world's largest sporting event.
            </p>

            <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/role"
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-semibold text-primary-foreground shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.8)]"
              >
                <span className="mr-2">Launch ArenaOS</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Grid Section */}
        <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-white mb-4">Command the entire venue</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From finding your seat to orchestrating emergency responses, ArenaOS handles it all through an intuitive natural language interface.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <FeatureCard 
                  icon={feature.icon}
                  name={feature.name}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bold Statement Section */}
        <section className="py-32 px-4 border-t border-white/5 relative z-10 bg-black/20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              A smarter stadium isn't just connected. <br className="hidden md:block" />
              <span className="text-emerald-400">It's conversational.</span>
            </h2>
            <p className="text-xl text-slate-400">
              Stop digging through menus. Ask for what you need, exactly how you'd ask a human guide.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}