'use client';

import { useState } from 'react';

import { ToolWorkspace } from '@/components/tool/tool-workspace';

import { generateUuids } from './uuid';

export function UuidGenerator() {
  const [count, setCount] = useState('1');
  const [output, setOutput] = useState('');

  return (
    <ToolWorkspace
      actions={
        <button
          className="btn btn-primary"
          onClick={() => setOutput(generateUuids(count).join('\n'))}
          type="button"
        >
          Generate UUIDs
        </button>
      }
      label="UUID / GENERATE"
    >
      <div className="field-grid">
        <div className="field">
          <label htmlFor="count">Quantity (1-20)</label>
          <input
            id="count"
            max="20"
            min="1"
            onChange={(event) => setCount(event.target.value)}
            type="number"
            value={count}
          />
        </div>
      </div>
      {output ? (
        <div className="card result result-inline">
          <div className="result-title">Generated identifiers</div>
          <pre>{output}</pre>
        </div>
      ) : (
        <p className="muted tool-empty-state">
          Generate one or more v4 UUIDs for your next test fixture.
        </p>
      )}
    </ToolWorkspace>
  );
}
