#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = process.cwd();
const json = process.argv.includes('--json');
const offline = process.argv.includes('--offline');
const results = [];

function commandFor(name) {
  return process.platform === 'win32' ? `${name}.cmd` : name;
}

function run(command, args) {
  const isWindowsCommandShim = process.platform === 'win32' && command.endsWith('.cmd');
  const executable = isWindowsCommandShim ? process.env.ComSpec ?? 'cmd.exe' : command;
  const executableArgs = isWindowsCommandShim
    ? ['/d', '/s', '/c', `"${[command, ...args].join(' ')}"`]
    : args;

  try {
    return {
      ok: true,
      output: execFileSync(executable, executableArgs, {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }).trim(),
    };
  } catch (error) {
    return {
      ok: false,
      output: `${error.stdout ?? ''}${error.stderr ?? ''}`.trim(),
      missing: error.code === 'ENOENT',
    };
  }
}

function add(name, status, detail) {
  results.push({ name, status, detail });
}

function localEnv() {
  const localPath = join(root, '.env.local');
  if (!existsSync(localPath)) return {};

  return Object.fromEntries(
    readFileSync(localPath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        return index === -1 ? [line, ''] : [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

function checkStitch() {
  const codex = run(commandFor('codex'), ['mcp', 'list']);
  if (codex.missing) {
    add('Google Stitch MCP', 'fail', 'Codex CLI is not installed or not on PATH.');
  } else if (/^stitch\s+/m.test(codex.output) && /\benabled\b/i.test(codex.output)) {
    add('Google Stitch MCP', 'pass', 'The Stitch MCP server is enabled in Codex.');
  } else if (!codex.ok) {
    add('Google Stitch MCP', 'unknown', 'Could not read the Codex MCP registry in this shell. Run codex mcp list to verify it.');
  } else {
    add('Google Stitch MCP', 'fail', 'No enabled Stitch MCP server was found in Codex.');
  }
}

async function checkSupabase() {
  const env = { ...localEnv(), ...process.env };
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    add('Supabase', 'fail', 'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.');
    return;
  }

  try {
    new URL(url);
  } catch {
    add('Supabase', 'fail', 'NEXT_PUBLIC_SUPABASE_URL is not a valid URL.');
    return;
  }

  if (offline) {
    add('Supabase', 'pass', 'Required local configuration is present (network probe skipped).');
    return;
  }

  try {
    const response = await fetch(new URL('/rest/v1/', url), {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    add(
      'Supabase',
      response.ok ? 'pass' : 'fail',
      response.ok
        ? 'Supabase REST API accepted the configured credentials.'
        : 'Could not authenticate with the Supabase REST API.',
    );
  } catch {
    add('Supabase', 'fail', 'Could not reach the Supabase REST API.');
  }
}

function checkGitHub() {
  const remote = run(commandFor('git'), ['remote', 'get-url', 'origin']);
  const github = run(commandFor('gh'), ['auth', 'status']);
  if (remote.ok && !/github\.com[:/]/i.test(remote.output)) {
    add('GitHub', 'fail', `Origin is not a GitHub remote (${remote.output}).`);
  } else if (remote.missing || !remote.ok) {
    add('GitHub', 'fail', 'No GitHub origin remote is configured.');
  } else if (github.missing) {
    add('GitHub', 'fail', 'GitHub CLI is not installed or not on PATH.');
  } else if (!github.ok) {
    add('GitHub', 'fail', 'GitHub CLI is not authenticated. Run gh auth login.');
  } else {
    add('GitHub', 'pass', `GitHub remote and CLI authentication are available for ${basename(remote.output)}.`);
  }
}

function checkVercel() {
  if (!existsSync(join(root, '.vercel', 'project.json'))) {
    add('Vercel', 'fail', 'This project is not linked to Vercel (.vercel/project.json is missing).');
    return;
  }

  const vercel = run(commandFor('vercel'), ['whoami']);
  if (vercel.missing) {
    add('Vercel', 'fail', 'Vercel CLI is not installed or not on PATH.');
  } else if (!vercel.ok) {
    add('Vercel', 'fail', 'Vercel CLI is not authenticated. Run vercel login.');
  } else {
    add('Vercel', 'pass', 'Project link and Vercel CLI authentication are available.');
  }
}

checkStitch();
await checkSupabase();
checkGitHub();
checkVercel();

if (json) {
  console.log(JSON.stringify({ ok: results.every((result) => result.status === 'pass'), results }, null, 2));
} else {
  console.log('Dev Toolbox connection doctor\n');
  for (const result of results) {
    const label = result.status === 'pass' ? 'PASS' : result.status === 'fail' ? 'FAIL' : 'CHECK';
    console.log(`${label}  ${result.name}: ${result.detail}`);
  }
}

process.exitCode = results.every((result) => result.status === 'pass') ? 0 : 1;
