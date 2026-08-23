import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TimestampConverter } from './timestamp-converter.client';
import { convertTimestamp } from './timestamp';

describe('TimestampConverter — Level 1 core/common', () => {
  it('converts Unix epoch seconds to an ISO UTC value', () => {
    expect(convertTimestamp('1710000000')).toContain('2024-03-09T16:00:00.000Z');
  });

  it('converts Unix epoch milliseconds to the same ISO UTC value', () => {
    expect(convertTimestamp('1710000000000')).toContain('2024-03-09T16:00:00.000Z');
  });

  it('shows UTC and local representations after the primary action', () => {
    render(<TimestampConverter />);
    fireEvent.change(screen.getByLabelText('Unix timestamp'), { target: { value: '1710000000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Convert timestamp' }));

    expect(screen.getByText('Converted date')).toBeInTheDocument();
    expect(screen.getByText(/2024-03-09T16:00:00.000Z/)).toHaveTextContent('Local:');
  });

  it('shows an actionable error for non-numeric input', () => {
    render(<TimestampConverter />);
    fireEvent.change(screen.getByLabelText('Unix timestamp'), {
      target: { value: 'not-a-number' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Convert timestamp' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid numeric Unix timestamp.');
  });

  it('rejects a timestamp outside the JavaScript date range', () => {
    expect(() => convertTimestamp('8640000000000001')).toThrow(
      'Timestamp is outside the supported date range.',
    );
  });
});
