import 'server-only';

import { supabaseAdmin } from '@/lib/supabase-server';

import type { CreateToolRun } from './run.schema';
import type { ToolRun } from './run.types';

const runColumns = 'id,tool,input,output,created_at';

export async function createToolRun(input: CreateToolRun): Promise<ToolRun> {
  const { data, error } = await supabaseAdmin()
    .from('tool_runs')
    .insert(input)
    .select(runColumns)
    .single();

  if (error) {
    throw error;
  }

  return data as ToolRun;
}

export async function listRecentToolRuns(): Promise<ToolRun[]> {
  const { data, error } = await supabaseAdmin()
    .from('tool_runs')
    .select(runColumns)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  return (data ?? []) as ToolRun[];
}
