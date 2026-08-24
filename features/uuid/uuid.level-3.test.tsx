import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { UuidGenerator } from './uuid-generator.client';
import { generateUuids, type RandomBytes } from './uuid';

function sequentialRandomBytes(): RandomBytes {
  let batch = 0;
  return (length) => {
    const offset = batch++;
    return Uint8Array.from({ length }, (_, index) => (offset * 17 + index) & 0xff);
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('UUID Generator - Level 3 advanced/risk-driven', () => {
  it('produces unique UUID v4 values in a maximum batch (bounded generator risk)', () => {
    const uuids = generateUuids('v4', 100, sequentialRandomBytes());

    expect(new Set(uuids).size).toBe(100);
  });

  it('keeps encoded UUID v1 timestamps nondecreasing within a batch (time-ordering risk)', () => {
    const uuids = generateUuids('v1', 3, sequentialRandomBytes(), 1_700_000_000_000);
    const timeLows = uuids.map((uuid) => Number.parseInt(uuid.slice(0, 8), 16));

    expect(timeLows[1]).toBeGreaterThan(timeLows[0]);
    expect(timeLows[2]).toBeGreaterThan(timeLows[1]);
  });

  it('encodes the supplied timestamp in UUID v7 values (time-format risk)', () => {
    const milliseconds = 1_700_000_000_123;
    const [uuid] = generateUuids('v7', 1, sequentialRandomBytes(), milliseconds);

    expect(Number.parseInt(uuid.replaceAll('-', '').slice(0, 12), 16)).toBe(milliseconds);
  });

  it('shows an actionable error when secure browser cryptography is unavailable (browser capability risk)', () => {
    vi.stubGlobal('crypto', undefined);
    render(<UuidGenerator />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate UUIDs' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Secure browser cryptography is unavailable.',
    );
  });

  it('shows an actionable error when clipboard writing is rejected (browser permission risk)', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error()) },
    });
    render(<UuidGenerator />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate UUIDs' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy all' }));

    await vi.waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Unable to copy UUIDs.');
    });
  });
});
