import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MockDataGenerator } from './mock-data-generator.client';
import { generateMockData, validateQuantity } from './mock-data';

describe('Mock Data Generator - Level 1 core/common', () => {
  it('generates the requested number of lorem ipsum words', () => {
    expect(
      generateMockData({
        type: 'lorem-ipsum',
        unit: 'words',
        quantity: 4,
        locale: 'en',
        seed: 1,
      }).text.split(' '),
    ).toHaveLength(4);
  });
  it('generates structured user profiles with local avatar placeholders', () => {
    const result = generateMockData({
      type: 'user-profiles',
      unit: 'words',
      quantity: 2,
      locale: 'en',
      seed: 1,
    });
    expect(result.records).toHaveLength(2);
    expect(result.records[0].avatar).toMatch(/^\/placeholders\/avatars\//);
  });
  it('validates a representative quantity', () => {
    expect(validateQuantity('5')).toBe(5);
  });
  it('shows the approved empty state and local-only boundary', () => {
    render(<MockDataGenerator />);
    expect(screen.getByText('Generated content will appear here.')).toBeInTheDocument();
    expect(screen.getByText('Browser-local')).toBeInTheDocument();
  });
  it('generates profiles through the primary action', () => {
    render(<MockDataGenerator />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate data' }));
    expect(
      screen.getByText('records · English · Seed 20260826', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Generated output' })).toHaveTextContent(
      '/placeholders/avatars/profile-01.svg',
    );
  });
});
