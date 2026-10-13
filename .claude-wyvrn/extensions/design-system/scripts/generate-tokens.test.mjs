// Smoke test for generate-tokens.mjs. Zero dependencies, same as the
// generator: run with `node --test` from this folder or the repo root.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const root = dirname(scriptsDir);
const readArtifact = (brand, file) =>
  readFileSync(join(root, 'generated', brand, file), 'utf8');

test('generator regenerates every brand', () => {
  const out = execFileSync(
    process.execPath,
    [join(scriptsDir, 'generate-tokens.mjs')],
    { encoding: 'utf8' },
  );
  assert.match(out, /synapse: \d+ tokens -> 4 artifacts/);
  assert.match(out, /wyvrn: \d+ tokens -> 4 artifacts/);
});

test('synapse theme.css carries the tile-enter animation and its keyframes', () => {
  const css = readArtifact('synapse', 'theme.css');
  assert.match(
    css,
    /--animate-tile-enter: tile-enter 0\.35s cubic-bezier\(0\.2, 0\.8, 0\.2, 1\) both;/,
  );
  assert.match(css, /@keyframes tile-enter \{/);
  assert.match(css, /transform: translateY\(8px\) scale\(0\.98\);/);
});

test('theme.css carries the body baseline for both brands', () => {
  const synapse = readArtifact('synapse', 'theme.css');
  assert.match(synapse, /background-color: var\(--color-canvas\);/);
  assert.match(synapse, /color: #ffffff;/);
  assert.match(synapse, /font-family: var\(--font-display\);/);
  // wyvrn declares a text token, so its baseline references it.
  assert.match(readArtifact('wyvrn', 'theme.css'), /color: var\(--color-text\);/);
});

test('vars.css carries the animation, keyframes and body baseline', () => {
  const css = readArtifact('synapse', 'vars.css');
  assert.match(css, /--wds-animate-tile-enter: tile-enter 0\.35s/);
  assert.match(css, /@keyframes tile-enter \{/);
  assert.match(css, /background-color: var\(--wds-color-canvas\);/);
});

test('wyvrn artifacts carry the curated brand additions', () => {
  const css = readArtifact('wyvrn', 'theme.css');
  assert.match(css, /--color-on-accent: #000000;/);
  assert.match(css, /--opacity-disabled: 0\.5;/);
  assert.match(css, /--animate-float-soft: float-soft 4s ease-in-out infinite;/);
  assert.match(css, /@keyframes float-soft \{/);
  assert.match(css, /transform: translateY\(-8px\);/);
});

test('scss carries the animation variable; rust skips web-only animation', () => {
  assert.match(
    readArtifact('synapse', 'tokens.scss'),
    /\$wds-animate-tile-enter: tile-enter 0\.35s/,
  );
  assert.doesNotMatch(readArtifact('synapse', 'tokens.rs'), /ANIMATE/);
});
