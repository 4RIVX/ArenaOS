import { motion } from 'framer-motion';
import { Navigation, Users, Coffee, Shield, Bus, MapPin, Globe, Leaf, Megaphone, Info, AlertTriangle } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAppContext } from '@/context/AppContext';
import { FeatureCard } from '@/components/layout/feature-card';
import { Topbar } from '@/components/layout/topbar';

const features = [
  { id: 'navigation', icon: Navigation, name: 'Navigation', desc: 'Find seats, gates, and facilities', prompt: 'How do I get to my seat from Gate A?' },
  { id: 'crowd', icon: Users, name: 'Crowd Intel', desc: 'Check gate and corridor density', prompt: 'Which gate is least crowded right now?' },
  { id: 'food', icon: Coffee, name: 'Food & Beverage', desc: 'Order ahead and check queues', prompt: 'Which food court has the shortest queue?' },
  { id: 'accessibility', icon: Shield, name: 'Accessibility', desc: 'Barrier-free routes and assistance', prompt: 'Show me accessible routes and wheelchair-friendly facilities' },
  { id: 'emergency', icon: AlertTriangle, name: 'Emergency', desc: 'Report incidents and get help', prompt: 'I need medical assistance' },
  { id: 'transport', icon: Bus, name: 'Transport', desc: 'Live metro and shuttle updates', prompt: 'What is the fastest way to leave the stadium?' },
  { id: 'lost', icon: MapPin, name: 'Lost & Found', desc: 'Report or find lost items', prompt: 'I lost an item in the stadium' },
  { id: 'translate', icon: Globe, name: 'Translate', desc: 'Real-time multilingual support', prompt: 'Help me in my language' },
  { id: 'sustain', icon: Leaf, name: 'Sustainability', desc: 'Green exits, recycling and refill stations', prompt: 'Where is the nearest recycling bin?' },
  { id: 'announce', icon: Megaphone, name: 'Announcements', desc: 'Generate professional stadium announcements', prompt: 'Generate an announcement about crowd flow at Gate C' },
  { id: 'info', icon: Info, name: 'Stadium Info', desc: 'General venue details and rules', prompt: 'What are the restricted items for entry?' },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { setActiveFeature } = useAppContext();

  const handleFeatureClick = (id: string, prompt: string) => {
    setActiveFeature(prompt);
    setLocation('/chat');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Topbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">How can ArenaOS assist you?</h1>
          <p className="text-slate-400">Select a service or just start typing in the chat.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <FeatureCard
                icon={feature.icon}
                name={feature.name}
                description={feature.desc}
                onClick={() => handleFeatureClick(feature.id, feature.prompt)}
              />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}