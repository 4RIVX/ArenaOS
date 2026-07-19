import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the api-client-react module before importing the hook
vi.mock('@workspace/api-client-react', () => ({
  getListGeminiMessagesQueryKey: vi.fn((_id: number) => ['gemini', 'messages', _id]),
}));

import { useChat } from '@/hooks/useChat';

function makeWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useChat(null), { wrapper: makeWrapper() });
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.streamingContent).toBe('');
    expect(typeof result.current.sendMessage).toBe('function');
  });

  it('does nothing when conversationId is null', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const { result } = renderHook(() => useChat(null), { wrapper: makeWrapper() });

    await act(async () => {
      await result.current.sendMessage('hello');
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.isStreaming).toBe(false);
  });

  it('resets isStreaming to false after a successful stream', async () => {
    // Minimal SSE response that immediately signals done
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"done":true}\n\n'));
        controller.close();
      },
    });

    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      }),
    );

    const { result } = renderHook(() => useChat(1), { wrapper: makeWrapper() });

    await act(async () => {
      await result.current.sendMessage('test message');
    });

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.streamingContent).toBe('');
  });

  it('accumulates streaming content from SSE chunks', async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"content":"Hello "}\n\n'));
        controller.enqueue(encoder.encode('data: {"content":"world"}\n\n'));
        controller.enqueue(encoder.encode('data: {"done":true}\n\n'));
        controller.close();
      },
    });

    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      }),
    );

    const { result } = renderHook(() => useChat(1), { wrapper: makeWrapper() });

    await act(async () => {
      await result.current.sendMessage('test');
    });

    // After completion the streaming content is reset to ''
    expect(result.current.streamingContent).toBe('');
    expect(result.current.isStreaming).toBe(false);
  });

  it('recovers gracefully when fetch throws', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useChat(1), { wrapper: makeWrapper() });

    await act(async () => {
      await result.current.sendMessage('test');
    });

    // Should reset to idle state even after errors
    expect(result.current.isStreaming).toBe(false);
  });
});
