import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, relative, resolve, sep } from 'node:path';

const repositoryRoot = process.cwd();
const reportDirectory = join(repositoryRoot, 'docs', 'test-reports');
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'repo-test-report-'));
const rawResultPath = join(temporaryDirectory, 'vitest-results.json');
const startedAt = Date.now();

function commandOutput(command, args) {
  try {
    if (process.platform === 'win32' && command.endsWith('.cmd')) {
      return execFileSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', command, ...args], {
        cwd: repositoryRoot,
        encoding: 'utf8',
      }).trim();
    }
    return execFileSync(command, args, { cwd: repositoryRoot, encoding: 'utf8' }).trim();
  } catch {
    return 'unavailable';
  }
}

function categoryFor(filePath) {
  const segments = filePath.split('/');

  if (segments[0] === 'features') {
    return `Feature: ${segments[1]?.replace(/\.(test|spec)\.[^.]+$/, '') || 'shared'}`;
  }

  if (segments[0] === 'app' && segments[1] === 'api') return 'API/routes';
  if (segments[0] === 'app') return 'App routes';
  if (segments[0] === 'lib') return 'Shared libraries';
  if (segments[0] === 'test') return 'Test infrastructure';
  return 'Other';
}

function categorySummary(testResults) {
  const categories = new Map();

  for (const suite of testResults) {
    const file = relative(repositoryRoot, suite.name).split(sep).join('/');
    const category = categoryFor(file);
    const current = categories.get(category) ?? {
      category,
      passedFiles: 0,
      failedFiles: 0,
      skippedFiles: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
    };

    if (suite.status === 'passed') current.passedFiles += 1;
    else if (suite.status === 'skipped' || suite.status === 'pending') current.skippedFiles += 1;
    else current.failedFiles += 1;

    for (const test of suite.assertionResults ?? []) {
      if (test.status === 'passed') current.passedTests += 1;
      else if (test.status === 'skipped' || test.status === 'pending' || test.status === 'todo') {
        current.skippedTests += 1;
      } else current.failedTests += 1;
    }

    categories.set(category, current);
  }

  return [...categories.values()].sort((left, right) =>
    left.category.localeCompare(right.category),
  );
}

function testDetails(testResults) {
  return testResults.flatMap((suite) => {
    const file = relative(repositoryRoot, suite.name).split(sep).join('/');
    return (suite.assertionResults ?? [])
      .filter((test) => test.status !== 'passed')
      .map((test) => ({
        category: categoryFor(file),
        file,
        status: test.status,
        name: test.fullName,
        message: (test.failureMessages ?? []).join(' ').replace(/\s+/g, ' ').trim(),
      }));
  });
}

function markdownCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function renderMarkdown(report) {
  const categoryRows = report.categories
    .map(
      (category) =>
        `| ${category.category} | ${category.passedFiles}/${category.failedFiles}` +
        ` | ${category.passedTests}/${category.failedTests}/${category.skippedTests} | ` +
        `${category.failedFiles || category.failedTests ? 'Failed' : 'Passed'} |`,
    )
    .join('\n');
  const failedTests =
    report.failedOrSkipped.length === 0
      ? 'None.'
      : report.failedOrSkipped
          .map(
            (test) =>
              `- **${test.status}** — ${test.category}; \`${test.file}\`; ${test.name}` +
              (test.message ? ` — ${markdownCell(test.message).slice(0, 500)}` : ''),
          )
          .join('\n');

  return (
    `# Test Report — ${report.timestamp}\n\n` +
    `## Scope\n\n` +
    `- Repository: \`${report.repository}\`\n` +
    `- Branch/commit: \`${report.branch}\` / \`${report.commit}\`\n` +
    `- Environment: \`${report.platform}\` · Node \`${report.node}\` · npm \`${report.npm}\`\n\n` +
    `## Overall result\n\n` +
    `| Check | Command | Status | Evidence |\n| --- | --- | --- | --- |\n` +
    `| Complete test suite | \`vitest run --reporter=json\` | ${report.success ? 'Passed' : 'Failed'} | ` +
    `${report.files.passed}/${report.files.failed}/${report.files.skipped} files passed/failed/skipped; ` +
    `${report.tests.passed}/${report.tests.failed}/${report.tests.skipped} tests passed/failed/skipped; ${report.durationMs}ms |\n` +
    `| Quality gate | \`npm run check\` | Not run | Run separately when requested. |\n\n` +
    `## Results by feature and category\n\n` +
    `| Category | Test files (pass/fail) | Tests (pass/fail/skipped) | Status |\n` +
    `| --- | --- | --- | --- |\n${categoryRows}\n\n` +
    `## Failed and skipped tests\n\n${failedTests}\n\n` +
    `## Recommended next action\n\n` +
    (report.success
      ? 'Run `npm run check` before committing or opening a pull request.'
      : 'Fix the listed failed tests, then rerun this report.')
  );
}

const vitest = spawnSync(
  process.execPath,
  [
    resolve(repositoryRoot, 'node_modules', 'vitest', 'vitest.mjs'),
    'run',
    '--reporter=json',
    '--outputFile',
    rawResultPath,
  ],
  { cwd: repositoryRoot, stdio: 'inherit' },
);

if (vitest.error || !existsSync(rawResultPath)) {
  rmSync(temporaryDirectory, { force: true, recursive: true });
  throw vitest.error ?? new Error('Vitest did not produce a structured results file.');
}

const raw = JSON.parse(readFileSync(rawResultPath, 'utf8'));
const testResults = raw.testResults ?? [];
const categories = categorySummary(testResults);
const failedOrSkipped = testDetails(testResults);
const timestamp = new Date().toISOString();
const filenameTimestamp = timestamp.replace(/[:.]/g, '-');
const files = {
  passed: testResults.filter((suite) => suite.status === 'passed').length,
  failed: testResults.filter((suite) => !['passed', 'skipped', 'pending'].includes(suite.status))
    .length,
  skipped: testResults.filter((suite) => ['skipped', 'pending'].includes(suite.status)).length,
};
const report = {
  timestamp,
  repository: basename(repositoryRoot),
  branch: commandOutput('git', ['rev-parse', '--abbrev-ref', 'HEAD']),
  commit: commandOutput('git', ['rev-parse', '--short', 'HEAD']),
  platform: process.platform,
  node: process.version,
  npm: commandOutput(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['--version']),
  success: raw.success === true && vitest.status === 0,
  durationMs: Date.now() - startedAt,
  files,
  tests: {
    passed: raw.numPassedTests ?? 0,
    failed: raw.numFailedTests ?? 0,
    skipped: (raw.numPendingTests ?? 0) + (raw.numTodoTests ?? 0),
    total: raw.numTotalTests ?? 0,
  },
  categories,
  failedOrSkipped,
};

mkdirSync(reportDirectory, { recursive: true });
const markdownPath = join(reportDirectory, `${filenameTimestamp}-test-report.md`);
const jsonPath = join(reportDirectory, `${filenameTimestamp}-test-report.json`);
writeFileSync(markdownPath, `${renderMarkdown(report)}\n`);
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
rmSync(temporaryDirectory, { force: true, recursive: true });

console.log(`Markdown report: ${relative(repositoryRoot, markdownPath)}`);
console.log(`JSON report: ${relative(repositoryRoot, jsonPath)}`);
process.exitCode = vitest.status ?? 1;
