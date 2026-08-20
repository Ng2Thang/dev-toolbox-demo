import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TimestampConverter } from './timestamp-converter.client';
import { convertTimestamp } from './timestamp';

afterEach(() => {
  vi.useRealTimers();
});

describe('TimestampConverter — Level 3 advanced/risk-driven', () => {
  it('uses the browser clock for the initial seconds value (time-dependent default risk)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-09T16:00:00.000Z'));

    render(<TimestampConverter />);

    expect(screen.getByLabelText('Unix timestamp')).toHaveValue('1710000000');
  });

  it('treats values below the unit cutoff as seconds (unit ambiguity risk)', () => {
    expect(convertTimestamp('99999999999')).toContain('5138-11-16T09:46:39.000Z');
  });

  it('treats the cutoff value as milliseconds (unit ambiguity risk)', () => {
    expect(convertTimestamp('100000000000')).toContain('1973-03-03T09:46:40.000Z');
  });

  it('supports the largest valid JavaScript date timestamp (range-boundary risk)', () => {
    expect(convertTimestamp('8640000000000000')).toContain('+275760-09-13T00:00:00.000Z');
  });

  it('rejects non-finite numeric input before creating a date (overflow risk)', () => {
    expect(() => convertTimestamp('Infinity')).toThrow('Enter a valid numeric Unix timestamp.');
  });
});
