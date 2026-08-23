import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { decodeJwt } from '@/lib/jwt';

import { decodeToken } from './jwt.test-helpers';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('JWT Decoder - Level 3 advanced/risk-driven', () => {
  it('decodes Unicode claims safely for browser-local inspection', () => {
    const token =
      'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoi5pel5pys6KqeIiwibWVzc2FnZSI6IumcnuKAje-4j-Kfqe-4jyJ9.signature';

    expect(decodeJwt(token)).toMatchObject({
      payload: { name: String.fromCodePoint(0x65e5, 0x672c, 0x8a9e) },
    });
  });

  it('reports invalid Base64URL segments without exposing token content', () => {
    expect(() => decodeJwt('@@@.eyJzdWIiOiIxMjMifQ.signature')).toThrow(
      'JWT contains an invalid Base64URL segment',
    );
  });

  it('copies the combined decoded JSON through the browser clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    decodeToken();

    fireEvent.click(screen.getByRole('button', { name: 'Copy decoded JSON' }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(expect.stringContaining('"payload"')),
    );
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('shows a safe error when clipboard access is unavailable', () => {
    vi.stubGlobal('navigator', {});
    decodeToken();

    fireEvent.click(screen.getByRole('button', { name: 'Copy decoded JSON' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Clipboard access is unavailable');
  });

  it('surfaces a failed save response without losing the decoded result', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 500 })));
    decodeToken();

    fireEvent.click(screen.getByRole('button', { name: 'Save run' }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Unable to save run'));
    expect(screen.getByRole('region', { name: 'Decoded JWT payload' })).toHaveTextContent('Alice');
  });
});
