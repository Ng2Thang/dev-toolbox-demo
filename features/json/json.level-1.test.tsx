import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { JsonFormatter } from './json-formatter.client';
import { formatJson } from './json';

describe('JSON Formatter - Level 1 core/common', () => {
  it('formats a representative JSON object after the primary user action', () => {
    render(<JsonFormatter />);
    fireEvent.change(screen.getByLabelText('JSON input'), { target: { value: '{"ok":true}' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }));

    expect(screen.getByText('Formatted output').nextElementSibling).toHaveTextContent(
      '{ "ok": true }',
    );
  });

  it('formats a valid JSON array', () => {
    expect(formatJson('[1,true,"value"]')).toBe('[\n  1,\n  true,\n  "value"\n]');
  });

  it('preserves a valid JSON string primitive', () => {
    expect(formatJson('"ready"')).toBe('"ready"');
  });

  it('preserves a valid JSON number primitive', () => {
    expect(formatJson('42')).toBe('42');
  });

  it('shows a clear error for empty input', () => {
    render(<JsonFormatter />);
    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Invalid JSON. Check commas, quotes, and brackets.',
    );
  });
});
