'use client';

import { useState } from 'react';

import { BASE64_VARIANTS, decodeBase64, encodeBase64, type Base64Variant } from './base64';

type Mode = 'encode' | 'decode';

export function Base64EncoderDecoder() {
  const [mode, setMode] = useState<Mode>('encode');
  const [variant, setVariant] = useState<Base64Variant>('standard');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function resetFeedback() {
    setError('');
    setCopied(false);
  }

  function convert() {
    try {
      const nextOutput =
        mode === 'encode' ? encodeBase64(input, variant) : decodeBase64(input, variant);
      setOutput(nextOutput);
      resetFeedback();
    } catch (conversionError) {
      setError(
        conversionError instanceof Error
          ? conversionError.message
          : 'Unable to convert this value.',
      );
      setCopied(false);
    }
  }

  function selectMode(nextMode: Mode) {
    setMode(nextMode);
    resetFeedback();
  }

  function swap() {
    if (!output) {
      return;
    }

    setInput(output);
    setOutput('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
    resetFeedback();
  }

  function clear() {
    setInput('');
    setOutput('');
    resetFeedback();
  }

  async function copyOutput() {
    if (!output) {
      return;
    }

    if (!navigator.clipboard) {
      setError('Clipboard access is unavailable in this browser.');
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setError('');
    } catch {
      setError('Unable to copy output.');
    }
  }

  return (
    <section aria-labelledby="base64-title" className="base64-tool">
      <header className="base64-header">
        <div>
          <p className="eyebrow">Tools / Encode / Decode</p>
          <h1 id="base64-title">Base64 Encoder / Decoder</h1>
          <p>Convert UTF-8 text to Standard or URL-safe Base64 locally.</p>
        </div>
        <span className="base64-local-note">Runs locally in your browser</span>
      </header>

      <div className="base64-controls">
        <fieldset>
          <legend>Conversion direction</legend>
          <div className="base64-segmented-control">
            {(['encode', 'decode'] as const).map((option) => (
              <button
                aria-label={`Switch to ${option === 'encode' ? 'Encode' : 'Decode'} mode`}
                aria-pressed={mode === option}
                className={mode === option ? 'is-selected' : undefined}
                key={option}
                onClick={() => selectMode(option)}
                type="button"
              >
                {option === 'encode' ? 'Encode' : 'Decode'}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Base64 variant</legend>
          <div className="base64-segmented-control">
            {BASE64_VARIANTS.map((option) => (
              <button
                aria-label={`Select ${option === 'standard' ? 'Standard' : 'URL-safe'} Base64`}
                aria-pressed={variant === option}
                className={variant === option ? 'is-selected' : undefined}
                key={option}
                onClick={() => {
                  setVariant(option);
                  resetFeedback();
                }}
                type="button"
              >
                {option === 'standard' ? 'Standard' : 'URL-safe'}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="base64-workspace">
        <section aria-label="Base64 input editor" className="base64-panel">
          <div className="base64-panel-heading">
            <label htmlFor="base64-input">Input</label>
            <span>{input.length} chars</span>
          </div>
          <textarea
            id="base64-input"
            onChange={(event) => {
              setInput(event.target.value);
              resetFeedback();
            }}
            placeholder={
              mode === 'encode' ? 'Paste text to encode...' : 'Paste Base64 to decode...'
            }
            spellCheck={false}
            value={input}
          />
          {error && (
            <p className="base64-error" role="alert">
              {error}
            </p>
          )}
        </section>

        <section aria-label="Base64 output editor" className="base64-panel">
          <div className="base64-panel-heading">
            <span>Output</span>
            <span>{output.length} chars</span>
          </div>
          <pre aria-live="polite">{output || 'Converted output will appear here.'}</pre>
          <button
            className="btn base64-copy-button"
            disabled={!output}
            onClick={() => void copyOutput()}
            type="button"
          >
            Copy output
          </button>
        </section>
      </div>

      <div className="base64-actions">
        <button
          aria-label={`${mode === 'encode' ? 'Encode' : 'Decode'} Base64`}
          className="btn btn-primary"
          onClick={convert}
          type="button"
        >
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
        <button className="btn" disabled={!output} onClick={swap} type="button">
          Swap
        </button>
        <button className="btn" onClick={clear} type="button">
          Clear
        </button>
      </div>

      <aside className="base64-guidance">
        <strong>Standard vs URL-safe Base64</strong>
        <span>
          Standard uses +, /, and optional = padding. URL-safe uses - and _ and may omit padding.
        </span>
      </aside>
      {copied && (
        <p className="base64-copy-status" role="status">
          Copied to clipboard.
        </p>
      )}
    </section>
  );
}
