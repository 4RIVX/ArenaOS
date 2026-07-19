import { MessageSquarePlus, MessageSquare, Clock, Trash2, Loader2 } from 'lucide-react';
import { useListGeminiConversations, useCreateGeminiConversation, useDeleteGeminiConversation, getListGeminiConversationsQueryKey } from '@workspace/api-client-react';
import { useAppContext } from '@/context/AppContext';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

export function ConversationSidebar() {
  const { activeConversationId, setActiveConversationId } = useAppContext();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useListGeminiConversations();
  
  const createMutation = useCreateGeminiConversation({
    mutation: {
      onSuccess: (newConv) => {
        queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
        setActiveConversationId(newConv.id);
        setLocation('/chat');
      },
    },
  });

  const deleteMutation = useDeleteGeminiConversation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
      },
    }
  });

  const handleNewChat = () => {
    createMutation.mutate({ data: { title: "New Chat" } });
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    deleteMutation.mutate({ id });
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  return (
    <div className="w-[260px] shrink-0 border-r border-border glass-panel rounded-none h-full flex flex-col hidden md:flex">
      <div className="p-4">
        <button 
          onClick={handleNewChat}
          disabled={createMutation.isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors font-medium disabled:opacity-50"
        >
          {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquarePlus className="h-4 w-4" />}
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">Recent</div>
        
        {isLoading ? (
          <div className="space-y-2 px-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          conversations.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveConversationId(item.id)}
              className={`w-full text-left flex flex-col gap-1 px-3 py-3 rounded-lg transition-colors group mb-1 relative ${
                activeConversationId === item.id 
                  ? 'bg-primary/20 border border-primary/30' 
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 text-sm text-slate-300 group-hover:text-white truncate pr-6">
                <MessageSquare className={`h-4 w-4 shrink-0 transition-colors ${
                  activeConversationId === item.id ? 'text-primary' : 'text-slate-500 group-hover:text-primary'
                }`} />
                <span className="truncate">{item.title}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 pl-6">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </div>
              
              <div 
                role="button"
                onClick={(e) => handleDelete(e, item.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-slate-400 hover:text-destructive transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
