'use client';

import { useState } from 'react';

import { ToolWorkspace } from '@/components/tool/tool-workspace';

import {
  convertDateTime,
  convertTimestamp,
  formatTimestampResult,
  type TimestampResult,
  type TimestampUnit,
} from './timestamp';

type Mode = 'timestamp-to-date' | 'date-to-timestamp';
type CopyState = 'idle' | 'copied';
type SaveState = 'idle' | 'saving' | 'saved';

export function TimestampConverter() {
  const [mode, setMode] = useState<Mode>('timestamp-to-date');
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<TimestampUnit>('seconds');
  const [dateTime, setDateTime] = useState('');
  const [result, setResult] = useState<TimestampResult | null>(null);
  const [error, setError] = useState('');
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [saveState, setSaveState] = useState<SaveState>('idle');

  function resetResult() {
    setResult(null);
    setError('');
    setCopyState('idle');
    setSaveState('idle');
  }

  function handleConvert() {
    try {
      setResult(
        mode === 'timestamp-to-date'
          ? convertTimestamp(timestamp, unit)
          : convertDateTime(dateTime),
      );
      setError('');
      setCopyState('idle');
      setSaveState('idle');
    } catch (conversionError) {
      setResult(null);
      setError(
        conversionError instanceof Error ? conversionError.message : 'Unable to convert timestamp.',
      );
    }
  }

  function handleUseCurrentTime() {
    setTimestamp(String(Math.floor(Date.now() / 1000)));
    setUnit('seconds');
    resetResult();
  }

  async function handleCopy() {
    if (!result || !navigator.clipboard) {
      setError('Clipboard access is unavailable in this browser.');
      return;
    }

    try {
      await navigator.clipboard.writeText(formatTimestampResult(result));
      setCopyState('copied');
    } catch {
      setError('Unable to copy conversion result.');
    }
  }

  async function handleSave() {
    if (!result) {
      return;
    }

    setSaveState('saving');

    try {
      const response = await fetch('/api/runs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          tool: 'unix-timestamp-converter',
          input: mode === 'timestamp-to-date' ? timestamp : dateTime,
          output: result,
        }),
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
    <ToolWorkspace
      actions={
        <>
          {mode === 'timestamp-to-date' && (
            <button className="btn" onClick={handleUseCurrentTime} type="button">
              Use current time
            </button>
          )}
          <button className="btn btn-primary" onClick={handleConvert} type="button">
            Convert
          </button>
        </>
      }
      label="TIME / CONVERT"
    >
      <fieldset className="field-grid">
        <legend className="sr-only">Conversion direction</legend>
        <label className="field">
          <input
            checked={mode === 'timestamp-to-date'}
            name="conversion-mode"
            onChange={() => {
              setMode('timestamp-to-date');
              resetResult();
            }}
            type="radio"
            value="timestamp-to-date"
          />
          Timestamp to date
        </label>
        <label className="field">
          <input
            checked={mode === 'date-to-timestamp'}
            name="conversion-mode"
            onChange={() => {
              setMode('date-to-timestamp');
              resetResult();
            }}
            type="radio"
            value="date-to-timestamp"
          />
          Date to timestamp
        </label>
      </fieldset>
      {mode === 'timestamp-to-date' ? (
        <div className="field-grid">
          <div className="field">
            <label htmlFor="timestamp">Unix timestamp</label>
            <input
              id="timestamp"
              inputMode="decimal"
              onChange={(event) => {
                setTimestamp(event.target.value);
                resetResult();
              }}
              placeholder="1710000000"
              value={timestamp}
            />
          </div>
          <div className="field">
            <label htmlFor="timestamp-unit">Input unit</label>
            <select
              id="timestamp-unit"
              onChange={(event) => {
                setUnit(event.target.value as TimestampUnit);
                resetResult();
              }}
              value={unit}
            >
              <option value="seconds">Seconds</option>
              <option value="milliseconds">Milliseconds</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="field-grid">
          <div className="field">
            <label htmlFor="date-time">Local date and time</label>
            <input
              id="date-time"
              onChange={(event) => {
                setDateTime(event.target.value);
                resetResult();
              }}
              type="datetime-local"
              value={dateTime}
            />
          </div>
        </div>
      )}
      {error && (
        <p className="message" role="alert">
          {error}
        </p>
      )}
      {saveState === 'saved' && (
        <p className="message success" role="status">
          Run saved to history.
        </p>
      )}
      {result && (
        <div className="card result result-inline">
          <div className="result-title">Converted date</div>
          <pre>{formatTimestampResult(result)}</pre>
          <div className="actions">
            <button className="btn" onClick={() => void handleCopy()} type="button">
              {copyState === 'copied' ? 'Copied' : 'Copy result'}
            </button>
            <button
              className="btn btn-primary"
              disabled={saveState === 'saving'}
              onClick={() => void handleSave()}
              type="button"
            >
              {saveState === 'saving' ? 'Saving...' : 'Save run'}
            </button>
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}
