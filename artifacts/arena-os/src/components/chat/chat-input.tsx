import { useState, useEffect } from 'react';
import { Send, Mic, Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface ChatInputProps {
  onSend: (message: string, role?: string, feature?: string, selectedLanguage?: string) => void;
  isStreaming: boolean;
}

export function ChatInput({ onSend, isStreaming }: ChatInputProps) {
  const { role, activeFeature, setActiveFeature, selectedLanguage } = useAppContext();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (activeFeature) {
      setValue(activeFeature);
      // Consume the prefill so it doesn't get sticky forever
      setActiveFeature(null);
    }
  }, [activeFeature, setActiveFeature]);

  const handleSend = () => {
    if (!value.trim() || isStreaming) return;
    onSend(value, role ?? 'fan', activeFeature ?? undefined, selectedLanguage);
    setValue('');
    setActiveFeature(null);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form 
        aria-label="Chat with ArenaOS"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center glass-panel rounded-2xl border-white/10 p-2 shadow-2xl focus-within:ring-2 focus-within:ring-primary/50 transition-all bg-card/80"
      >
        <button 
          className="p-3 text-slate-400 hover:text-white transition-colors"
          type="button"
          aria-label="Voice input (not yet available)"
        >
          <Mic className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask ArenaOS anything..."
          aria-label="Type your message"
          className="flex-1 bg-transparent border-0 px-2 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 text-[15px]"
          disabled={isStreaming}
        />
        <button 
          className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!value.trim() || isStreaming}
          type="submit"
          aria-label={isStreaming ? "Sending message..." : "Send message"}
        >
          {isStreaming ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
      <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-slate-500">
        ArenaOS AI can make mistakes. Verify critical stadium info.
      </div>
    </div>
  );
}
