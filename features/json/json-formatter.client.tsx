'use client';

import { useState } from 'react';

import { formatJson, type JsonIndent } from './json';

const INITIAL_INPUT = `{
  "project": "Dev Toolbox",
  "status": "active"
  "version": 1.0,
}`;

const EXAMPLE_INPUT = `{
  "project": "Dev Toolbox",
  "status": "active",
  "version": 1.0
}`;

const EMPTY_OUTPUT = `{
  "project": "Dev Toolbox",
  "status": "active",
  "version": 1.0
}`;

type SaveState = 'idle' | 'saving' | 'saved';

function lineNumbers(value: string) {
  return Array.from({ length: Math.max(1, value.split('\n').length) }, (_, index) => index + 1);
}

export function JsonFormatter() {
  const [input, setInput] = useState(INITIAL_INPUT);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('Invalid JSON: Expected double quote at line 4, column 15.');
  const [indent, setIndent] = useState<JsonIndent>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [copyState, setCopyState] = useState(false);

  function handleFormat() {
    try {
      setOutput(formatJson(input, indent, sortKeys));
      setError('');
      setSaveState('idle');
    } catch {
      setOutput('');
      setSaveState('idle');
      setError('Invalid JSON: Check commas, quotes, and brackets.');
    }
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setError('');
    setSaveState('idle');
    setCopyState(false);
  }

  function handleExample() {
    setInput(EXAMPLE_INPUT);
    setOutput('');
    setError('');
    setSaveState('idle');
    setCopyState(false);
  }

  async function handleCopy() {
    if (!output || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopyState(true);
    } catch {
      setError('Unable to copy formatted JSON.');
    }
  }

  async function handleSave() {
    if (!output) {
      return;
    }

    setSaveState('saving');

    try {
      const response = await fetch('/api/runs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tool: 'json-formatter', input, output: JSON.parse(output) }),
      });

      if (!response.ok) {
        throw new Error('Unable to save run.');
      }

      setSaveState('saved');
    } catch {
      setSaveState('idle');
      setError('Unable to save run.');
    }
  }

  return (
    <section className="json-formatter" aria-labelledby="json-formatter-title">
      <header className="json-formatter-header">
        <div>
          <div className="json-formatter-title-row">
            <h1 id="json-formatter-title">JSON Formatter</h1>
            <span className="json-local-badge">Local-only</span>
          </div>
          <p>Prettify, minify, and validate JSON data locally in your browser.</p>
        </div>
        <div className="json-controls">
          <fieldset className="json-indent-control">
            <legend>Indent:</legend>
            <div>
              {([2, 4, 'tab'] as const).map((option) => {
                const label = option === 'tab' ? 'Tabs' : `${option} Spaces`;
                return (
                  <button
                    aria-pressed={indent === option}
                    className={indent === option ? 'is-selected' : undefined}
                    key={option}
                    onClick={() => setIndent(option)}
                    type="button"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <label className="json-sort-control">
            <span>Sort keys:</span>
            <input
              checked={sortKeys}
              onChange={(event) => setSortKeys(event.target.checked)}
              type="checkbox"
            />
          </label>
        </div>
      </header>

      {error && (
        <div className="json-banner" role="alert">
          <strong>Invalid JSON:</strong>
          <span>{error.replace('Invalid JSON: ', '')}</span>
          <button aria-label="Dismiss JSON error" onClick={() => setError('')} type="button">
            ×
          </button>
        </div>
      )}
      {saveState === 'saved' && (
        <p className="json-success" role="status">
          Successfully formatted and saved.
        </p>
      )}

      <div className="json-editor-grid">
        <section className="json-editor-panel" aria-label="JSON input editor">
          <div className="json-panel-heading">Input</div>
          <div className="json-editor-body">
            <ol aria-hidden="true" className="json-line-numbers">
              {lineNumbers(input).map((number) => (
                <li key={number}>{number}</li>
              ))}
            </ol>
            <textarea
              aria-label="JSON input"
              onChange={(event) => {
                setInput(event.target.value);
                setOutput('');
                setError('');
                setSaveState('idle');
                setCopyState(false);
              }}
              placeholder="Paste your JSON here..."
              spellCheck={false}
              value={input}
            />
          </div>
          <footer className="json-panel-footer">
            <span>{`Ln ${lineNumbers(input).length}, Col ${input.split('\n').at(-1)?.length ?? 0}`}</span>
            <span>{`${input.length} chars`}</span>
            <div>
              <button onClick={handleClear} type="button">
                Clear
              </button>
              <button className="btn-primary" onClick={handleFormat} type="button">
                Format
              </button>
            </div>
          </footer>
        </section>

        <section className="json-editor-panel" aria-label="JSON output editor">
          <div className="json-panel-heading">Output</div>
          <div className="json-editor-body json-output-body">
            <ol aria-hidden="true" className="json-line-numbers">
              {lineNumbers(output || EMPTY_OUTPUT).map((number) => (
                <li key={number}>{number}</li>
              ))}
            </ol>
            <pre>{output || EMPTY_OUTPUT}</pre>
            {error && (
              <div className="json-output-overlay">
                <span aria-hidden="true">!</span>
                <p>Fix errors in input to format</p>
                <button onClick={handleFormat} type="button">
                  Validate Anyway
                </button>
              </div>
            )}
          </div>
          <footer className="json-panel-footer">
            <span className={error ? 'json-status-error' : 'json-status-success'}>
              {error ? 'Error' : 'Successfully formatted'}
            </span>
            <div>
              <button onClick={handleExample} type="button">
                Example
              </button>
              <button
                disabled={!output || saveState === 'saving'}
                onClick={() => void handleSave()}
                type="button"
              >
                {saveState === 'saving' ? 'Saving…' : 'Save Run'}
              </button>
              <button disabled={!output} onClick={() => void handleCopy()} type="button">
                {copyState ? 'Copied' : 'Copy'}
              </button>
            </div>
          </footer>
        </section>
      </div>

      <footer className="json-page-footer">
        <span>© 2024 Dev Toolbox</span>
        <span>Documentation · Keyboard Shortcuts</span>
      </footer>
    </section>
  );
}
