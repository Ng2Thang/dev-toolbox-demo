import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { JwtDecoder } from './jwt-decoder.client';

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ.signature';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('JwtDecoder', () => {
  it('renders header and payload panels after decoding a valid token', () => {
    render(<JwtDecoder />);

    fireEvent.change(screen.getByLabelText('JWT token'), { target: { value: validToken } });
    fireEvent.click(screen.getByRole('button', { name: 'Decode token' }));

    expect(screen.getByRole('region', { name: 'Decoded JWT header' })).toHaveTextContent('HS256');
    expect(screen.getByRole('region', { name: 'Decoded JWT payload' })).toHaveTextContent('123');
  });

  it('shows an actionable validation error without requesting the save API', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<JwtDecoder />);

    fireEvent.change(screen.getByLabelText('JWT token'), { target: { value: 'not-a-jwt' } });
    fireEvent.click(screen.getByRole('button', { name: 'Decode token' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Expected three dot-separated segments');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('clears the input and decoded output', () => {
    render(<JwtDecoder />);

    fireEvent.change(screen.getByLabelText('JWT token'), { target: { value: validToken } });
    fireEvent.click(screen.getByRole('button', { name: 'Decode token' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByLabelText('JWT token')).toHaveValue('');
    expect(screen.queryByRole('region', { name: 'Decoded JWT header' })).not.toBeInTheDocument();
  });

  it('copies decoded JSON to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    render(<JwtDecoder />);

    fireEvent.change(screen.getByLabelText('JWT token'), { target: { value: validToken } });
    fireEvent.click(screen.getByRole('button', { name: 'Decode token' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy decoded JSON' }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(expect.stringContaining('"header"')),
    );
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

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
