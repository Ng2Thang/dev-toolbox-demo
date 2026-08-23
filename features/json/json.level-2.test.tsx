import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { JsonFormatter } from './json-formatter.client';
import { formatJson } from './json';

describe('JSON Formatter - Level 2 realistic/intermediate', () => {
  it('normalizes surrounding whitespace around valid JSON', () => {
    expect(formatJson('  \n { "status" : "ready" } \n ')).toBe('{\n  "status": "ready"\n}');
  });

  it('formats nested arrays and objects', () => {
    expect(formatJson('{"items":[{"id":1},{"id":2}]}')).toBe(
      '{\n  "items": [\n    {\n      "id": 1\n    },\n    {\n      "id": 2\n    }\n  ]\n}',
    );
  });

  it('preserves boolean and null primitives', () => {
    expect(formatJson('true')).toBe('true');
    expect(formatJson('null')).toBe('null');
  });

  it('retains invalid input and succeeds after the user corrects it', () => {
    render(<JsonFormatter />);
    const input = screen.getByLabelText('JSON input');

    fireEvent.change(input, { target: { value: '{' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format' }));
    expect(input).toHaveValue('{');
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '{"fixed":true}' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText('JSON output editor')).toHaveTextContent('"fixed": true');
  });

  it('clears input, formatted output, and an existing error', () => {
    render(<JsonFormatter />);
    const input = screen.getByLabelText('JSON input');
    fireEvent.change(input, { target: { value: '{' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(input).toHaveValue('');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText('JSON output editor')).toHaveTextContent(
      '"project": "Dev Toolbox"',
    );
  });
});
