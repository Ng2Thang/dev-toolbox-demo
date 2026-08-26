import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SqlFormatter } from './sql-formatter.client';
import { formatSql } from './sql-formatter';

const defaults = {
  dialect: 'postgresql' as const,
  keywordCase: 'upper' as const,
  indentStyle: '2' as const,
};

describe('SQL Formatter - Level 1 core/common', () => {
  it('formats a representative SELECT query with readable clauses', () => {
    const result = formatSql('select id,name from users where active=true', defaults);

    expect(result).toContain('SELECT\n  id,\n  name\nFROM\n  users');
    expect(result).toContain('WHERE\n  active = TRUE');
  });

  it('accepts the six required statement families', () => {
    const statements = [
      'SELECT * FROM users',
      'INSERT INTO users(id) VALUES (1)',
      'UPDATE users SET id = 2',
      'DELETE FROM users',
      'CREATE TABLE users(id INT)',
      'ALTER TABLE users ADD name VARCHAR(20)',
    ];

    for (const statement of statements) {
      expect(formatSql(statement, defaults)).toBeTruthy();
    }
  });

  it('rejects empty SQL with an actionable message', () => {
    expect(() => formatSql('  \n ', defaults)).toThrow('Enter SQL to format and validate.');
  });

  it('formats input through the primary UI action and enables copying', () => {
    render(<SqlFormatter />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Input SQL' }), {
      target: { value: 'select id from users' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Format SQL' }));

    expect(screen.getByLabelText('Formatted SQL editor')).toHaveTextContent('SELECT');
    expect(screen.getByText('Valid PostgreSQL syntax')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeEnabled();
  });

  it('shows the approved local-only boundary and initial output state', () => {
    render(<SqlFormatter />);

    expect(screen.getByText('Local only')).toBeInTheDocument();
    expect(screen.getByText(/Your SQL never leaves this browser/)).toBeInTheDocument();
    expect(screen.getByText('Your formatted SQL will appear here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeDisabled();
  });
});
