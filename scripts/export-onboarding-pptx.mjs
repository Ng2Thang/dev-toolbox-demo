import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { chromium } from '@playwright/test';
import PptxGenJS from 'pptxgenjs';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = dirname(scriptDirectory);
const sourcePath = join(repositoryRoot, 'docs', 'onboarding', 'dev-toolbox-team-introduction.html');
const exportDirectory = join(repositoryRoot, 'docs', 'onboarding', 'exports');
const slideImageDirectory = join(exportDirectory, 'slides');
const presentationPath = join(exportDirectory, 'dev-toolbox-team-introduction.pptx');

await mkdir(slideImageDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
  });

  await page.goto(pathToFileURL(sourcePath).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const slideCount = await page.locator('.slide').count();
  const slideImagePaths = [];

  for (let slideIndex = 0; slideIndex < slideCount; slideIndex += 1) {
    await page.evaluate((activeIndex) => {
      const slides = [...document.querySelectorAll('.slide')];
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === activeIndex);
      });

      const progress = document.querySelector('.progress span');
      if (progress) {
        progress.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
      }
    }, slideIndex);

    await page.waitForTimeout(800);

    const imagePath = join(
      slideImageDirectory,
      `slide-${String(slideIndex + 1).padStart(2, '0')}.png`,
    );
    await page.locator('.deck').screenshot({ path: imagePath });
    slideImagePaths.push(imagePath);
  }

  const presentation = new PptxGenJS();
  presentation.layout = 'LAYOUT_WIDE';
  presentation.author = 'Dev Toolbox team';
  presentation.company = 'Dev Toolbox';
  presentation.subject = 'Repository and Codex team onboarding';
  presentation.title = 'Dev Toolbox — Team Introduction';
  presentation.lang = 'en-US';
  presentation.theme = {
    headFontFace: 'Aptos Display',
    bodyFontFace: 'Aptos',
    lang: 'en-US',
  };

  for (const imagePath of slideImagePaths) {
    const slide = presentation.addSlide();
    slide.background = { color: 'F8FAFC' };
    slide.addImage({ path: imagePath, x: 0, y: 0, w: 13.333, h: 7.5 });
  }

  await presentation.writeFile({ fileName: presentationPath });
  console.log(`Exported ${slideCount} slides to ${presentationPath}`);
} finally {
  await browser.close();
}
