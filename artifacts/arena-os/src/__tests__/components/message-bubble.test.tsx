import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils';
import { MessageBubble } from '@/components/chat/message-bubble';

describe('MessageBubble', () => {
  it('renders user message content', () => {
    render(<MessageBubble role="user" content="Hello there!" />);
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
  });

  it('renders assistant message content', () => {
    render(<MessageBubble role="assistant" content="How can I help you?" />);
    expect(screen.getByText(/How can I help you?/)).toBeInTheDocument();
  });

  it('shows correct aria-label for user messages', () => {
    render(<MessageBubble role="user" content="My question" />);
    expect(screen.getByRole('article', { name: /You: My question/i })).toBeInTheDocument();
  });

  it('shows correct aria-label for assistant messages', () => {
    render(<MessageBubble role="assistant" content="My answer" />);
    expect(screen.getByRole('article', { name: /ArenaOS: My answer/i })).toBeInTheDocument();
  });

  it('renders bold text from **markdown**', () => {
    render(<MessageBubble role="assistant" content="This is **important** text" />);
    const bold = screen.getByText('important');
    expect(bold.tagName).toBe('STRONG');
  });

  it('renders bullet-point list items', () => {
    render(<MessageBubble role="assistant" content={"Options:\n- First option\n- Second option"} />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items[0]).toHaveTextContent('First option');
    expect(items[1]).toHaveTextContent('Second option');
  });
});
