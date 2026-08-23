import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TimestampConverter } from './timestamp-converter.client';
import { convertTimestamp } from './timestamp';

describe('TimestampConverter � Level 2 realistic/intermediate', () => {
  it('accepts surrounding whitespace in a numeric timestamp', () => {
    expect(convertTimestamp(' 1710000000 ', 'seconds').utc).toBe('2024-03-09T16:00:00.000Z');
  });

  it('converts a negative seconds timestamp before the epoch', () => {
    expect(convertTimestamp('-1', 'seconds').utc).toBe('1969-12-31T23:59:59.000Z');
  });

  it('preserves fractional seconds in the UTC result', () => {
    expect(convertTimestamp('1.5', 'seconds').utc).toBe('1970-01-01T00:00:01.500Z');
  });

  it('switches to date-to-timestamp conversion and returns numeric epoch values', () => {
    render(<TimestampConverter />);
    fireEvent.click(screen.getByLabelText('Date to timestamp'));
    fireEvent.change(screen.getByLabelText('Local date and time'), {
      target: { value: '2024-03-09T16:00' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }));

    expect(screen.getByText(/Unix seconds:/)).toBeInTheDocument();
    expect(screen.getByText(/Unix milliseconds:/)).toBeInTheDocument();
  });

  it('recovers from invalid input when the user corrects it and converts again', () => {
    render(<TimestampConverter />);
    const input = screen.getByLabelText('Unix timestamp');

    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText(/1970-01-01T00:00:00.000Z/)).toBeInTheDocument();
  });
});
