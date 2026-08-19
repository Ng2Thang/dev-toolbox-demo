'use client';

import { useState } from 'react';

import { ToolWorkspace } from '@/components/tool/tool-workspace';

import { concatenateLines } from './concatenate';

export function StringConcatenator() {
  const [items, setItems] = useState('first\nsecond\nthird');
  const [separator, setSeparator] = useState(', ');
  const [output, setOutput] = useState('');

  return (
    <ToolWorkspace
      actions={
        <button
          className="btn btn-primary"
          onClick={() => setOutput(concatenateLines(items, separator))}
          type="button"
        >
          Concatenate strings
        </button>
      }
      label="STRING / CONCATENATE"
    >
      <textarea
        aria-label="Strings to concatenate"
        className="editor"
        onChange={(event) => setItems(event.target.value)}
        placeholder="One string per line..."
        value={items}
      />
      <div className="field-grid">
        <div className="field">
          <label htmlFor="separator">Separator</label>
          <input
            id="separator"
            onChange={(event) => setSeparator(event.target.value)}
            value={separator}
          />
        </div>
      </div>
      {output && (
        <div className="card result result-inline">
          <div className="result-title">Result</div>
          <pre>{output}</pre>
        </div>
      )}
    </ToolWorkspace>
  );
}
