'use client';

import { useState } from 'react';

import { ToolWorkspace } from '@/components/tool/tool-workspace';
import { decodeJwt, type DecodedJwt } from '@/lib/jwt';

type SaveState = 'idle' | 'saving' | 'saved';

export function JwtDecoder() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');

  function handleDecode() {
    setError('');
    setSaveState('idle');
    setResult(null);

    try {
      setResult(decodeJwt(token));
    } catch (decodeError) {
      setError(decodeError instanceof Error ? decodeError.message : 'Unable to decode JWT.');
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
    <div className="workspace">
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
            setResult(null);
            setSaveState('idle');
          }}
          placeholder="Paste encoded JWT here..."
          value={token}
        />
        <div className="actions">
          <button className="btn btn-primary" onClick={handleDecode} type="button">
            Decode token
          </button>
          {result && (
            <button
              className="btn"
              disabled={saveState === 'saving'}
              onClick={() => void handleSave()}
              type="button"
            >
              {saveState === 'saving' ? 'Saving…' : 'Save run'}
            </button>
          )}
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
      </div>
      {result && (
        <div className="result-grid">
          <div className="card result">
            <div className="result-title">Header</div>
            <pre>{JSON.stringify(result.header, null, 2)}</pre>
          </div>
          <div className="card result">
            <div className="result-title">Payload</div>
            <pre>{JSON.stringify(result.payload, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
