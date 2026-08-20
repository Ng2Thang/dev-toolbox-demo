import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { JsonFormatter } from './json-formatter.client';

describe('JsonFormatter', () => {
  it('formats valid JSON after a user action', () => {
    render(<JsonFormatter />);
    fireEvent.change(screen.getByLabelText('JSON input'), { target: { value: '{"ok":true}' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format' }));

    expect(screen.getByLabelText('JSON output editor')).toHaveTextContent('"ok": true');
    expect(screen.getByRole('button', { name: 'Save Run' })).toBeEnabled();
  });

  it('shows a validation message for invalid JSON', () => {
    render(<JsonFormatter />);
    fireEvent.change(screen.getByLabelText('JSON input'), { target: { value: '{' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid JSON');
  });

  it('formats with the selected indentation and sorted keys', () => {
    render(<JsonFormatter />);
    fireEvent.change(screen.getByLabelText('JSON input'), {
      target: { value: '{"z":1,"a":{"b":2,"a":3}}' },
    });
    fireEvent.click(screen.getByRole('button', { name: '4 Spaces' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Sort keys:' }));
    fireEvent.click(screen.getByRole('button', { name: 'Format' }));

    const output = screen.getByLabelText('JSON output editor').querySelector('pre');

    expect(output?.textContent).toContain('    "a"');
    expect(output?.textContent).toContain('        "a"');
  });
});
