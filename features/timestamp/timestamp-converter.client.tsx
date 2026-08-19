'use client';

import { useState } from 'react';

import { ToolWorkspace } from '@/components/tool/tool-workspace';

import { convertTimestamp } from './timestamp';

export function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)));
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleConvert() {
    try {
      setOutput(convertTimestamp(timestamp));
      setError('');
    } catch (conversionError) {
      setOutput('');
      setError(
        conversionError instanceof Error ? conversionError.message : 'Unable to convert timestamp.',
      );
    }
  }

  return (
    <ToolWorkspace
      actions={
        <button className="btn btn-primary" onClick={handleConvert} type="button">
          Convert timestamp
        </button>
      }
      label="TIME / CONVERT"
    >
      <div className="field-grid">
        <div className="field">
          <label htmlFor="timestamp">Unix timestamp</label>
          <input
            id="timestamp"
            inputMode="numeric"
            onChange={(event) => setTimestamp(event.target.value)}
            placeholder="1710000000"
            value={timestamp}
          />
        </div>
      </div>
      {error && (
        <p className="message" role="alert">
          {error}
        </p>
      )}
      {output && (
        <div className="card result result-inline">
          <div className="result-title">Converted date</div>
          <pre>{output}</pre>
        </div>
      )}
    </ToolWorkspace>
  );
}
