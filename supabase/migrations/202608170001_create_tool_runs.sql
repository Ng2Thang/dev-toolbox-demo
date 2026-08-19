create extension if not exists pgcrypto;
create table if not exists public.tool_runs (
  id uuid primary key default gen_random_uuid(),
  tool text not null,
  input text not null,
  output jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists tool_runs_created_at_idx on public.tool_runs(created_at desc);
