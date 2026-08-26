import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Base64EncoderDecoder } from './base64-encoder-decoder.client';
import { decodeBase64 } from './base64';

describe('Base64 Encoder / Decoder - Level 2 realistic/intermediate', () => {
  it('decodes valid padded and unpadded URL-safe values identically', () => {
    expect(decodeBase64('Pw', 'url-safe')).toBe('?');
    expect(decodeBase64('Pw', 'url-safe')).toBe(decodeBase64('Pw==', 'url-safe'));
  });

  it('switches to Decode mode and decodes the supplied input', () => {
    render(<Base64EncoderDecoder />);
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Decode mode' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Input' }), {
      target: { value: 'SGVsbG8=' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Decode Base64' }));

    expect(screen.getByLabelText('Base64 output editor')).toHaveTextContent('Hello');
  });

  it('swaps a successful output into input and reverses conversion direction', () => {
    render(<Base64EncoderDecoder />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Input' }), {
      target: { value: 'Hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Encode Base64' }));
    fireEvent.click(screen.getByRole('button', { name: 'Swap' }));

    expect(screen.getByRole('textbox', { name: 'Input' })).toHaveValue('SGVsbG8=');
    expect(screen.getByRole('button', { name: 'Switch to Decode mode' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Decode Base64' }));
    expect(screen.getByLabelText('Base64 output editor')).toHaveTextContent('Hello');
  });

  it('preserves a successful output when malformed input is submitted and recovers after correction', () => {
    render(<Base64EncoderDecoder />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Input' }), {
      target: { value: 'Hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Encode Base64' }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Decode mode' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Input' }), {
      target: { value: 'not base64!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Decode Base64' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter valid Base64 characters and padding.',
    );
    expect(screen.getByLabelText('Base64 output editor')).toHaveTextContent('SGVsbG8=');

    fireEvent.change(screen.getByRole('textbox', { name: 'Input' }), {
      target: { value: 'SGVsbG8=' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Decode Base64' }));
    expect(screen.getByLabelText('Base64 output editor')).toHaveTextContent('Hello');
  });

  it('clears the workspace and copies a successful result', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<Base64EncoderDecoder />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Input' }), {
      target: { value: 'Hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Encode Base64' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy output' }));

    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('SGVsbG8='));
    await vi.waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard.'),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('textbox', { name: 'Input' })).toHaveValue('');
    expect(screen.getByText('Converted output will appear here.')).toBeInTheDocument();
  });
});
