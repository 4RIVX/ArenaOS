import { cn } from '@/lib/utils';
import { User, Activity } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user';

  const renderContent = () => {
    if (isUser) return content;
    
    const lines = content.split('\n');
    let inList = false;
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const isListItem = line.startsWith('- ') || line.startsWith('• ');
      
      if (isListItem) {
        if (!inList) inList = true;
        const text = line.substring(2);
        // Handle bolding in list items
        const parts = text.split(/(\*\*.*?\*\*)/g);
        const itemContent = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        listItems.push(<li key={`li-${index}`}>{itemContent}</li>);
      } else {
        if (inList) {
          elements.push(<ul key={`ul-${index}`} className="list-disc pl-4 mb-2">{listItems}</ul>);
          listItems = [];
          inList = false;
        }
        
        // Handle bolding in paragraphs
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const paraContent = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        
        if (line.trim() === '') {
          elements.push(<br key={`br-${index}`} />);
        } else {
          elements.push(<p key={`p-${index}`} className="mb-2 last:mb-0">{paraContent}</p>);
        }
      }
    });

    if (inList) {
      elements.push(<ul key={`ul-end`} className="list-disc pl-4 mb-2">{listItems}</ul>);
    }

    return elements;
  };

  return (
    <div 
      className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}
      role="article"
      aria-label={`${isUser ? 'You' : 'ArenaOS'}: ${content}`}
    >
      <div className={cn("flex max-w-[85%] sm:max-w-[75%] gap-4", isUser ? "flex-row-reverse" : "flex-row")}>
        
        {/* Avatar */}
        <div 
          className={cn(
            "shrink-0 h-10 w-10 rounded-full flex items-center justify-center border",
            isUser 
              ? "bg-slate-800 border-slate-700" 
              : "bg-primary/20 border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          )}
          aria-label={isUser ? "You" : "ArenaOS"}
          aria-hidden={false}
        >
          {isUser ? (
            <User className="h-5 w-5 text-slate-400" />
          ) : (
            <Activity className="h-5 w-5 text-primary" />
          )}
        </div>

        {/* Bubble */}
        <div className={cn(
          "px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "glass-panel border-white/5 rounded-tl-sm text-slate-200"
        )}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
