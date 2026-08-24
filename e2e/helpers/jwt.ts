export const validJwt =
  'eyJhbGciOiJub25lIn0.eyJzdWIiOiJlMmUtdGVzdCIsInJvbGUiOiJkZXZlbG9wZXIifQ.signature';

export function createJwt(payload: Record<string, unknown>) {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');

  return `${encode({ alg: 'none' })}.${encode(payload)}.signature`;
}
