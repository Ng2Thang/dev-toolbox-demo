'use client';

import { useMemo, useState } from 'react';

import {
  formatSql,
  SQL_DIALECT_LABELS,
  SQL_DIALECTS,
  SQL_INDENT_STYLES,
  SQL_KEYWORD_CASES,
  type SqlDialect,
  type SqlIndentStyle,
  type SqlKeywordCase,
} from './sql-formatter';

const initialSql = `select u.id, u.username, p.title, count(c.id) as comments_count
from users u
join posts p on p.user_id = u.id
left join comments c on c.post_id = p.id
where u.active = true and p.created_at > '2023-01-01'
group by u.id, u.username, p.title
order by comments_count desc
limit 10;`;

function LineNumbers({ value }: { value: string }) {
  const count = Math.max(1, value.split(/\r?\n/).length);

  return (
    <span aria-hidden="true" className="sql-line-numbers">
      {Array.from({ length: count }, (_, index) => index + 1).join('\n')}
    </span>
  );
}

export function SqlFormatter() {
  const [dialect, setDialect] = useState<SqlDialect>('postgresql');
  const [keywordCase, setKeywordCase] = useState<SqlKeywordCase>('upper');
  const [indentStyle, setIndentStyle] = useState<SqlIndentStyle>('2');
  const [input, setInput] = useState(initialSql);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  const dialectLabel = SQL_DIALECT_LABELS[dialect];
  const outputPlaceholder = useMemo(() => 'Your formatted SQL will appear here.', []);

  function resetFeedback() {
    setError('');
    setIsValid(false);
    setCopyStatus('');
  }

  function runFormatter() {
    try {
      const nextOutput = formatSql(input, { dialect, keywordCase, indentStyle });
      setOutput(nextOutput);
      setError('');
      setIsValid(true);
      setCopyStatus('');
    } catch (formatError) {
      setError(
        formatError instanceof Error
          ? formatError.message
          : 'Unable to validate this SQL. Correct the query and format again.',
      );
      setIsValid(false);
      setCopyStatus('');
    }
  }

  function clear() {
    setInput('');
    setOutput('');
    resetFeedback();
  }

  async function copyOutput() {
    if (!output) {
      return;
    }

    if (!navigator.clipboard) {
      setCopyStatus('');
      setError('Clipboard access is unavailable in this browser.');
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopyStatus('Copied to clipboard');
      setError('');
    } catch {
      setCopyStatus('');
      setError('Unable to copy formatted SQL. Check browser permissions and try again.');
    }
  }

  return (
    <section aria-labelledby="sql-formatter-title" className="sql-formatter">
      <header className="sql-formatter-header">
        <div>
          <p className="eyebrow">Tools / Formatters</p>
          <div className="sql-title-row">
            <h1 id="sql-formatter-title">SQL Formatter</h1>
            <span>Local only</span>
          </div>
          <p>Format, indent, and validate SQL syntax locally in your browser.</p>
        </div>
      </header>

      <div className="sql-toolbar">
        <label>
          Dialect
          <select
            aria-label="SQL dialect"
            onChange={(event) => {
              setDialect(event.target.value as SqlDialect);
              resetFeedback();
            }}
            value={dialect}
          >
            {SQL_DIALECTS.map((option) => (
              <option key={option} value={option}>
                {SQL_DIALECT_LABELS[option]}
              </option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend>Keyword case</legend>
          <div className="sql-segmented-control">
            {SQL_KEYWORD_CASES.map((option) => (
              <button
                aria-pressed={keywordCase === option}
                className={keywordCase === option ? 'is-selected' : undefined}
                key={option}
                onClick={() => {
                  setKeywordCase(option);
                  resetFeedback();
                }}
                type="button"
              >
                {option === 'upper' ? 'Uppercase' : 'Lowercase'}
              </button>
            ))}
          </div>
        </fieldset>

        <label>
          Indentation
          <select
            aria-label="Indentation"
            onChange={(event) => {
              setIndentStyle(event.target.value as SqlIndentStyle);
              resetFeedback();
            }}
            value={indentStyle}
          >
            {SQL_INDENT_STYLES.map((option) => (
              <option key={option} value={option}>
                {option === 'tabs' ? 'Tabs' : `${option} spaces`}
              </option>
            ))}
          </select>
        </label>

        <div className="sql-toolbar-actions">
          <button className="btn" onClick={clear} type="button">
            Clear
          </button>
          <button className="btn btn-primary" onClick={runFormatter} type="button">
            Format SQL
          </button>
        </div>
      </div>

      <div className="sql-workspace">
        <section aria-label="Input SQL editor" className="sql-panel">
          <div className="sql-panel-heading">
            <label htmlFor="sql-input">Input SQL</label>
          </div>
          <div className="sql-editor">
            <LineNumbers value={input} />
            <textarea
              id="sql-input"
              onChange={(event) => {
                setInput(event.target.value);
                resetFeedback();
              }}
              placeholder="Paste SQL to format..."
              spellCheck={false}
              value={input}
            />
          </div>
          {isValid && (
            <p className="sql-valid" role="status">
              Valid {dialectLabel} syntax
            </p>
          )}
          {error && (
            <div className="sql-error" role="alert">
              <strong>{error}</strong>
              {output && <span>Previous valid output is preserved.</span>}
              <span>Syntax only; database objects are not verified.</span>
            </div>
          )}
        </section>

        <section aria-label="Formatted SQL editor" className="sql-panel">
          <div className="sql-panel-heading">
            <span>Formatted SQL</span>
            <button disabled={!output} onClick={() => void copyOutput()} type="button">
              Copy
            </button>
          </div>
          <div className="sql-editor sql-output">
            <LineNumbers value={output} />
            <pre aria-live="polite">{output || outputPlaceholder}</pre>
          </div>
        </section>
      </div>

      <footer className="sql-privacy-note">
        Your SQL never leaves this browser. This tool does not connect to or execute against a
        database.
      </footer>

      {copyStatus && (
        <p className="sql-copy-toast" role="status">
          {copyStatus}
        </p>
      )}
    </section>
  );
}
