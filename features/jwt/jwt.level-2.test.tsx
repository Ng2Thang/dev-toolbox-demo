import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { decodeJwt } from '@/lib/jwt';

import { decodeToken, validToken } from './jwt.test-helpers';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('JWT Decoder - Level 2 realistic/intermediate', () => {
  it('accepts valid tokens with surrounding whitespace', () => {
    expect(decodeJwt(`  ${validToken}\n`)).toMatchObject({ payload: { sub: '123' } });
  });

  it('rejects an empty compact-token segment', () => {
    expect(() => decodeJwt('header..signature')).toThrow('Expected three dot-separated segments');
  });

  it('recovers from a malformed token after the user corrects it', () => {
    decodeToken('not-a-jwt');
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('JWT token'), { target: { value: validToken } });
    fireEvent.click(screen.getByRole('button', { name: 'Decode token' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Decoded JWT payload' })).toHaveTextContent('Alice');
  });

  it('clears the token and decoded output', () => {
    decodeToken();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByLabelText('JWT token')).toHaveValue('');
    expect(screen.queryByRole('region', { name: 'Decoded JWT header' })).not.toBeInTheDocument();
  });

  it('saves only a successful decode through the existing run API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    decodeToken();

    fireEvent.click(screen.getByRole('button', { name: 'Save run' }));

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Run saved to history'),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/runs',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
