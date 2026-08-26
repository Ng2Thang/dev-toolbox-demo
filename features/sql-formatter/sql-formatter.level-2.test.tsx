import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SqlFormatter } from './sql-formatter.client';
import { formatSql, SQL_DIALECTS } from './sql-formatter';

describe('SQL Formatter - Level 2 realistic/intermediate', () => {
  it('uses lowercase SQL keywords when selected', () => {
    const result = formatSql('SELECT id FROM users WHERE active = TRUE', {
      dialect: 'postgresql',
      keywordCase: 'lower',
      indentStyle: '2',
    });

    expect(result).toContain('select\n  id\nfrom');
    expect(result).not.toContain('SELECT');
  });

  it('supports four-space and tab indentation preferences', () => {
    const sql = 'select * from users where id in (select user_id from sessions)';
    const spaces = formatSql(sql, {
      dialect: 'postgresql',
      keywordCase: 'upper',
      indentStyle: '4',
    });
    const tabs = formatSql(sql, {
      dialect: 'postgresql',
      keywordCase: 'upper',
      indentStyle: 'tabs',
    });

    expect(spaces).toContain('\n    *');
    expect(tabs).toContain('\n\t*');
  });

  it('validates representative input for every supported dialect', () => {
    for (const dialect of SQL_DIALECTS) {
      expect(
        formatSql('SELECT id FROM users', {
          dialect,
          keywordCase: 'upper',
          indentStyle: '2',
        }),
      ).toContain('SELECT');
    }
  });

  it('preserves valid output after a syntax error and recovers after correction', () => {
    render(<SqlFormatter />);
    const input = screen.getByRole('textbox', { name: 'Input SQL' });
    fireEvent.change(input, { target: { value: 'select id from users' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format SQL' }));
    fireEvent.change(input, { target: { value: 'select id from from users' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format SQL' }));

    expect(screen.getByRole('alert')).toHaveTextContent(/Unexpected USERS at line 1/);
    expect(screen.getByRole('alert')).toHaveTextContent('Previous valid output is preserved.');
    expect(screen.getByLabelText('Formatted SQL editor')).toHaveTextContent('SELECT');

    fireEvent.change(input, { target: { value: 'select name from users' } });
    fireEvent.click(screen.getByRole('button', { name: 'Format SQL' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Formatted SQL editor')).toHaveTextContent('name');
  });

  it('copies a result and clears the complete workspace', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<SqlFormatter />);
    fireEvent.click(screen.getByRole('button', { name: 'Format SQL' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

    await vi.waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    expect(await screen.findByText('Copied to clipboard', { exact: true })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('textbox', { name: 'Input SQL' })).toHaveValue('');
    expect(screen.getByText('Your formatted SQL will appear here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeDisabled();
  });
});
