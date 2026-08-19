import { describe, expect, it, vi } from 'vitest';

const repository = vi.hoisted(() => ({
  createToolRun: vi.fn(),
  listRecentToolRuns: vi.fn(),
}));

vi.mock('@/features/runs/run.repository', () => repository);

import { GET, POST } from './route';

describe('/api/runs', () => {
  it('returns 400 for malformed JSON without writing to Supabase', async () => {
    const response = await POST(
      new Request('http://localhost/api/runs', {
        method: 'POST',
        body: '{',
      }),
    );

    expect(response.status).toBe(400);
    expect(repository.createToolRun).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid payload without writing to Supabase', async () => {
    const response = await POST(
      new Request('http://localhost/api/runs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tool: '', input: 'token', output: {} }),
      }),
    );

    expect(response.status).toBe(400);
    expect(repository.createToolRun).not.toHaveBeenCalled();
  });

  it('creates a valid saved run', async () => {
    repository.createToolRun.mockResolvedValue({
      id: 'run-1',
      tool: 'jwt-decoder',
      input: 'token',
      output: { sub: '123' },
      created_at: '2026-08-18T00:00:00.000Z',
    });

    const response = await POST(
      new Request('http://localhost/api/runs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tool: 'jwt-decoder', input: 'token', output: { sub: '123' } }),
      }),
    );

    expect(response.status).toBe(201);
    expect(repository.createToolRun).toHaveBeenCalledOnce();
    expect(await response.json()).toMatchObject({ id: 'run-1' });
  });

  it('returns the repository result for recent runs', async () => {
    repository.listRecentToolRuns.mockResolvedValue([]);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });
});
