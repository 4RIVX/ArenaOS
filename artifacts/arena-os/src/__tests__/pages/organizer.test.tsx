import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test-utils';
import OrganizerDashboard from '@/pages/organizer';

// Mock the API hooks — the organizer page calls Gemini on demand
vi.mock('@workspace/api-client-react', () => ({
  useGenerateOrganizerSummary: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    data: undefined,
  })),
  useGenerateAnnouncement: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    data: undefined,
  })),
}));

describe('OrganizerDashboard page', () => {
  it('renders without crashing', () => {
    render(<OrganizerDashboard />);
  });

  it('shows the Topbar with Simulation Mode badge', () => {
    render(<OrganizerDashboard />);
    expect(screen.getByText('Simulation Mode')).toBeInTheDocument();
  });

  it('displays metric cards', () => {
    render(<OrganizerDashboard />);
    expect(screen.getByText('Crowd Density')).toBeInTheDocument();
    expect(screen.getByText('Security Alerts')).toBeInTheDocument();
  });

  it('has a regenerate summary button', () => {
    render(<OrganizerDashboard />);
    // The button shows "Regenerate" (or "Generating..." when pending)
    expect(screen.getByRole('button', { name: /Regenerate/i })).toBeInTheDocument();
  });

  it('shows the AI Operational Summary section', () => {
    render(<OrganizerDashboard />);
    expect(screen.getByText(/AI Operational Summary/i)).toBeInTheDocument();
  });
});
