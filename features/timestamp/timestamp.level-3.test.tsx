import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TimestampConverter } from './timestamp-converter.client';
import { convertDateTime, convertTimestamp } from './timestamp';

afterEach(() => {
  vi.useRealTimers();
});

describe('TimestampConverter � Level 3 advanced/risk-driven', () => {
  it('uses the browser clock for the current-time action (time-dependent default risk)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-09T16:00:00.000Z'));
    render(<TimestampConverter />);

    fireEvent.change(screen.getByLabelText('Unix timestamp'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Use current time' }));

    expect(screen.getByLabelText('Unix timestamp')).toHaveValue('1710000000');
  });

  it('keeps unit handling explicit near previously ambiguous values (unit ambiguity risk)', () => {
    expect(convertTimestamp('100000000000', 'seconds').utc).toBe('5138-11-16T09:46:40.000Z');
    expect(convertTimestamp('100000000000', 'milliseconds').utc).toBe('1973-03-03T09:46:40.000Z');
  });

  it('supports the largest valid JavaScript date timestamp (range-boundary risk)', () => {
    expect(convertTimestamp('8640000000000000', 'milliseconds').utc).toBe(
      '+275760-09-13T00:00:00.000Z',
    );
  });

  it('rejects non-finite numeric input before creating a date (overflow risk)', () => {
    expect(() => convertTimestamp('Infinity', 'seconds')).toThrow(
      'Enter a valid numeric Unix timestamp.',
    );
  });

  it('round-trips a local datetime through its numeric epoch (conversion invariant risk)', () => {
    const result = convertDateTime('2024-03-09T16:00');
    expect(convertTimestamp(String(result.milliseconds), 'milliseconds').milliseconds).toBe(
      result.milliseconds,
    );
  });
});
