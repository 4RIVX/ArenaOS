import { useEffect, useRef } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { ConversationSidebar } from '@/components/chat/conversation-sidebar';
import { MessageBubble } from '@/components/chat/message-bubble';
import { ChatInput } from '@/components/chat/chat-input';
import { SuggestionChips } from '@/components/chat/suggestion-chips';
import { motion } from 'framer-motion';
import { useListGeminiMessages, getListGeminiMessagesQueryKey, useCreateGeminiConversation, getListGeminiConversationsQueryKey } from '@workspace/api-client-react';
import { useAppContext } from '@/context/AppContext';
import { useChat } from '@/hooks/useChat';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function Chat() {
  const { activeConversationId, setActiveConversationId } = useAppContext();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, isStreaming, streamingContent } = useChat(activeConversationId);

  const createMutation = useCreateGeminiConversation({
    mutation: {
      onSuccess: (newConv) => {
        setActiveConversationId(newConv.id);
        queryClient.invalidateQueries({ queryKey: getListGeminiConversationsQueryKey() });
      }
    }
  });

  // Create initial chat if none selected
  useEffect(() => {
    if (activeConversationId === null && !createMutation.isPending && !createMutation.isSuccess) {
      createMutation.mutate({ data: { title: "New Chat" } });
    }
  }, [activeConversationId, createMutation.isPending, createMutation.isSuccess, createMutation]);

  const { data: messages = [], isLoading: isLoadingMessages } = useListGeminiMessages(
    activeConversationId!,
    {
      query: {
        enabled: !!activeConversationId,
        queryKey: getListGeminiMessagesQueryKey(activeConversationId!),
      }
    }
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      <Topbar />
      
      <div className="flex-1 flex overflow-hidden">
        <ConversationSidebar />
        
        <main className="flex-1 flex flex-col relative h-full">
          {/* Background Gradient Detail */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

          {/* Chat History Area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 relative z-10 scroll-smooth">
            <div className="max-w-3xl mx-auto pb-8">
              
              {!activeConversationId || isLoadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                  <p>Loading conversation...</p>
                </div>
              ) : messages.length === 0 && !streamingContent ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] pt-12">
                  <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-primary/30">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-white mb-2">What can I help you with today?</h2>
                  <p className="text-slate-400 mb-12">Select a suggestion below or type your question.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.05 }}
                    >
                      <MessageBubble 
                        role={msg.role as 'user' | 'assistant'} 
                        content={msg.content} 
                      />
                    </motion.div>
                  ))}
                  
                  {isStreaming && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <MessageBubble 
                        role="assistant" 
                        content={streamingContent || "..."} 
                      />
                    </motion.div>
                  )}
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>

          {/* Input Area */}
          <div className="shrink-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent relative z-20 pb-12">
            {(messages.length === 0 && !streamingContent) && <SuggestionChips />}
            <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
          </div>
        </main>
      </div>
    </div>
  );
}