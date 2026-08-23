import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { UuidGenerator } from './uuid-generator.client';
import { generateUuids, MAX_UUID_QUANTITY, validateUuidQuantity, type RandomBytes } from './uuid';

function sequentialRandomBytes(): RandomBytes {
  let value = 0;
  return (length) => Uint8Array.from({ length }, () => value++ & 0xff);
}

describe('UUID Generator - Level 2 realistic/intermediate', () => {
  it('accepts the documented minimum quantity', () => {
    expect(validateUuidQuantity('1')).toBe(1);
  });

  it('accepts the documented maximum quantity', () => {
    expect(generateUuids('v4', MAX_UUID_QUANTITY, sequentialRandomBytes())).toHaveLength(
      MAX_UUID_QUANTITY,
    );
  });

  it('rejects empty, fractional, and out-of-range quantities', () => {
    for (const value of ['', '1.5', '101']) {
      expect(() => validateUuidQuantity(value)).toThrow('Enter a whole number from 1 to 100.');
    }
  });

  it('keeps existing results visible when invalid quantity is submitted', () => {
    render(<UuidGenerator />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate UUIDs' }));
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate UUIDs' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a whole number from 1 to 100.');
    expect(screen.getByText('1 UUID')).toBeInTheDocument();
  });

  it('clears an error after corrected input and can copy the generated batch', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<UuidGenerator />);

    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: 'invalid' } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate UUIDs' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate UUIDs' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy all' }));

    await vi.waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await vi.waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard.'),
    );
  });
});
