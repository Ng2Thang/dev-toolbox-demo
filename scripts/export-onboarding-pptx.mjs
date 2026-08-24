import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { chromium } from '@playwright/test';
import PptxGenJS from 'pptxgenjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const onboarding = join(root, 'docs', 'onboarding');
const exportDirectory = join(onboarding, 'exports');
const previewDirectory = join(exportDirectory, 'slides');
const presentationPath = join(exportDirectory, 'dev-toolbox-team-introduction-editable.pptx');
const heroImage = join(onboarding, 'assets', 'codex-toolbox-hero.png');
const collaborationImage = join(onboarding, 'assets', 'human-codex-collaboration.png');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Dev Toolbox team';
pptx.company = 'Dev Toolbox';
pptx.subject = 'Repository and Codex team onboarding';
pptx.title = 'Dev Toolbox — Team Introduction';
pptx.lang = 'en-US';
pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'en-US' };
pptx.defineSlideMaster({
  title: 'DEV_TOOLBOX',
  background: { color: 'F8FAFC' },
  objects: [
    {
      rect: {
        x: 0,
        y: 7.44,
        w: 13.333,
        h: 0.06,
        fill: { color: '155EEF' },
        line: { color: '155EEF' },
      },
    },
  ],
  slideNumber: { x: 12.2, y: 7.03, w: 0.6, h: 0.2, color: '667085', fontSize: 9, align: 'right' },
});

const C = {
  ink: '14213A',
  muted: '667085',
  line: 'D8E1ED',
  navy: '101828',
  blue: '155EEF',
  cyan: '0891B2',
  teal: '0F766E',
  indigo: '5B5BD6',
  amber: 'FFF0C2',
  amberInk: '9A6500',
  mint: 'D9F8EC',
  red: 'FEE4E2',
  white: 'FFFFFF',
};

function addText(slide, value, x, y, w, h, options = {}) {
  slide.addText(value, {
    x,
    y,
    w,
    h,
    fontFace: options.fontFace ?? 'Aptos',
    fontSize: options.size ?? 15,
    color: options.color ?? C.ink,
    bold: options.bold ?? false,
    margin: options.margin ?? 0.06,
    valign: options.valign ?? 'mid',
    align: options.align ?? 'left',
    fit: 'shrink',
    charSpacing: options.spacing,
  });
}

function addBox(slide, x, y, w, h, options = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    fill: { color: options.fill ?? C.white, transparency: options.transparency ?? 0 },
    line: { color: options.line ?? C.line, width: 1 },
    shadow:
      options.shadow === false
        ? undefined
        : { type: 'outer', color: 'AAB5C4', opacity: 0.12, blur: 1, angle: 45, distance: 1 },
  });
}

function base(eyebrow, title, footer) {
  const slide = pptx.addSlide('DEV_TOOLBOX');
  addText(slide, eyebrow.toUpperCase(), 0.72, 0.46, 11.8, 0.25, {
    size: 10,
    color: C.blue,
    bold: true,
    spacing: 2,
  });
  if (title) addText(slide, title, 0.72, 0.82, 11.9, 0.72, { size: 31, bold: true, margin: 0 });
  addText(slide, footer, 0.72, 7.03, 7, 0.2, { size: 9, color: C.muted, margin: 0 });
  return slide;
}

function card(slide, x, y, w, h, title, body, options = {}) {
  addBox(slide, x, y, w, h, options);
  addText(slide, title, x + 0.22, y + 0.22, w - 0.44, 0.48, {
    size: options.titleSize ?? 16,
    bold: true,
    color: options.titleColor ?? C.ink,
  });
  addText(slide, body, x + 0.22, y + 0.85, w - 0.44, h - 1.05, {
    size: options.bodySize ?? 12,
    color: options.bodyColor ?? C.muted,
    valign: 'top',
  });
}

function cardsSlide(eyebrow, title, footer, items, columns = items.length) {
  const slide = base(eyebrow, title, footer);
  const rows = Math.ceil(items.length / columns);
  const gap = 0.25;
  const width = (11.9 - gap * (columns - 1)) / columns;
  const height = rows === 1 ? 3.5 : 1.75;
  items.forEach((item, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    card(
      slide,
      0.72 + column * (width + gap),
      1.82 + row * (height + gap),
      width,
      height,
      item[0],
      item[1],
      item[2] ?? {},
    );
  });
  return slide;
}

function addNode(slide, label, x, y, w, primary = false) {
  addBox(slide, x, y, w, 0.55, {
    fill: primary ? C.navy : C.white,
    line: primary ? C.navy : C.line,
    shadow: false,
  });
  addText(slide, label, x + 0.05, y + 0.08, w - 0.1, 0.36, {
    size: 10,
    bold: true,
    color: primary ? C.white : C.ink,
    align: 'center',
  });
}

function addArrow(slide, x, y) {
  slide.addShape(pptx.ShapeType.chevron, {
    x,
    y,
    w: 0.28,
    h: 0.25,
    fill: { color: C.blue },
    line: { color: C.blue },
  });
}

// Cover
{
  const slide = base('Team onboarding', '', 'Repository introduction');
  addText(slide, 'Dev', 0.72, 1.2, 4.5, 0.9, { size: 58, bold: true, margin: 0 });
  addText(slide, 'Toolbox', 0.72, 2.0, 4.8, 0.95, {
    size: 58,
    bold: true,
    color: C.blue,
    margin: 0,
  });
  addText(
    slide,
    'Useful browser tools. A visible delivery system. A repository designed for people and Codex to work together.',
    0.72,
    3.18,
    4.65,
    1.25,
    { size: 19, color: '475467', valign: 'top' },
  );
  slide.addImage({ path: heroImage, x: 5.65, y: 0.72, w: 6.85, h: 5.55 });
}

cardsSlide('01 / Why', 'Developer chores should feel instant.', 'Product motivation', [
  [
    '01  Too much context switching',
    'Small conversions often send developers through tabs, snippets, and untrusted sites.',
  ],
  [
    '02  Sensitive input',
    'Tokens and payloads should remain in the browser whenever persistence is unnecessary.',
  ],
  ['03  Repeated team work', 'A shared toolbox gives common tasks one predictable, testable home.'],
]);

cardsSlide('02 / Product', 'Meet the toolbox through examples.', 'Browser-first utilities', [
  [
    '</>  JWT Decoder',
    'Inspect header and payload.\n\neyJhbGciOi... → { sub, exp }',
    { fill: C.blue, line: C.blue, titleColor: C.white, bodyColor: 'EAF2FF' },
  ],
  [
    '{ }  JSON Formatter',
    'Validate and pretty-print.\n\n{"ok":true} → indented JSON',
    { fill: C.cyan, line: C.cyan, titleColor: C.white, bodyColor: 'EAF2FF' },
  ],
  [
    '◷  Timestamp',
    'Convert in both directions.\n\n0 → 1970-01-01T00:00:00Z',
    { fill: C.teal, line: C.teal, titleColor: C.white, bodyColor: 'EAF2FF' },
  ],
  [
    '⌘  UUID Generator',
    'Create v1, v4, or v7 values.\n\n019... → copy or regenerate',
    { fill: C.indigo, line: C.indigo, titleColor: C.white, bodyColor: 'EAF2FF' },
  ],
]);

const difference = cardsSlide(
  '03 / Difference',
  'The repository stores more than code.',
  'Requirement → evidence',
  [
    ['Requirement', 'Versioned scope and acceptance criteria.'],
    ['Visual contract', 'Stitch evidence and explicit UI approval.'],
    ['Implementation', 'Feature-owned behavior with clear boundaries.'],
    ['Delivery evidence', 'Tests, pull request, and preview status.'],
  ],
);
addText(
  difference,
  'Traceability shows what was requested, approved, changed, and verified.',
  0.9,
  5.65,
  11.5,
  0.5,
  { size: 19, color: '475467', align: 'center' },
);

{
  const slide = base(
    '04 / Collaboration',
    'Codex is a teammate, not autopilot.',
    'People approve; Codex delivers evidence',
  );
  slide.addImage({ path: collaborationImage, x: 0.65, y: 1.65, w: 5.55, h: 4.75 });
  card(
    slide,
    6.45,
    1.82,
    2.85,
    3.85,
    'People own',
    '• Scope and priority\n\n• UI approval\n\n• Risk decisions\n\n• Final review',
    { fill: C.amber, line: C.amber, bodyColor: C.ink },
  );
  card(
    slide,
    9.55,
    1.82,
    2.85,
    3.85,
    'Codex can',
    '• Inspect context\n\n• Implement changes\n\n• Run checks\n\n• Prepare evidence',
    { fill: 'EDF4FF', line: 'C9D8F5', bodyColor: C.ink },
  );
}

{
  const slide = base(
    '05 / Instructions',
    'Five layers answer five different questions.',
    'Explicit, reviewable context',
  );
  const layers = [
    ['Requirement', 'What did we agree to build?', C.blue],
    ['Skill', 'How should Codex perform this kind of work?', C.cyan],
    ['Rule', 'What must always be allowed, required, or prevented?', C.teal],
    ['Architecture', 'Where does the implementation belong?', C.indigo],
    ['Test evidence', 'How do we know the result works?', C.amberInk],
  ];
  layers.forEach(([label, question, color], index) => {
    const y = 1.68 + index * 0.92;
    addBox(slide, 1.15, y, 11, 0.68, { shadow: false });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.15,
      y,
      w: 2.2,
      h: 0.68,
      fill: { color },
      line: { color },
    });
    addText(slide, label, 1.3, y + 0.08, 1.9, 0.5, {
      size: 12,
      bold: true,
      color: C.white,
      align: 'center',
    });
    addText(slide, question, 3.65, y + 0.08, 8.1, 0.5, { size: 13, color: '475467' });
  });
}

{
  const slide = base(
    '06 / Real feature',
    'One request becomes a delivery.',
    'UUID Generator case study',
  );
  const labels = [
    ['REQ-005', 1.05],
    ['Stitch UUID screen', 1.75],
    ['UI approved', 1.25],
    ['features/uuid/', 1.55],
    ['3 test levels', 1.35],
    ['PR #9', 0.9],
  ];
  let x = 0.65;
  labels.forEach(([label, width], index) => {
    addNode(slide, label, x, 1.82, width, index === 0);
    x += width;
    if (index < labels.length - 1) {
      addArrow(slide, x + 0.12, 1.97);
      x += 0.58;
    }
  });
  [
    ['Domain', 'UUID v1, v4, and v7 generation logic.'],
    ['Interaction', 'Generate, select version, copy, clear, and save.'],
    ['Evidence', 'Requirement, Stitch HTML/PNG, tests, commit, PR, preview.'],
  ].forEach(([title, body], index) =>
    card(slide, 0.72 + index * 4.15, 3.05, 3.8, 2.25, title, body),
  );
}

{
  const slide = base(
    '07 / Data flow',
    'Most work stays local. Saving is explicit.',
    'ARCHITECTURE.md',
  );
  card(
    slide,
    0.75,
    1.8,
    5.75,
    3.9,
    'DEFAULT PATH  ·  Browser-local tool',
    'Input → feature logic → result. No server request is needed for decoding, formatting, conversion, or generation.',
  );
  card(
    slide,
    6.82,
    1.8,
    5.75,
    3.9,
    'OPTIONAL PATH  ·  Saved run',
    'A successful result can be validated by the API and persisted through a server-only repository.',
  );
  ['Input', 'Browser logic', 'Result'].forEach((label, index) =>
    addNode(slide, label, 1.15 + index * 1.65, 4.65, 1.25),
  );
  ['POST /api/runs', 'Zod', 'Supabase'].forEach((label, index) =>
    addNode(slide, label, 7.18 + index * 1.72, 4.65, 1.35),
  );
}

{
  const slide = base('08 / Ownership', 'Where should I change code?', 'Feature-first ownership');
  slide.addTable(
    [
      ['Task', 'Primary location', 'Remember'],
      [
        'Add a developer tool',
        'features/, thin route, lib/tools.ts',
        'Add focused tests and Stitch evidence.',
      ],
      [
        'Change shared navigation',
        'components/layout/',
        'The registry remains the source of truth.',
      ],
      [
        'Change saved runs',
        'features/runs/, API, migration',
        'Keep service-role access server-only.',
      ],
      [
        'Change visual language',
        'DESIGN.md and Stitch artifacts',
        'Obtain explicit UI approval first.',
      ],
    ],
    {
      x: 0.72,
      y: 1.72,
      w: 11.9,
      h: 4.5,
      border: { type: 'solid', color: C.line, pt: 1 },
      fill: C.white,
      color: C.ink,
      fontFace: 'Aptos',
      fontSize: 12,
      margin: 0.12,
      rowH: 0.82,
      colW: [3, 4, 4.9],
      valign: 'mid',
      bold: false,
      fillHeader: 'EDF4FF',
      boldHeader: true,
    },
  );
}

cardsSlide('09 / Quality', 'Confidence is layered.', 'Vitest + Playwright + npm run check', [
  [
    '1  Core behavior',
    'Does the tool produce the right result for normal input?\n\nUUID version + format',
  ],
  [
    '2  Interaction',
    'Do validation, controls, copy, clear, and save behave correctly?\n\nVisible user states',
  ],
  [
    '3  Resilience',
    'Can the user recover from malformed input, API failure, or repeated actions?\n\nError recovery',
  ],
]);

{
  const slide = base('10 / Security', 'The server boundary is deliberate.', 'Security boundary');
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.72,
    y: 1.72,
    w: 7.15,
    h: 4.4,
    fill: { color: C.white },
    line: { color: '98A2B3', width: 1.5, dash: 'dash' },
  });
  addText(slide, 'Inside the trusted server boundary', 1.02, 1.98, 6.5, 0.45, {
    size: 17,
    bold: true,
  });
  [
    'Zod validates external requests',
    'Repository owns Supabase access',
    'Migrations are immutable and ordered',
  ].forEach((label, index) =>
    card(slide, 1.05, 2.72 + index * 0.92, 6.45, 0.67, label, '', { shadow: false, titleSize: 12 }),
  );
  card(
    slide,
    8.2,
    1.72,
    4.4,
    2.65,
    'Never cross this line',
    'SUPABASE_SERVICE_ROLE_KEY must not enter client components, public variables, commits, screenshots, or generated design evidence.',
    { fill: C.red, line: C.red, titleColor: '912018', bodyColor: '912018', bodySize: 10.5 },
  );
  addText(
    slide,
    'Review every diff and artifact for secrets before delivery.',
    8.3,
    4.7,
    4.2,
    0.8,
    { size: 17, color: '475467' },
  );
}

const state = cardsSlide(
  '11 / Current state',
  'Use the live status index.',
  'Current state, not permanent history',
  [
    ['DELIVERED  ·  Timestamp + UUID', 'Delivery evidence is recorded.'],
    ['IN PROGRESS  ·  JWT + JSON', 'Check each requirement for its exact next action.'],
    [
      'Source of truth',
      'docs/FEATURE_STATUS.md contains owners, blockers, approval state, and evidence.',
      { fill: C.navy, line: C.navy, titleColor: C.white, bodyColor: 'D0D5DD' },
    ],
  ],
);
addText(
  state,
  'Avoid memorizing this slide—the checked-in status file is designed to change.',
  0.9,
  5.7,
  11.5,
  0.5,
  { size: 18, color: '475467', align: 'center' },
);

cardsSlide('12 / First 30 minutes', 'Follow one feature end to end.', 'A guided repository walk', [
  ['0–5 min  ·  Orient', 'Read README, AGENTS, and architecture.'],
  ['5–10 min  ·  Run', 'Start the app and open the UUID tool.'],
  ['10–20 min  ·  Trace', 'Find its route, feature logic, registry entry, and tests.'],
  ['20–30 min  ·  Prove', 'Run a focused test and inspect requirement evidence.'],
]);

cardsSlide(
  '13 / Before you start',
  'Ask four useful questions.',
  'Good questions prevent rework',
  [
    ['Is the requirement ready?', 'Check its status, acceptance criteria, and blockers.'],
    ['Is the UI approved?', 'Application implementation waits for explicit approval.'],
    ['Does data stay local?', 'Add persistence only when the requirement needs it.'],
    ['What is the smallest change?', 'Keep scope and review cost easy to understand.'],
  ],
  2,
);

{
  const slide = base('Takeaway', '', 'Questions and discussion');
  addText(slide, 'Start with the requirement.', 0.72, 1.45, 5.5, 0.8, {
    size: 36,
    bold: true,
    margin: 0,
  });
  addText(slide, 'Finish with evidence.', 0.72, 2.25, 5.5, 0.8, {
    size: 36,
    bold: true,
    color: C.blue,
    margin: 0,
  });
  addText(
    slide,
    'Everything between those points should be understandable to the next teammate.',
    0.72,
    3.38,
    4.8,
    1.1,
    { size: 19, color: '475467', valign: 'top' },
  );
  slide.addImage({ path: heroImage, x: 6, y: 0.85, w: 6.25, h: 5.45 });
}

await mkdir(previewDirectory, { recursive: true });
await pptx.writeFile({ fileName: presentationPath });

// These PNGs preview the animated HTML deck; the editable PPTX does not use them.
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(pathToFileURL(join(onboarding, 'dev-toolbox-team-introduction.html')).href, {
    waitUntil: 'load',
  });
  await page.evaluate(() => document.fonts.ready);
  const count = await page.locator('.slide').count();
  for (let index = 0; index < count; index += 1) {
    await page.evaluate(
      (activeIndex) =>
        document
          .querySelectorAll('.slide')
          .forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === activeIndex)),
      index,
    );
    await page.waitForTimeout(800);
    await page.locator('.deck').screenshot({
      path: join(previewDirectory, `slide-${String(index + 1).padStart(2, '0')}.png`),
    });
  }
} finally {
  await browser.close();
}

console.log(`Exported 15 editable slides to ${presentationPath}`);
