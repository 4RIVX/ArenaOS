import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Topbar } from '@/components/layout/topbar';
import { MetricCard } from '@/components/organizer/metric-card';
import { Activity, Users, AlertCircle, Clock, ShieldAlert, Bus, Trash2, HeartPulse, Sparkles, Megaphone, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import { useGenerateOrganizerSummary, useGenerateAnnouncement } from '@workspace/api-client-react';

const metrics = [
  { id: 1, title: 'Crowd Density', value: '87%', icon: Users, trend: '+2% past hr', status: 'amber' as const, progress: 87 },
  { id: 2, title: 'Medical Incidents', value: '3', icon: HeartPulse, trend: '12 resolved', status: 'green' as const },
  { id: 3, title: 'Volunteers Active', value: '1,847', icon: Activity, trend: '/ 2000 total', status: 'green' as const, progress: 92 },
  { id: 4, title: 'Food Queue Avg', value: '8.2m', icon: Clock, trend: '-1.5m past hr', status: 'green' as const },
  { id: 5, title: 'Security Alerts', value: '2', icon: ShieldAlert, trend: 'High priority', status: 'red' as const },
  { id: 6, title: 'Transport Status', value: '94%', icon: Bus, trend: 'On-time rate', status: 'amber' as const, progress: 94 },
  { id: 7, title: 'Waste Collection', value: '73%', icon: Trash2, trend: 'Bin capacity', status: 'amber' as const, progress: 73 },
  { id: 8, title: 'Emergency Requests', value: '0', icon: AlertCircle, trend: 'Critical', status: 'green' as const },
];

const metricsPayload = {
  'Crowd Density': '87%',
  'Medical Incidents': '3 active, 12 resolved', 
  'Volunteers Active': '1847 of 2000',
  'Food Queue Average': '8.2 minutes',
  'Security Alerts': '2 high priority',
  'Transport Status': '94% on-time',
  'Waste Collection': '73% bin capacity',
  'Emergency Requests': '0 critical',
};

const LANGUAGES = ['English', 'Spanish', 'French', 'Arabic', 'Hindi', 'Tamil'];

export default function OrganizerDashboard() {
  const generateSummary = useGenerateOrganizerSummary();
  const generateAnnouncementMutation = useGenerateAnnouncement();

  const [announcementInput, setAnnouncementInput] = useState('');
  const [announcementLanguage, setAnnouncementLanguage] = useState('English');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateSummary.mutate({ data: { metrics: metricsPayload } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleGenerateAnnouncement = () => {
    if (!announcementInput.trim()) return;
    generateAnnouncementMutation.mutate({
      data: {
        situation: announcementInput,
        language: announcementLanguage,
      }
    });
  };

  const handleCopy = () => {
    if (generateAnnouncementMutation.data?.announcement) {
      navigator.clipboard.writeText(generateAnnouncementMutation.data.announcement);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Topbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
            <p className="text-slate-400">Live organizer view of stadium operations.</p>
          </motion.div>
          
          <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Nominal
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <MetricCard {...m} />
            </motion.div>
          ))}
        </div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-panel p-6 md:p-8 rounded-2xl border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Operational Summary
            </h2>
            <button 
              onClick={() => generateSummary.mutate({ data: { metrics: metricsPayload } })}
              disabled={generateSummary.isPending}
              className="text-sm px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors disabled:opacity-50"
            >
              {generateSummary.isPending ? 'Generating...' : 'Regenerate'}
            </button>
          </div>

          {generateSummary.isPending && !generateSummary.data ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p>Analyzing stadium metrics...</p>
            </div>
          ) : generateSummary.isError ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              Failed to generate summary. Please try again.
            </div>
          ) : generateSummary.data ? (
            <>
              <p className="text-slate-300 leading-relaxed text-lg max-w-5xl whitespace-pre-wrap">
                {generateSummary.data.summary}
              </p>
              {generateSummary.data.recommendations && generateSummary.data.recommendations.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {generateSummary.data.recommendations.map((rec, idx) => (
                    <button key={idx} className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                      {rec}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </motion.section>

        {/* Announcement Generator */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="glass-panel p-6 md:p-8 rounded-2xl border-white/5 relative"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-blue-500" />
            Announcement Generator
          </h2>
          
          <div className="flex flex-col gap-4 max-w-4xl">
            <div className="flex flex-col md:flex-row gap-4">
              <textarea
                value={announcementInput}
                onChange={(e) => setAnnouncementInput(e.target.value)}
                placeholder="e.g. Heavy rain expected in 10 minutes, please seek shelter..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-24"
              />
              <div className="flex flex-col gap-4 w-full md:w-48">
                <select
                  value={announcementLanguage}
                  onChange={(e) => setAnnouncementLanguage(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang} className="bg-slate-900 text-white">
                      {lang}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleGenerateAnnouncement}
                  disabled={!announcementInput.trim() || generateAnnouncementMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 h-[50px]"
                >
                  {generateAnnouncementMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
            </div>

            {generateAnnouncementMutation.isError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mt-2">
                Failed to generate announcement.
              </div>
            )}

            {generateAnnouncementMutation.data?.announcement && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <div className="relative group">
                  <div className="bg-black/50 border border-white/10 rounded-xl p-6 pr-14 font-mono text-[15px] leading-relaxed text-blue-100 whitespace-pre-wrap">
                    {generateAnnouncementMutation.data.announcement}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <div className="flex justify-end mt-2 text-sm text-slate-500">
                  {generateAnnouncementMutation.data.announcement.split(/\s+/).filter(Boolean).length} words • {generateAnnouncementMutation.data.language}
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
}