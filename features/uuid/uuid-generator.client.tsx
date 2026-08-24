'use client';

import { useState } from 'react';

import { generateUuids, type RandomBytes, type UuidVersion, validateUuidQuantity } from './uuid';

type CopyState = 'idle' | 'copied';

function browserRandomBytes(length: number) {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure browser cryptography is unavailable.');
  }

  return globalThis.crypto.getRandomValues(new Uint8Array(length));
}

export function UuidGenerator() {
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [quantity, setQuantity] = useState('1');
  const [uuids, setUuids] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copyState, setCopyState] = useState<CopyState>('idle');

  function resetFeedback() {
    setError('');
    setCopyState('idle');
  }

  function handleGenerate() {
    try {
      const nextQuantity = validateUuidQuantity(quantity);
      const nextUuids = generateUuids(version, nextQuantity, browserRandomBytes as RandomBytes);

      setUuids(nextUuids);
      resetFeedback();
    } catch (generationError) {
      setError(
        generationError instanceof Error ? generationError.message : 'Unable to generate UUIDs.',
      );
      setCopyState('idle');
    }
  }

  async function copyText(value: string) {
    if (!navigator.clipboard) {
      setError('Clipboard access is unavailable in this browser.');
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyState('copied');
      setError('');
    } catch {
      setError('Unable to copy UUIDs.');
    }
  }

  return (
    <section aria-labelledby="uuid-generator-title" className="uuid-generator">
      <header className="uuid-generator-header">
        <div>
          <div className="uuid-generator-title-row">
            <h1 id="uuid-generator-title">UUID Generator</h1>
            <span className="uuid-local-badge">Local-only</span>
          </div>
          <p>Generate copy-ready UUIDs locally in your browser.</p>
        </div>
        <p className="uuid-privacy-note">UUIDs are generated entirely in your browser.</p>
      </header>

      <div className="uuid-workspace">
        <section aria-labelledby="uuid-settings-title" className="uuid-panel">
          <h2 id="uuid-settings-title">Settings</h2>
          <fieldset className="uuid-version-control">
            <legend>UUID version</legend>
            <div>
              {(['v1', 'v4', 'v7'] as const).map((option) => (
                <button
                  aria-pressed={version === option}
                  className={version === option ? 'is-selected' : undefined}
                  key={option}
                  onClick={() => {
                    setVersion(option);
                    resetFeedback();
                  }}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="uuid-quantity-field" htmlFor="uuid-quantity">
            <span>Quantity</span>
            <input
              aria-label="Quantity"
              id="uuid-quantity"
              inputMode="numeric"
              onChange={(event) => {
                setQuantity(event.target.value);
                resetFeedback();
              }}
              value={quantity}
            />
            <small>Range: 1–100</small>
          </label>
          {error && (
            <p className="uuid-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="btn btn-primary uuid-generate-button"
            onClick={handleGenerate}
            type="button"
          >
            Generate UUIDs
          </button>
        </section>

        <section aria-labelledby="uuid-results-title" className="uuid-panel uuid-results-panel">
          <div className="uuid-results-header">
            <div>
              <h2 id="uuid-results-title">Generated UUIDs</h2>
              <span>
                {uuids.length
                  ? `${uuids.length} UUID${uuids.length === 1 ? '' : 's'}`
                  : 'No UUIDs yet'}
              </span>
            </div>
            <button
              className="btn"
              disabled={!uuids.length}
              onClick={() => void copyText(uuids.join('\n'))}
              type="button"
            >
              {copyState === 'copied' ? 'Copied all' : 'Copy all'}
            </button>
          </div>

          {uuids.length ? (
            <ul className="uuid-list">
              {uuids.map((uuid) => (
                <li key={uuid}>
                  <code>{uuid}</code>
                  <button
                    aria-label={`Copy ${uuid}`}
                    onClick={() => void copyText(uuid)}
                    type="button"
                  >
                    Copy
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="uuid-empty-state">
              <p>Generated UUIDs will appear here.</p>
            </div>
          )}

          <div className="uuid-result-actions">
            <button className="btn" onClick={handleGenerate} type="button">
              Regenerate
            </button>
            <button
              className="btn"
              disabled={!uuids.length}
              onClick={() => {
                setUuids([]);
                resetFeedback();
              }}
              type="button"
            >
              Clear
            </button>
          </div>
          {copyState === 'copied' && (
            <p className="uuid-copy-status" role="status">
              Copied to clipboard.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}
