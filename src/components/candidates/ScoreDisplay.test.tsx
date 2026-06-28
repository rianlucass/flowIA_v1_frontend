import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScoreDisplay from '@/components/candidates/ScoreDisplay';

describe('ScoreDisplay', () => {
  it('renders unavailable message when score is undefined', () => {
    render(<ScoreDisplay />);
    expect(screen.getByText('Score não disponível')).toBeInTheDocument();
  });

  it('renders score with one decimal', () => {
    render(<ScoreDisplay score={85.567} />);
    expect(screen.getByText('85.6')).toBeInTheDocument();
  });

  it('applies green color for high scores', () => {
    render(<ScoreDisplay score={90} />);
    const scoreEl = screen.getByText('90.0');
    expect(scoreEl.className).toContain('text-green-600');
  });

  it('applies amber color for medium scores', () => {
    render(<ScoreDisplay score={60} />);
    const scoreEl = screen.getByText('60.0');
    expect(scoreEl.className).toContain('text-amber-600');
  });

  it('applies red color for low scores', () => {
    render(<ScoreDisplay score={30} />);
    const scoreEl = screen.getByText('30.0');
    expect(scoreEl.className).toContain('text-red-600');
  });

  it('hides icon when showIcon is false', () => {
    const { container } = render(<ScoreDisplay score={50} showIcon={false} />);
    const icons = container.querySelectorAll('.lucide');
    expect(icons.length).toBe(0);
  });

  it('renders with small size', () => {
    render(<ScoreDisplay score={75} size="sm" />);
    const scoreEl = screen.getByText('75.0');
    expect(scoreEl.className).toContain('text-sm');
  });

  it('renders with large size', () => {
    render(<ScoreDisplay score={75} size="lg" />);
    const scoreEl = screen.getByText('75.0');
    expect(scoreEl.className).toContain('text-2xl');
  });
});
