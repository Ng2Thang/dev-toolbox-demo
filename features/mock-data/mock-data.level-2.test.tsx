import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MockDataGenerator } from './mock-data-generator.client';
import { MAX_MOCK_DATA_QUANTITY, generateMockData, toCsv } from './mock-data';

describe('Mock Data Generator - Level 2 realistic/intermediate', () => {
  it('produces repeatable output for the same settings and seed', () => {
    const settings = {
      type: 'people' as const,
      unit: 'words' as const,
      quantity: 2,
      locale: 'vi' as const,
      seed: 42,
    };
    expect(generateMockData(settings)).toEqual(generateMockData(settings));
  });
  it('supports the maximum safe quantity', () => {
    expect(
      generateMockData({
        type: 'statuses',
        unit: 'words',
        quantity: MAX_MOCK_DATA_QUANTITY,
        locale: 'en',
        seed: 7,
      }).records,
    ).toHaveLength(MAX_MOCK_DATA_QUANTITY);
  });
  it('exports tabular records as escaped CSV', () => {
    expect(toCsv([{ id: 'one', name: 'A "quoted" value' }])).toBe(
      'id,name\n"one","A ""quoted"" value"',
    );
  });
  it('preserves previous output after invalid quantity and recovers after correction', () => {
    render(<MockDataGenerator />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate data' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Quantity' }), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate data' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a whole number');
    expect(screen.getByRole('region', { name: 'Generated output' })).toHaveTextContent(
      '/placeholders/avatars/profile-01.svg',
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Quantity' }), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate data' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it('switches CSV output and copies a successful result', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<MockDataGenerator />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate data' }));
    fireEvent.click(screen.getByRole('button', { name: 'CSV' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await vi.waitFor(() => expect(writeText).toHaveBeenCalled());
    await vi.waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard.'),
    );
  });
});
