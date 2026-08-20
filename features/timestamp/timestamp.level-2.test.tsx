import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TimestampConverter } from './timestamp-converter.client';
import { convertTimestamp } from './timestamp';

describe('TimestampConverter — Level 2 realistic/intermediate', () => {
  it('accepts surrounding whitespace in a numeric timestamp', () => {
    expect(convertTimestamp(' 1710000000 ')).toContain('2024-03-09T16:00:00.000Z');
  });

  it('converts a negative seconds timestamp before the epoch', () => {
    expect(convertTimestamp('-1')).toContain('1969-12-31T23:59:59.000Z');
  });

  it('preserves fractional seconds in the UTC result', () => {
    expect(convertTimestamp('1.5')).toContain('1970-01-01T00:00:01.500Z');
  });

  it('starts with no converted result or validation message', () => {
    render(<TimestampConverter />);

    expect(screen.queryByText('Converted date')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('recovers from invalid input when the user corrects it and converts again', () => {
    render(<TimestampConverter />);
    const input = screen.getByLabelText('Unix timestamp');

    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convert timestamp' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convert timestamp' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText(/1970-01-01T00:00:00.000Z/)).toBeInTheDocument();
  });
});
