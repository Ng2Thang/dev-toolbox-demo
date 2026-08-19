import { describe, expect, it } from 'vitest';

import { decodeJwt } from './jwt';

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ.signature';

describe('decodeJwt', () => {
  it('decodes JWT header and payload objects', () => {
    expect(decodeJwt(validToken)).toEqual({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: { sub: '123' },
    });
  });

  it('rejects tokens without three populated segments', () => {
    expect(() => decodeJwt('header.payload')).toThrow('Expected three dot-separated segments');
    expect(() => decodeJwt('header..signature')).toThrow('Expected three dot-separated segments');
  });

  it('rejects a payload that is not an object', () => {
    expect(() => decodeJwt('eyJhbGciOiJIUzI1NiJ9.W10.signature')).toThrow(
      'JWT payload must be a JSON object',
    );
  });
});
