import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { parseJobError } from '@/services/jobService';

function createAxiosError(
  status: number,
  data: unknown,
): AxiosError {
  const headers = new AxiosHeaders();
  return new AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    {
      url: '/jobs',
      method: 'post',
      headers,
    },
    undefined,
    {
      status,
      statusText: 'Error',
      headers,
      config: { headers, url: '/jobs', method: 'post' },
      data,
    }
  );
}

describe('parseJobError', () => {
  it('returns generic message for non-Axios errors', () => {
    expect(parseJobError(new Error('Something'))).toBe('Erro inesperado. Tente novamente.');
    expect(parseJobError('string error')).toBe('Erro inesperado. Tente novamente.');
    expect(parseJobError(null)).toBe('Erro inesperado. Tente novamente.');
  });

  it('handles 401/403 without response body', () => {
    const err401 = createAxiosError(401, undefined);
    expect(parseJobError(err401)).toBe('Sem autorização. Faça login novamente.');

    const err403 = createAxiosError(403, undefined);
    expect(parseJobError(err403)).toBe('Sem autorização. Faça login novamente.');
  });

  it('handles errors without response data', () => {
    const err500 = createAxiosError(500, undefined);
    expect(parseJobError(err500)).toBe('Erro de conexão com o servidor.');
  });

  it('extracts message from { error: "..." } response', () => {
    const err = createAxiosError(422, { error: 'Título é obrigatório' });
    expect(parseJobError(err)).toBe('Título é obrigatório');
  });

  it('joins validation field messages', () => {
    const err = createAxiosError(400, {
      title: 'não pode ser vazio',
      description: 'é obrigatória',
    });
    expect(parseJobError(err)).toBe('não pode ser vazio | é obrigatória');
  });

  it('handles string response data', () => {
    const err = createAxiosError(500, 'Internal Server Error');
    expect(parseJobError(err)).toBe('Internal Server Error');
  });

  it('falls back to generic for empty object response', () => {
    const err = createAxiosError(400, {});
    expect(parseJobError(err)).toBe('Erro inesperado. Tente novamente.');
  });

  it('handles 404 errors', () => {
    const err = createAxiosError(404, { error: 'Vaga não encontrada' });
    expect(parseJobError(err)).toBe('Vaga não encontrada');
  });
});
