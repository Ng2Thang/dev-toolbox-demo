import { NextResponse } from 'next/server';

import { createToolRun, listRecentToolRuns } from '@/features/runs/run.repository';
import { createToolRunSchema } from '@/features/runs/run.schema';

function internalServerError(error: unknown) {
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Unable to process saved runs.' },
    { status: 500 },
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  const parsed = createToolRunSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid run payload', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await createToolRun(parsed.data), { status: 201 });
  } catch (error) {
    return internalServerError(error);
  }
}

export async function GET() {
  try {
    return NextResponse.json(await listRecentToolRuns());
  } catch (error) {
    return internalServerError(error);
  }
}
