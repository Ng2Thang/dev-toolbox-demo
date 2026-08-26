import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Base64EncoderDecoder } from './base64-encoder-decoder.client';
import { decodeBase64, encodeBase64 } from './base64';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Base64 Encoder / Decoder - Level 3 advanced/risk-driven', () => {
  it('round-trips Unicode text without data loss (cross-platform text risk)', () => {
    const input = 'Xin chào 👋 — café';
    expect(decodeBase64(encodeBase64(input, 'standard'), 'standard')).toBe(input);
  });

  it('rejects decoded bytes that are not valid UTF-8 (decoder safety risk)', () => {
    expect(() => decodeBase64('/w==', 'standard')).toThrow(
      'Enter valid Base64 characters and UTF-8 text.',
    );
  });

  it('rejects invalid Base64 padding and structure (malformed input risk)', () => {
    for (const input of ['A', 'AA=', 'AA===', 'AA=A']) {
      expect(() => decodeBase64(input, 'standard')).toThrow(
        'Enter valid Base64 characters and padding.',
      );
    }
  });

  it('shows an actionable error when clipboard access is unavailable (browser capability risk)', () => {
    vi.stubGlobal('navigator', {});
    render(<Base64EncoderDecoder />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Input' }), {
      target: { value: 'Hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Encode Base64' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy output' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Clipboard access is unavailable in this browser.',
    );
    expect(screen.getByLabelText('Base64 output editor')).toHaveTextContent('SGVsbG8=');
  });

  it('round-trips a large deterministic text payload without truncation (text-size resilience risk)', () => {
    const input = 'Dev Toolbox '.repeat(10_000);
    expect(decodeBase64(encodeBase64(input, 'url-safe'), 'url-safe')).toBe(input);
  });
});
