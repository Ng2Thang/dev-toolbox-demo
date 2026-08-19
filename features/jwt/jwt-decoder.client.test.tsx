import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { JwtDecoder } from './jwt-decoder.client';

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ.signature';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('JwtDecoder', () => {
  it('only offers Save run after successful decoding and saves the result', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    render(<JwtDecoder />);

    expect(screen.queryByRole('button', { name: 'Save run' })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('JWT token'), { target: { value: validToken } });
    fireEvent.click(screen.getByRole('button', { name: 'Decode token' }));
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
