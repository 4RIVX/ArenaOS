import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getListGeminiMessagesQueryKey } from '@workspace/api-client-react';

export function useChat(conversationId: number | null) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const queryClient = useQueryClient();

  const sendMessage = useCallback(async (content: string, arenaRole?: string, arenaFeature?: string, selectedLanguage?: string) => {
    if (!conversationId) return;

    setIsStreaming(true);
    setStreamingContent('');

    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const endpoint = `${baseUrl}/api/gemini/conversations/${conversationId}/messages`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          arenaRole,
          arenaFeature,
          selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body stream is missing');

      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (!dataStr.trim()) continue;

            try {
              const data = JSON.parse(dataStr);

              if (data.error) {
                console.error('SSE Error:', data.error);
                accumulatedContent += `\n\n[Error: ${data.error}]`;
                setStreamingContent(accumulatedContent);
                break;
              }

              if (data.done) {
                // Done streaming
                break;
              }

              if (data.content) {
                accumulatedContent += data.content;
                setStreamingContent(accumulatedContent);
              }
            } catch (e) {
              console.error('Failed to parse SSE data chunk:', e, dataStr);
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat stream error:', err);
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
      queryClient.invalidateQueries({
        queryKey: getListGeminiMessagesQueryKey(conversationId),
      });
    }
  }, [conversationId, queryClient]);

  return { sendMessage, isStreaming, streamingContent };
}
