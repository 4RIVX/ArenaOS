import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils';
import RoleSelection from '@/pages/role-selection';

describe('RoleSelection page', () => {
  it('renders without crashing', () => {
    render(<RoleSelection />);
  });

  it('shows all four role options', () => {
    render(<RoleSelection />);
    expect(screen.getByText('Fan')).toBeInTheDocument();
    expect(screen.getByText('Volunteer')).toBeInTheDocument();
    expect(screen.getByText('Staff')).toBeInTheDocument();
    expect(screen.getByText('Organizer')).toBeInTheDocument();
  });

  it('shows role descriptions', () => {
    render(<RoleSelection />);
    expect(screen.getByText(/Find your seat/i)).toBeInTheDocument();
    expect(screen.getByText(/Assist fans/i)).toBeInTheDocument();
  });

  it('renders role cards as clickable buttons', () => {
    render(<RoleSelection />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });
});
