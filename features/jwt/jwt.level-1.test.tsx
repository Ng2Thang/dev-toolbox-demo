import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { decodeJwt } from '@/lib/jwt';

import { decodeToken, validToken } from './jwt.test-helpers';

describe('JWT Decoder - Level 1 core/common', () => {
  it('decodes a representative JWT header and payload object', () => {
    expect(decodeJwt(validToken)).toEqual({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: { sub: '123', name: 'Alice' },
    });
  });

  it('shows distinct header and payload panels after the primary action', () => {
    decodeToken();

    expect(screen.getByRole('region', { name: 'Decoded JWT header' })).toHaveTextContent('HS256');
    expect(screen.getByRole('region', { name: 'Decoded JWT payload' })).toHaveTextContent('Alice');
  });

  it('rejects empty input with an actionable three-segment error', () => {
    decodeToken('');

    expect(screen.getByRole('alert')).toHaveTextContent('Expected three dot-separated segments');
  });

  it('rejects a token with fewer than three segments', () => {
    expect(() => decodeJwt('header.payload')).toThrow('Expected three dot-separated segments');
  });

  it('rejects a payload that is not a JSON object', () => {
    expect(() => decodeJwt('eyJhbGciOiJIUzI1NiJ9.W10.signature')).toThrow(
      'JWT payload must be a JSON object',
    );
  });
});
