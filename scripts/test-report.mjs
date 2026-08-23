import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const reportsDirectory = join(root, 'docs', 'test-reports');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const stem = `${timestamp}-test-report`;
const rawResultPath = join(reportsDirectory, `${stem}.vitest.json`);
const jsonReportPath = join(reportsDirectory, `${stem}.json`);
const markdownReportPath = join(reportsDirectory, `${stem}.md`);

function git(...args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function categoryFor(fileName) {
  const file = fileName.replaceAll('\\', '/');

  if (file.startsWith('app/api/')) return 'API/routes';
  if (file.startsWith('features/')) {
    const feature = file.split('/')[1];
    return `Feature: ${feature.includes('.') ? feature.split('.')[0] : feature}`;
  }
  if (file.startsWith('lib/')) return 'Shared libraries';
  if (file.startsWith('test/')) return 'Test infrastructure';
  return 'Other';
}

function summarize(testResults) {
  const categories = new Map();
  const failedOrSkipped = [];

  for (const result of testResults) {
    const relativeFile = relative(root, result.name).replaceAll('\\', '/');
    const categoryName = categoryFor(relativeFile);
    const category = categories.get(categoryName) ?? {
      category: categoryName,
      passedFiles: 0,
      failedFiles: 0,
      skippedFiles: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
    };
    const assertions = result.assertionResults ?? [];
    const failed = assertions.filter((test) => test.status === 'failed');
    const skipped = assertions.filter(
      (test) => test.status === 'pending' || test.status === 'skipped',
    );
    const passed = assertions.filter((test) => test.status === 'passed');

    category.passedTests += passed.length;
    category.failedTests += failed.length;
    category.skippedTests += skipped.length;

    if (failed.length) category.failedFiles += 1;
    else if (skipped.length === assertions.length && assertions.length) category.skippedFiles += 1;
    else category.passedFiles += 1;

    for (const test of [...failed, ...skipped]) {
      failedOrSkipped.push({
        file: relativeFile,
        name: [...(test.ancestorTitles ?? []), test.title].filter(Boolean).join(' > '),
        status: test.status,
        message: test.failureMessages?.[0]?.split('\n')[0] ?? '',
      });
    }

    categories.set(categoryName, category);
  }

  return { categories: [...categories.values()], failedOrSkipped };
}

function renderMarkdown(report) {
  const status = report.success ? 'Passed' : 'Failed';
  const categoryRows = report.categories
    .map(
      (category) =>
        `| ${category.category} | ${category.passedFiles}/${category.failedFiles}/${category.skippedFiles} | ${category.passedTests}/${category.failedTests}/${category.skippedTests} | ${category.failedTests ? 'Failed' : 'Passed'} |`,
    )
    .join('\n');
  const issues = report.failedOrSkipped.length
    ? report.failedOrSkipped
        .map(
          (test) =>
            `- **${test.status}** ${test.file} - ${test.name}${test.message ? `: ${test.message}` : ''}`,
        )
        .join('\n')
    : 'None.';

  return `# Test Report - ${report.timestamp}\n\n## Scope\n\n- Repository: \`${report.repository}\`\n- Branch/commit: \`${report.branch}\` / \`${report.commit}\`\n- Command: \`${report.command}\`\n\n## Overall result\n\n| Check | Status | Evidence |\n| --- | --- | --- |\n| Complete test suite | ${status} | ${report.files.passed}/${report.files.failed}/${report.files.skipped} files passed/failed/skipped; ${report.tests.passed}/${report.tests.failed}/${report.tests.skipped} tests passed/failed/skipped; ${report.durationMs}ms |\n\n## Results by feature and category\n\n| Category | Test files (pass/fail/skip) | Tests (pass/fail/skip) | Status |\n| --- | --- | --- |\n${categoryRows || '| No test results | 0/0/0 | 0/0/0 | Not run |'}\n\n## Failed and skipped tests\n\n${issues}\n\n## PR evidence\n\n- Report artifact: \`${relative(root, markdownReportPath).replaceAll('\\', '/')}\`\n- JSON data: \`${relative(root, jsonReportPath).replaceAll('\\', '/')}\`\n- Tested commit: \`${report.commit}\`\n`;
}

mkdirSync(reportsDirectory, { recursive: true });

const vitestEntry = join(root, 'node_modules', 'vitest', 'vitest.mjs');
if (!existsSync(vitestEntry)) {
  throw new Error('Vitest is not installed. Run npm ci before generating a test report.');
}

const startedAt = Date.now();
const result = spawnSync(
  process.execPath,
  [vitestEntry, 'run', '--reporter=json', '--outputFile', rawResultPath],
  {
    cwd: root,
    encoding: 'utf8',
  },
);
const durationMs = Date.now() - startedAt;

if (!existsSync(rawResultPath)) {
  throw new Error(result.stderr || result.stdout || 'Vitest did not produce a JSON report.');
}

const vitest = JSON.parse(readFileSync(rawResultPath, 'utf8'));
rmSync(rawResultPath, { force: true });
const testResults = vitest.testResults ?? [];
const { categories, failedOrSkipped } = summarize(testResults);
const files = categories.reduce(
  (totals, category) => ({
    passed: totals.passed + category.passedFiles,
    failed: totals.failed + category.failedFiles,
    skipped: totals.skipped + category.skippedFiles,
  }),
  { passed: 0, failed: 0, skipped: 0 },
);
const tests = {
  passed: vitest.numPassedTests ?? 0,
  failed: vitest.numFailedTests ?? 0,
  skipped: vitest.numPendingTests ?? 0,
  total: vitest.numTotalTests ?? 0,
};
const report = {
  timestamp: new Date().toISOString(),
  repository: basename(root),
  branch: git('branch', '--show-current'),
  commit: git('rev-parse', '--short=12', 'HEAD'),
  command: 'vitest run --reporter=json --outputFile <generated-file>',
  success: result.status === 0,
  durationMs,
  files,
  tests,
  categories,
  failedOrSkipped,
};

writeFileSync(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(markdownReportPath, renderMarkdown(report));
console.log(`Test report: ${relative(root, markdownReportPath).replaceAll('\\', '/')}`);
console.log(`JSON data: ${relative(root, jsonReportPath).replaceAll('\\', '/')}`);
console.log(
  `Result: ${report.success ? 'passed' : 'failed'} (${tests.passed}/${tests.failed}/${tests.skipped} tests)`,
);

process.exitCode = result.status ?? 1;
