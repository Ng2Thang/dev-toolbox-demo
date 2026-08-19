import { describe, expect, it } from 'vitest';

import { createToolRunSchema } from './run.schema';

describe('createToolRunSchema', () => {
  it('accepts a JSON-compatible saved run', () => {
    expect(
      createToolRunSchema.safeParse({ tool: 'jwt-decoder', input: 'token', output: { sub: '123' } })
        .success,
    ).toBe(true);
  });

  it('rejects unexpected fields and non-JSON output values', () => {
    expect(
      createToolRunSchema.safeParse({
        tool: 'jwt-decoder',
        input: 'token',
        output: { value: undefined },
      }).success,
    ).toBe(false);
    expect(
      createToolRunSchema.safeParse({
        tool: 'jwt-decoder',
        input: 'token',
        output: {},
        extra: true,
      }).success,
    ).toBe(false);
  });
});
