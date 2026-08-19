'use client';

import { useState } from 'react';

import { ToolWorkspace } from '@/components/tool/tool-workspace';

import { formatJson } from './json';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleFormat() {
    try {
      setOutput(formatJson(input));
      setError('');
    } catch {
      setOutput('');
      setError('Invalid JSON. Check commas, quotes, and brackets.');
    }
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setError('');
  }

  return (
    <ToolWorkspace
      actions={
        <>
          <button className="btn btn-primary" onClick={handleFormat} type="button">
            Format JSON
          </button>
          <button className="btn" onClick={handleClear} type="button">
            Clear
          </button>
        </>
      }
      label="JSON / INPUT"
    >
      <textarea
        aria-label="JSON input"
        className="editor"
        onChange={(event) => setInput(event.target.value)}
        placeholder={'Paste JSON here...\n\n{ "status": "ready" }'}
        value={input}
      />
      {error && (
        <p className="message" role="alert">
          {error}
        </p>
      )}
      {output && (
        <div className="card result result-inline">
          <div className="result-title">Formatted output</div>
          <pre>{output}</pre>
        </div>
      )}
    </ToolWorkspace>
  );
}
