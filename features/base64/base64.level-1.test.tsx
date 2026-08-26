import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Base64EncoderDecoder } from './base64-encoder-decoder.client';
import { decodeBase64, encodeBase64 } from './base64';

describe('Base64 Encoder / Decoder - Level 1 core/common', () => {
  it('encodes representative UTF-8 text as standard Base64', () => {
    expect(encodeBase64('Hello, Dev Toolbox!', 'standard')).toBe('SGVsbG8sIERldiBUb29sYm94IQ==');
  });

  it('decodes representative standard Base64 text', () => {
    expect(decodeBase64('SGVsbG8sIERldiBUb29sYm94IQ==', 'standard')).toBe('Hello, Dev Toolbox!');
  });

  it('encodes URL-sensitive text with the URL-safe variant', () => {
    expect(encodeBase64('???', 'url-safe')).toBe('Pz8_');
  });

  it('shows the approved empty workspace before conversion', () => {
    render(<Base64EncoderDecoder />);

    expect(screen.getByText('Converted output will appear here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy output' })).toBeDisabled();
    expect(screen.getByText('Runs locally in your browser')).toBeInTheDocument();
  });

  it('encodes input through the primary action and exposes a copyable result', () => {
    render(<Base64EncoderDecoder />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Input' }), {
      target: { value: 'Hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Encode Base64' }));

    expect(screen.getByLabelText('Base64 output editor')).toHaveTextContent('SGVsbG8=');
    expect(screen.getByRole('button', { name: 'Copy output' })).toBeEnabled();
  });
});
