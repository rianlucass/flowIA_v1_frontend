import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from '@/components/candidates/StatusBadge';
import { AnalysisStatus } from '@/types/analysis';

describe('StatusBadge', () => {
  it('renders approved status', () => {
    render(<StatusBadge status={AnalysisStatus.APPROVED} />);
    expect(screen.getByText('Aprovado')).toBeInTheDocument();
  });

  it('renders review status', () => {
    render(<StatusBadge status={AnalysisStatus.REVIEW} />);
    expect(screen.getByText('Revisar')).toBeInTheDocument();
  });

  it('renders rejected status', () => {
    render(<StatusBadge status={AnalysisStatus.REJECTED} />);
    expect(screen.getByText('Reprovado')).toBeInTheDocument();
  });

  it('renders completed status', () => {
    render(<StatusBadge status={AnalysisStatus.COMPLETED} />);
    expect(screen.getByText('Concluído')).toBeInTheDocument();
  });

  it('renders pending status', () => {
    render(<StatusBadge status={AnalysisStatus.PENDING} />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('renders in progress status', () => {
    render(<StatusBadge status={AnalysisStatus.IN_PROGRESS} />);
    expect(screen.getByText('Processando')).toBeInTheDocument();
  });

  it('renders failed status', () => {
    render(<StatusBadge status={AnalysisStatus.FAILED} />);
    expect(screen.getByText('Falhou')).toBeInTheDocument();
  });

  it('renders with small size variant', () => {
    const { container } = render(<StatusBadge status={AnalysisStatus.APPROVED} size="sm" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('text-xs');
  });
});
