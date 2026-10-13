// Builds src/output and dist/output from tokens.json. Run with `npm run build`.
import { readFileSync, writeFileSync } from 'node:fs';
import Color from 'colorjs.io';

const tokens = JSON.parse(readFileSync('tokens.json', 'utf8'));

// Keys become CSS variable names and object paths, so they must be
// lowercase kebab-case (or DEFAULT) to come out the same in every file.
const KEY = /^([a-z0-9]+(-[a-z0-9]+)*|DEFAULT)$/;

const flatten = (node, path = []) =>
  typeof node.value === 'string'
    ? [{ path, value: node.value }]
    : Object.entries(node).flatMap(([key, child]) => {
        if (!KEY.test(key)) throw new Error(`Bad token key "${key}" in ${path.join('.')}`);
        return flatten(child, [...path, key]);
      });

const lookup = (sets, ref) => {
  for (const set of sets) {
    const token = ref.split('.').reduce((node, key) => node?.[key], set);
    if (typeof token?.value === 'string') return token.value;
  }
  throw new Error(`Unknown reference {${ref}}`);
};

// Replaces every {color.x.y} in a value, including ones inside oklch(from …).
const resolve = (value, sets) =>
  value.replace(/\{([^}]+)\}/g, (_, ref) => resolve(lookup(sets, ref), sets));

const load = (name) => {
  const sets = [tokens.Spectrum, tokens[name]];
  return flatten(tokens[name]).map(({ path, value }) => ({
    path,
    name: path.join('-').toLowerCase(),
    value: resolve(value, sets),
  }));
};

const spectrum = load('Spectrum');
const light = load('Light');
const dark = load('Dark');

const camel = (key) => key.toLowerCase().replace(/-(\w)/g, (_, c) => c.toUpperCase());

const nest = (list, value, key = (k) => k) => {
  const root = {};
  for (const token of list) {
    const keys = token.path.slice(1).map(key);
    let node = root;
    for (const k of keys.slice(0, -1)) node = node[k] ??= {};
    node[keys.at(-1)] = value(token);
  }
  return root;
};

// React Native can't parse oklch(), so convert to hex / rgba.
const toHex = (color) => {
  try {
    return new Color(color).to('srgb').toString({ format: 'hex' });
  } catch {
    return color;
  }
};

const toRgba = (color, alpha) => {
  try {
    const rgb = new Color(color).to('srgb');
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => Math.round(Math.max(0, Math.min(255, c * 255))));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return color;
  }
};

const RELATIVE = /oklch\(from\s+(.+?)\s+l\s+c\s+h\s*\/\s*([\d.]+)\)/;

const toReactNative = (value) => {
  if (value.includes('linear-gradient')) {
    return value
      .replace(new RegExp(RELATIVE, 'g'), (_, color, alpha) => toRgba(color, parseFloat(alpha)))
      .replace(/oklch\([^)]+\)/g, toHex);
  }
  const relative = value.match(RELATIVE);
  if (relative) return toRgba(relative[1], parseFloat(relative[2]));
  return value.startsWith('oklch(') ? toHex(value) : value;
};

const reactColors = (list) => nest(list, (t) => toReactNative(t.value), camel);

const cssVars = (selector, list) =>
  `${selector} {\n${list.map((t) => `  --${t.name}: ${t.value};`).join('\n')}\n}`;

// Tailwind v4 namespace for each functional colour group. A group listed with
// a prefix keeps it in the class name: icon tokens become text-icon-*.
//
// The block is `inline` so utilities keep var(--color-…) rather than a theme
// variable resolved once at :root; that is what lets .theme-dark on a wrapper
// switch the functional colours.
const NAMESPACES = {
  'background-color': [['background']],
  'border-color': [['border']],
  'outline-color': [['outline'], ['border']],
  'text-color': [['text'], ['icon', 'icon']],
  'box-shadow-color': [['background']],
};

const utilityName = (path, prefix) => {
  const parts = [prefix, ...path.slice(2)].filter(Boolean);
  return parts.at(-1) === 'DEFAULT' ? parts.slice(0, -1) : parts;
};

const tailwindTheme = () => {
  const blocks = Object.entries(NAMESPACES).map(([namespace, groups]) =>
    groups
      .flatMap(([group, prefix]) =>
        light
          .filter((t) => t.path[1] === group)
          .map((t) => `  --${namespace}-${utilityName(t.path, prefix).join('-')}: var(--${t.name});`)
      )
      .join('\n')
  );
  const spectrumLines = spectrum.map((t) => `  --${t.name}: ${t.value};`).join('\n');
  return `@theme inline {\n${[spectrumLines, ...blocks].join('\n\n')}\n}\n`;
};

// dist/ keeps the shape tsc used to emit, since apps install this package
// straight from git and read those files.
const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

const typeOf = (obj, indent = '') =>
  `{\n${Object.entries(obj)
    .map(([k, v]) => {
      const key = IDENTIFIER.test(k) ? k : JSON.stringify(k);
      return `${indent}    ${key}: ${typeof v === 'string' ? 'string' : typeOf(v, indent + '    ')};`;
    })
    .join('\n')}\n${indent}}`;

const write = (path, content) => writeFileSync(path, content);

const writeModule = (name, obj) => {
  const json = (indent) => `module.exports = /** @type {const} */ ${JSON.stringify(obj, null, indent)};`;
  write(`src/output/${name}.js`, `/**\n * Do not edit directly\n */\n\n${json(2)}`);
  write(`dist/output/${name}.js`, `"use strict";\n/**\n * Do not edit directly\n */\n${json(4)}\n`);
  write(`dist/output/${name}.d.ts`, `declare const _exports: ${typeOf(obj)};\nexport = _exports;\n`);
};

writeModule('colors.spectrum.tailwind', nest(spectrum, (t) => t.value));
writeModule('colors.theme.tailwind', nest(light, (t) => `var(--${t.name})`));
writeModule('colors.spectrum.react', reactColors(spectrum));
writeModule('colors.theme.light.react', reactColors(light));
writeModule('colors.theme.dark.react', reactColors(dark));

write('src/output/colors-spectrum.css', cssVars(':root', spectrum));
write('src/output/theme-light.css', cssVars('.theme-light', light));
write('src/output/theme-dark.css', cssVars('.theme-dark', dark));
write('src/output/tailwind-theme.css', tailwindTheme());
