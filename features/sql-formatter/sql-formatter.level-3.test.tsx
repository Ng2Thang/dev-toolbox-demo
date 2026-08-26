import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SqlFormatter } from './sql-formatter.client';
import { formatSql } from './sql-formatter';

const defaults = {
  dialect: 'postgresql' as const,
  keywordCase: 'upper' as const,
  indentStyle: '2' as const,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SQL Formatter - Level 3 advanced/risk-driven', () => {
  it('normalizes CRLF input without changing string literals (cross-platform text risk)', () => {
    const result = formatSql("select 'line one' as label\r\nfrom users", defaults);

    expect(result).toContain("'line one'");
    expect(result).not.toContain('\r');
  });

  it('preserves quoted Unicode identifiers and values (Unicode SQL risk)', () => {
    const result = formatSql(
      'select "tên", \'Xin chào 👋\' as message from "người_dùng"',
      defaults,
    );

    expect(result).toContain('"tên"');
    expect(result).toContain("'Xin chào 👋'");
    expect(result).toContain('"người_dùng"');
  });

  it('is idempotent for already formatted SQL (formatter stability risk)', () => {
    const once = formatSql('select id,name from users where active=true', defaults);

    expect(formatSql(once, defaults)).toBe(once);
  });

  it('formats a large deterministic query without truncation (input-size resilience risk)', () => {
    const columns = Array.from({ length: 500 }, (_, index) => `column_${index}`).join(',');
    const result = formatSql(`select ${columns} from records`, defaults);

    expect(result).toContain('column_0');
    expect(result).toContain('column_499');
  });

  it('reports unavailable clipboard access without losing output (browser capability risk)', () => {
    vi.stubGlobal('navigator', {});
    render(<SqlFormatter />);
    fireEvent.click(screen.getByRole('button', { name: 'Format SQL' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Clipboard access is unavailable in this browser.',
    );
    expect(screen.getByLabelText('Formatted SQL editor')).toHaveTextContent('SELECT');
  });

  it('reports rejected clipboard writes without losing output (permission failure risk)', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    render(<SqlFormatter />);
    fireEvent.click(screen.getByRole('button', { name: 'Format SQL' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

    await vi.waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Unable to copy formatted SQL. Check browser permissions and try again.',
      ),
    );
    expect(screen.getByLabelText('Formatted SQL editor')).toHaveTextContent('SELECT');
  });
});
