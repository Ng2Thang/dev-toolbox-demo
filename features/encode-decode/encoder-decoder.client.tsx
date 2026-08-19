'use client';
import { useState } from 'react';
import { convertText, type Direction, type EncodingFormat } from './encode-decode';
export function EncoderDecoder() {
  const [input, setInput] = useState(
    'Hello World!\nThis is a test string\nfor the Base64 encoder.',
  );
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<EncodingFormat>('base64');
  const [direction, setDirection] = useState<Direction>('encode');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  function run() {
    try {
      setOutput(convertText(input, format, direction));
      setError('');
      setSaved(false);
    } catch (e) {
      setOutput('');
      setError(e instanceof Error ? e.message : 'Unable to convert text.');
    }
  }
  async function save() {
    const response = await fetch('/api/runs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        tool: 'encoder-decoder',
        input,
        output: { format, direction, value: output },
      }),
    });
    if (response.ok) setSaved(true);
    else setError('Unable to save run.');
  }
  return (
    <div className="encoder-workspace">
      <div className="encoder-controls">
        <div className="segmented">
          <button
            className={direction === 'encode' ? 'active' : ''}
            onClick={() => setDirection('encode')}
            type="button"
          >
            Encode
          </button>
          <button
            className={direction === 'decode' ? 'active' : ''}
            onClick={() => setDirection('decode')}
            type="button"
          >
            Decode
          </button>
        </div>
        <select
          aria-label="Encoding format"
          onChange={(e) => setFormat(e.target.value as EncodingFormat)}
          value={format}
        >
          <option value="base64">Base64</option>
          <option value="base64url">Base64URL</option>
          <option value="url">URL percent encoding</option>
          <option value="hex">Hex (UTF-8)</option>
          <option value="html">HTML entities</option>
        </select>
        <span />
        <button
          className="btn"
          onClick={() => {
            setInput(output);
            setOutput('');
            setError('');
          }}
          type="button"
        >
          Swap
        </button>
        <button
          className="btn"
          onClick={() => {
            setInput('');
            setOutput('');
            setError('');
          }}
          type="button"
        >
          Clear
        </button>
      </div>
      <div className="encoder-editors">
        <label className="encoder-panel">
          INPUT
          <textarea
            aria-label="Text input"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <small>UTF-8 · Length: {input.length}</small>
        </label>
        <label className="encoder-panel">
          OUTPUT
          <button
            className="copy-button"
            disabled={!output}
            onClick={() => void navigator.clipboard?.writeText(output)}
            type="button"
          >
            Copy
          </button>
          <textarea aria-label="Converted output" readOnly value={output} />
          <small>Length: {output.length}</small>
        </label>
      </div>
      {error && (
        <p className="message" role="alert">
          {error}
        </p>
      )}
      <div className="encoder-actions">
        <button className="btn btn-primary" onClick={run} type="button">
          ↯ {direction === 'encode' ? 'Encode' : 'Decode'}
        </button>
        {output && (
          <button className="btn" onClick={() => void save()} type="button">
            Save run
          </button>
        )}
        {saved && <span className="success">Run saved to history.</span>}
        <span>Processed locally</span>
      </div>
    </div>
  );
}
