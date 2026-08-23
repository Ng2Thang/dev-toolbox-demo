'use client';

import { useState } from 'react';

import { decodeJwt, type DecodedJwt } from '@/lib/jwt';

type CopyState = 'idle' | 'copied';
type SaveState = 'idle' | 'saving' | 'saved';

function formatDecodedJwt(result: DecodedJwt) {
  return JSON.stringify(result, null, 2);
}

export function JwtDecoder() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState('');
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [saveState, setSaveState] = useState<SaveState>('idle');

  function resetResultState() {
    setResult(null);
    setError('');
    setCopyState('idle');
    setSaveState('idle');
  }

  function handleDecode() {
    resetResultState();

    try {
      setResult(decodeJwt(token));
    } catch (decodeError) {
      setError(decodeError instanceof Error ? decodeError.message : 'Unable to decode JWT.');
    }
  }

  function handleClear() {
    setToken('');
    resetResultState();
  }

  async function handleCopy() {
    if (!result || !navigator.clipboard) {
      setError('Clipboard access is unavailable in this browser.');
      return;
    }

    try {
      await navigator.clipboard.writeText(formatDecodedJwt(result));
      setCopyState('copied');
    } catch {
      setError('Unable to copy decoded JWT.');
    }
  }

  async function handleSave() {
    if (!result) {
      return;
    }

    setError('');
    setSaveState('saving');

    try {
      const response = await fetch('/api/runs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tool: 'jwt-decoder', input: token, output: result }),
      });

      if (!response.ok) {
        throw new Error('Unable to save run.');
      }

      setSaveState('saved');
    } catch (saveError) {
      setSaveState('idle');
      setError(saveError instanceof Error ? saveError.message : 'Unable to save run.');
    }
  }

  return (
    <section aria-labelledby="jwt-decoder-title" className="workspace jwt-decoder">
      <header className="jwt-decoder-header">
        <div>
          <p className="eyebrow">Security / decode</p>
          <h1 id="jwt-decoder-title">JWT Decoder</h1>
          <p>
            Inspect JWT header and payload claims locally. Signature verification is not performed.
          </p>
        </div>
        <span className="jwt-local-badge">Local-only</span>
      </header>

      <div className="card workspace-card">
        <div className="workspace-bar">
          <strong>JWT / INPUT</strong>
          <span>Local processing</span>
        </div>
        <textarea
          aria-label="JWT token"
          className="editor"
          onChange={(event) => {
            setToken(event.target.value);
            resetResultState();
          }}
          placeholder="Paste encoded JWT here..."
          spellCheck={false}
          value={token}
        />
        <div className="actions">
          <button className="btn" onClick={handleClear} type="button">
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleDecode} type="button">
            Decode token
          </button>
        </div>
      </div>

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

      {result ? (
        <div className="result-grid">
          <section className="card result" aria-label="Decoded JWT header">
            <div className="result-title">Header</div>
            <pre>{JSON.stringify(result.header, null, 2)}</pre>
          </section>
          <section className="card result" aria-label="Decoded JWT payload">
            <div className="result-title">Payload</div>
            <pre>{JSON.stringify(result.payload, null, 2)}</pre>
          </section>
          <div className="jwt-result-actions">
            <button className="btn" onClick={() => void handleCopy()} type="button">
              {copyState === 'copied' ? 'Copied' : 'Copy decoded JSON'}
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
      ) : (
        <div className="card tool-empty-state" aria-live="polite">
          <strong>Decoded header and payload will appear here.</strong>
          <p className="muted">Paste a compact three-segment JWT, then select Decode token.</p>
        </div>
      )}
    </section>
  );
}
