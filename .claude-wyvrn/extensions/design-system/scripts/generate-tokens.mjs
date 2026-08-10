#!/usr/bin/env node
// Generates per-stack token artifacts from the DTCG token sources in ../tokens/.
// Zero dependencies. Run from anywhere:
//   node generate-tokens.mjs            -> regenerates every brand
//   node generate-tokens.mjs razer      -> regenerates one brand
// Outputs land in ../generated/<brand>/: theme.css (Tailwind 4 @theme),
// vars.css (plain custom properties), tokens.scss, tokens.rs.
// Adding a stack = adding one emitter function below and wiring it in FORMATS.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const tokensDir = join(root, 'tokens');
const requested = process.argv.slice(2);
const brands = requested.length
  ? requested
  : readdirSync(tokensDir)
      .filter((f) => f.endsWith('.tokens.json'))
      .map((f) => basename(f, '.tokens.json'));

function flatten(node, path = []) {
  const out = [];
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object' && '$value' in value) {
      out.push({ path: [...path, key], type: value.$type ?? 'unknown', value: value.$value });
    } else if (value && typeof value === 'object') {
      out.push(...flatten(value, [...path, key]));
    }
  }
  return out;
}

const GENERIC_FAMILIES = new Set(['system-ui', 'sans-serif', 'serif', 'monospace', 'ui-monospace']);
const cssFamily = (families) =>
  families.map((f) => (GENERIC_FAMILIES.has(f) ? f : `'${f}'`)).join(', ');

function parseHex(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const n = (i) => parseInt(full.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: full.length === 8 ? n(6) : 255 };
}

const parseDim = (v) => {
  const m = /^(-?[\d.]+)(px|rem|em)$/.exec(v);
  return m ? { num: parseFloat(m[1]), unit: m[2] } : null;
};

function emitThemeCss(brand, tokens) {
  const lines = [
    `/* Generated from ${brand}.tokens.json -- do not edit by hand. */`,
    `/* Tailwind 4 theme. Import after 'tailwindcss'. Fonts must be @font-face'd by the project. */`,
    '@theme {',
  ];
  for (const t of tokens) {
    const [group, ...rest] = t.path;
    const name = rest.join('-');
    if (group === 'color') lines.push(`  --color-${name}: ${t.value};`);
    else if (group === 'font') lines.push(`  --font-${name}: ${cssFamily(t.value)};`);
    else if (group === 'radius') lines.push(`  --radius-${name}: ${t.value};`);
    else if (group === 'tracking') lines.push(`  --tracking-${name}: ${t.value};`);
    else if (group === 'spacing' && name === 'unit') lines.push(`  --spacing: ${t.value};`);
    else if (group === 'text' && t.type === 'typography') {
      lines.push(`  --text-${name}: ${t.value.fontSize};`);
      lines.push(`  --text-${name}--line-height: ${t.value.lineHeight};`);
    } else if (group === 'opacity') lines.push(`  --opacity-${name}: ${t.value};`);
    else lines.push(`  --${t.path.join('-')}: ${t.value};`);
  }
  lines.push('}', '');
  return lines.join('\n');
}

function emitVarsCss(brand, tokens) {
  const lines = [
    `/* Generated from ${brand}.tokens.json -- do not edit by hand. */`,
    `/* Framework-free custom properties, prefixed wds- (Wyvrn design system). */`,
    ':root {',
  ];
  for (const t of tokens) {
    const name = t.path.join('-');
    if (t.type === 'fontFamily') lines.push(`  --wds-${name}: ${cssFamily(t.value)};`);
    else if (t.type === 'typography') {
      lines.push(`  --wds-${name}-font-size: ${t.value.fontSize};`);
      lines.push(`  --wds-${name}-line-height: ${t.value.lineHeight};`);
    } else lines.push(`  --wds-${name}: ${t.value};`);
  }
  lines.push('}', '');
  return lines.join('\n');
}

function emitScss(brand, tokens) {
  const lines = [`// Generated from ${brand}.tokens.json -- do not edit by hand.`];
  for (const t of tokens) {
    const name = t.path.join('-');
    if (t.type === 'fontFamily') lines.push(`$wds-${name}: (${cssFamily(t.value)});`);
    else if (t.type === 'typography') {
      lines.push(`$wds-${name}-font-size: ${t.value.fontSize};`);
      lines.push(`$wds-${name}-line-height: ${t.value.lineHeight};`);
    } else lines.push(`$wds-${name}: ${t.value};`);
  }
  lines.push('');
  return lines.join('\n');
}

function emitRust(brand, tokens) {
  const constName = (path, suffix = '') =>
    (path.join('_') + suffix).replace(/-/g, '_').toUpperCase();
  const lines = [
    `// Generated from ${brand}.tokens.json -- do not edit by hand.`,
    `// RGBA tuples map directly onto egui::Color32::from_rgba_unmultiplied and friends.`,
    '#![allow(dead_code)]',
    '',
  ];
  const dim = (path, value, suffix = '') => {
    const d = parseDim(value);
    return d
      ? `pub const ${constName(path, `${suffix}_${d.unit}`)}: f32 = ${d.num}${Number.isInteger(d.num) ? '.0' : ''};`
      : `pub const ${constName(path, suffix)}: &str = "${value}";`;
  };
  for (const t of tokens) {
    if (t.type === 'color') {
      const { r, g, b, a } = parseHex(t.value);
      lines.push(`pub const ${constName(t.path)}: (u8, u8, u8, u8) = (${r}, ${g}, ${b}, ${a});`);
    } else if (t.type === 'dimension') lines.push(dim(t.path, t.value));
    else if (t.type === 'number') lines.push(`pub const ${constName(t.path)}: f32 = ${t.value};`);
    else if (t.type === 'fontFamily')
      lines.push(`pub const ${constName(t.path)}: &str = "${t.value[0]}";`);
    else if (t.type === 'typography') {
      lines.push(dim(t.path, t.value.fontSize, '_FONT_SIZE'));
      lines.push(dim(t.path, t.value.lineHeight, '_LINE_HEIGHT'));
    }
  }
  lines.push('');
  return lines.join('\n');
}

const FORMATS = {
  'theme.css': emitThemeCss,
  'vars.css': emitVarsCss,
  'tokens.scss': emitScss,
  'tokens.rs': emitRust,
};

for (const brand of brands) {
  const source = JSON.parse(readFileSync(join(tokensDir, `${brand}.tokens.json`), 'utf8'));
  const tokens = flatten(source);
  const outDir = join(root, 'generated', brand);
  mkdirSync(outDir, { recursive: true });
  for (const [file, emit] of Object.entries(FORMATS)) {
    writeFileSync(join(outDir, file), emit(brand, tokens));
  }
  console.log(`${brand}: ${tokens.length} tokens -> ${Object.keys(FORMATS).length} artifacts`);
}
