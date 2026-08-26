import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MockDataGenerator } from './mock-data-generator.client';
import { generateMockData, parseSeed, validateQuantity } from './mock-data';

afterEach(() => vi.unstubAllGlobals());

describe('Mock Data Generator - Level 3 advanced/risk-driven', () => {
  it('keeps Vietnamese generated text deterministic (Unicode risk)', () => {
    const settings = {
      type: 'lorem-ipsum' as const,
      unit: 'paragraphs' as const,
      quantity: 2,
      locale: 'vi' as const,
      seed: 99,
    };
    expect(generateMockData(settings).text).toBe(generateMockData(settings).text);
  });
  it('rejects malformed and unsafe seed values (input safety risk)', () => {
    expect(() => parseSeed('1.5')).toThrow('Enter a valid integer seed.');
    expect(() => parseSeed('999999999999999999999')).toThrow('Enter a valid integer seed.');
  });
  it('rejects whitespace and non-numeric quantity values (boundary risk)', () => {
    expect(() => validateQuantity(' ')).toThrow();
    expect(() => validateQuantity('3.2')).toThrow();
  });
  it('uses no remote avatar URL in generated profiles (privacy risk)', () => {
    const result = generateMockData({
      type: 'user-profiles',
      unit: 'words',
      quantity: 5,
      locale: 'en',
      seed: 4,
    });
    expect(JSON.stringify(result)).not.toMatch(/https?:\/\//);
  });
  it('reports unavailable clipboard access without losing generated output (browser capability risk)', () => {
    vi.stubGlobal('navigator', {});
    render(<MockDataGenerator />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate data' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Clipboard access is unavailable');
    expect(screen.getByRole('region', { name: 'Generated output' })).toHaveTextContent(
      '/placeholders/avatars/profile-01.svg',
    );
  });
});
