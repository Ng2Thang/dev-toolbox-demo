import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { JsonFormatter } from './json-formatter.client';

describe('JsonFormatter', () => {
  it('formats valid JSON after a user action', () => {
    render(<JsonFormatter />);
    fireEvent.change(screen.getByLabelText('JSON input'), { target: { value: '{"ok":true}' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }));

    expect(screen.getByText('Formatted output').nextElementSibling).toHaveTextContent('"ok": true');
  });

  it('shows a validation message for invalid JSON', () => {
    render(<JsonFormatter />);
    fireEvent.change(screen.getByLabelText('JSON input'), { target: { value: '{' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid JSON');
  });
});
