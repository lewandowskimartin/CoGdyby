/* Renders an OG card to a PNG buffer: satori lays out the VDOM into SVG,
   resvg rasterises it. Runs at build time only — the output is static files
   under dist/og/, so nothing here ships to the browser. */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { card, W, H } from './card.js';

/* This module is bundled into dist/ before it runs, so import.meta.url points at the
   build output rather than at src/. Walk up from the working directory to the project
   root (the folder holding package.json) and read the fonts from there instead. */
function projectRoot() {
  let dir = resolve(process.cwd());
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, 'package.json'))) return dir;
    const up = dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return resolve(process.cwd());
}

const FONT_DIR = join(projectRoot(), 'src', 'assets', 'fonts');

function font(file) {
  const path = join(FONT_DIR, file);
  if (!existsSync(path)) {
    throw new Error(
      `OG image font missing: ${path}. Fonts live in src/assets/fonts/ and are read at build time.`
    );
  }
  return readFileSync(path);
}

/* Static instances of the site's three families, subsetted to Latin.
   Satori can't interpolate variable axes, hence baked weights. */
let FONTS;
function fonts() {
  if (!FONTS) {
    FONTS = [
      { name: 'Fraunces', data: font('Fraunces-500.ttf'), weight: 500, style: 'normal' },
      { name: 'Fraunces', data: font('Fraunces-600.ttf'), weight: 600, style: 'normal' },
      { name: 'DM Sans', data: font('DMSans-400.ttf'), weight: 400, style: 'normal' },
      { name: 'DM Sans', data: font('DMSans-500.ttf'), weight: 500, style: 'normal' },
      { name: 'DM Sans', data: font('DMSans-700.ttf'), weight: 700, style: 'normal' },
      { name: 'IBM Plex Mono', data: font('IBMPlexMono-Regular.ttf'), weight: 400, style: 'normal' },
      { name: 'IBM Plex Mono', data: font('IBMPlexMono-Medium.ttf'), weight: 500, style: 'normal' },
    ];
  }
  return FONTS;
}

/** @returns {Promise<Buffer>} a 1200x630 PNG */
export async function renderOg(page) {
  const svg = await satori(card(page), { width: W, height: H, fonts: fonts() });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
  return Buffer.from(png);
}
