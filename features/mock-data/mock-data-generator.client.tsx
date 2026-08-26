'use client';

import { useState } from 'react';

import {
  LOCALES,
  MOCK_DATA_TYPES,
  TEXT_UNITS,
  generateMockData,
  parseSeed,
  toCsv,
  type MockDataType,
  type TextUnit,
  validateQuantity,
} from './mock-data';

const labels: Record<MockDataType, string> = {
  'lorem-ipsum': 'Lorem ipsum',
  people: 'People',
  'user-profiles': 'User profiles',
  products: 'Products',
  dates: 'Dates',
  identifiers: 'Identifiers',
  statuses: 'Statuses',
  'json-records': 'JSON records',
};

export function MockDataGenerator() {
  const [type, setType] = useState<MockDataType>('user-profiles');
  const [unit, setUnit] = useState<TextUnit>('paragraphs');
  const [quantity, setQuantity] = useState('5');
  const [locale, setLocale] = useState('en');
  const [seed, setSeed] = useState('20260826');
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [result, setResult] = useState('');
  const [records, setRecords] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const structured = type !== 'lorem-ipsum';
  const output = structured && format === 'csv' ? toCsv(result ? JSON.parse(result) : []) : result;
  function resetFeedback() {
    setError('');
    setCopied(false);
  }
  function generate() {
    try {
      const next = generateMockData({
        type,
        unit,
        quantity: validateQuantity(quantity),
        locale: locale as 'en' | 'vi',
        seed: parseSeed(seed),
      });
      setResult(next.text);
      setRecords(next.records.length);
      resetFeedback();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to generate mock data.');
      setCopied(false);
    }
  }
  async function copy() {
    if (!output) return;
    if (!navigator.clipboard) {
      setError('Clipboard access is unavailable in this browser.');
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setError('');
    } catch {
      setError('Unable to copy generated output.');
    }
  }
  function download() {
    if (!output) return;
    try {
      const blob = new Blob([output], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mock-data.${format === 'csv' ? 'csv' : structured ? 'json' : 'txt'}`;
      link.click();
      URL.revokeObjectURL(url);
      setError('');
    } catch {
      setError('File download is unavailable in this browser.');
    }
  }
  return (
    <section aria-labelledby="mock-data-title" className="mock-data-generator">
      <header className="mock-data-header">
        <div>
          <div className="mock-data-title-row">
            <h1 id="mock-data-title">Lorem Ipsum / Mock Data Generator</h1>
            <span>Browser-local</span>
          </div>
          <p>
            Generate realistic, non-personal placeholder content for interfaces and API testing.
          </p>
        </div>
      </header>
      <div className="mock-data-workspace">
        <section className="mock-data-panel" aria-labelledby="mock-data-settings">
          <h2 id="mock-data-settings">Generator settings</h2>
          <label>
            Output type
            <select
              aria-label="Output type"
              value={type}
              onChange={(event) => {
                setType(event.target.value as MockDataType);
                resetFeedback();
              }}
            >
              {MOCK_DATA_TYPES.map((value) => (
                <option key={value} value={value}>
                  {labels[value]}
                </option>
              ))}
            </select>
          </label>
          {!structured && (
            <label>
              Text unit
              <select
                aria-label="Text unit"
                value={unit}
                onChange={(event) => setUnit(event.target.value as TextUnit)}
              >
                {TEXT_UNITS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Locale
            <select
              aria-label="Locale"
              value={locale}
              onChange={(event) => {
                setLocale(event.target.value);
                resetFeedback();
              }}
            >
              {LOCALES.map((value) => (
                <option key={value} value={value}>
                  {value === 'en' ? 'English' : 'Vietnamese'}
                </option>
              ))}
            </select>
          </label>
          <div className="mock-data-inputs">
            <label>
              Quantity
              <input
                aria-label="Quantity"
                inputMode="numeric"
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                  resetFeedback();
                }}
              />
            </label>
            <label>
              Seed (optional)
              <input
                aria-label="Seed"
                inputMode="numeric"
                value={seed}
                onChange={(event) => {
                  setSeed(event.target.value);
                  resetFeedback();
                }}
              />
            </label>
          </div>
          <small>Identical settings and seed reproduce identical results.</small>
          {error && (
            <p role="alert" className="mock-data-error">
              {error}
            </p>
          )}
          <div className="mock-data-actions">
            <button className="btn btn-primary" onClick={generate} type="button">
              Generate data
            </button>
            <button
              className="btn"
              onClick={() => {
                setResult('');
                setRecords(0);
                resetFeedback();
              }}
              type="button"
            >
              Clear
            </button>
          </div>
        </section>
        <section
          aria-labelledby="mock-data-output"
          aria-label="Generated output"
          className="mock-data-panel mock-data-output"
        >
          <div className="mock-data-output-header">
            <div>
              <h2 id="mock-data-output">Generated output</h2>
              {structured && (
                <div className="mock-data-tabs">
                  <button
                    aria-pressed={format === 'json'}
                    onClick={() => setFormat('json')}
                    type="button"
                  >
                    JSON
                  </button>
                  <button
                    aria-pressed={format === 'csv'}
                    onClick={() => setFormat('csv')}
                    type="button"
                  >
                    CSV
                  </button>
                </div>
              )}
            </div>
            <div>
              <button className="btn" disabled={!output} onClick={() => void copy()} type="button">
                Copy
              </button>
              <button className="btn" disabled={!output} onClick={download} type="button">
                Download {format.toUpperCase()}
              </button>
            </div>
          </div>
          <pre aria-live="polite">{output || 'Generated content will appear here.'}</pre>
          <footer>
            {result
              ? `${structured ? `${records} records` : `${quantity} ${unit}`} · ${locale === 'en' ? 'English' : 'Vietnamese'}${seed ? ` · Seed ${seed}` : ''}`
              : 'Synthetic values stay in your browser.'}
          </footer>
          {copied && (
            <p role="status" className="mock-data-copied">
              Copied to clipboard.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}
