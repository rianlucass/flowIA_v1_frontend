import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScoreBar from '@/components/candidates/ScoreBar';

describe('ScoreBar', () => {
  it('renders label', () => {
    render(<ScoreBar label="Atividades" score={50} />);
    expect(screen.getByText('Atividades')).toBeInTheDocument();
  });

  it('shows score value', () => {
    render(<ScoreBar label="Experiência" score={75} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('hides score value when showValue is false', () => {
    render(<ScoreBar label="Localização" score={60} showValue={false} />);
    expect(screen.queryByText('60')).not.toBeInTheDocument();
  });

  it('renders progress bar with correct width', () => {
    const { container } = render(<ScoreBar label="Educação" score={80} />);
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar.style.width).toBe('80%');
  });

  it('handles undefined score (defaults to 0)', () => {
    const { container } = render(<ScoreBar label="Estabilidade" />);
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar.style.width).toBe('0%');
  });

  it('applies green gradient for high scores', () => {
    const { container } = render(<ScoreBar label="Alta" score={80} />);
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar.className).toContain('green');
  });

  it('applies amber gradient for medium scores', () => {
    const { container } = render(<ScoreBar label="Média" score={60} />);
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar.className).toContain('amber');
  });

  it('applies red gradient for low scores', () => {
    const { container } = render(<ScoreBar label="Baixa" score={30} />);
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar.className).toContain('red');
  });
});
