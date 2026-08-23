import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { UuidGenerator } from './uuid-generator.client';
import { generateUuids, type RandomBytes } from './uuid';

function sequentialRandomBytes(): RandomBytes {
  let value = 0;
  return (length) => Uint8Array.from({ length }, () => value++ & 0xff);
}

describe('UUID Generator - Level 1 core/common', () => {
  it('generates a valid UUID v1', () => {
    const [uuid] = generateUuids('v1', 1, sequentialRandomBytes(), 1_700_000_000_000);

    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('generates a valid UUID v4', () => {
    const [uuid] = generateUuids('v4', 1, sequentialRandomBytes(), 1_700_000_000_000);

    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('generates a valid UUID v7', () => {
    const [uuid] = generateUuids('v7', 1, sequentialRandomBytes(), 1_700_000_000_000);

    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('shows the approved empty state before generation', () => {
    render(<UuidGenerator />);

    expect(screen.getByText('Generated UUIDs will appear here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy all' })).toBeDisabled();
  });

  it('generates the requested number of UUIDs from the primary action', () => {
    render(<UuidGenerator />);
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate UUIDs' }));

    expect(screen.getByText('2 UUIDs')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Copy [0-9a-f]{8}-/ })).toHaveLength(2);
  });
});
