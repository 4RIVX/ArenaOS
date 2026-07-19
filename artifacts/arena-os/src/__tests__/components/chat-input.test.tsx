import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import { ChatInput } from '@/components/chat/chat-input';

// ChatInput uses AppContext — the AllProviders wrapper in test-utils supplies it.
// Defaults from AppProvider: role=null → sent as 'fan', activeFeature=null → undefined,
// selectedLanguage='English'.

describe('ChatInput', () => {
  it('renders without crashing', () => {
    render(<ChatInput onSend={vi.fn()} isStreaming={false} />);
    expect(screen.getByRole('textbox', { name: /type your message/i })).toBeInTheDocument();
  });

  it('has a form with accessible label', () => {
    render(<ChatInput onSend={vi.fn()} isStreaming={false} />);
    expect(screen.getByRole('form', { name: /chat with arenaos/i })).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<ChatInput onSend={vi.fn()} isStreaming={false} />);
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  it('send button becomes enabled when user types', () => {
    render(<ChatInput onSend={vi.fn()} isStreaming={false} />);
    const input = screen.getByRole('textbox', { name: /type your message/i });
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
  });

  it('calls onSend with the typed message on submit', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} isStreaming={false} />);
    const input = screen.getByRole('textbox', { name: /type your message/i });
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(screen.getByRole('form', { name: /chat with arenaos/i }));
    // role=null becomes 'fan', activeFeature=null becomes undefined, language='English'
    expect(onSend).toHaveBeenCalledWith('Test message', 'fan', undefined, 'English');
  });

  it('disables the input and send button while streaming', () => {
    render(<ChatInput onSend={vi.fn()} isStreaming={true} />);
    expect(screen.getByRole('textbox', { name: /type your message/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /sending message/i })).toBeDisabled();
  });

  it('clears the input after sending', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} isStreaming={false} />);
    const input = screen.getByRole('textbox', { name: /type your message/i });
    fireEvent.change(input, { target: { value: 'Hello ArenaOS' } });
    fireEvent.submit(screen.getByRole('form', { name: /chat with arenaos/i }));
    expect(input).toHaveValue('');
  });
});
