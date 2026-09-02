// @license
// Copyright (c) ggsuite
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';


// dna-ts is the TypeScript ecosystem layer: it carries the delta on top
// of the ggdna topic layers, never a copy of them. These checks pin that
// shape down — the layer once held a full materialized copy of its
// parent, which made every parent change invisible to consumers until it
// was copied again.

/// The parents this layer builds on, as declared in dna/_dna.json.
const parentLayers = [
  '@ggdna/dna-readme',
  '@ggdna/dna-guides',
  '@ggdna/dna-translate',
  '@ggdna/dna-index',
  '@ggdna/dna-blog',
  '@ggdna/dna-install',
  '@ggdna/dna-vscode',
  '@ggdna/dna-clean-code',
  '@ggdna/dna-gg',
];

const parentDnaRoots = parentLayers.map((p) => `node_modules/${p}/dna`);

/**
 * Lists every file below [root], as paths relative to [root].
 * @param root - Folder to walk; it has to exist, so a parent that was
 * never installed fails the check instead of passing it silently.
 * @returns The relative file paths, sorted.
 */
function filesBelow(root: string): string[] {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = `${dir}/${entry.name}`;
      return entry.isDirectory() ? walk(path) : [path];
    });

  return walk(root)
    .map((path) => path.slice(root.length + 1))
    .sort();
}

/**
 * Reads a JSONC file — VS Code configs and DNA configs both carry
 * comments, and there is no JSONC parser in this package's dependencies.
 * @param path - Path of the file to read.
 * @returns The parsed value.
 */
function readJsonc(path: string): Record<string, unknown> {
  const source = readFileSync(path, 'utf8');
  let stripped = '';
  let inString = false;

  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (inString) {
      stripped += c;
      if (c === '\\') stripped += source[++i] ?? '';
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      stripped += c;
      continue;
    }
    if (c === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') i++;
      stripped += '\n';
      continue;
    }
    if (c === '/' && source[i + 1] === '*') {
      i = source.indexOf('*/', i + 2) + 1;
      continue;
    }
    stripped += c;
  }

  // Trailing commas are legal in JSONC but not in JSON.
  return JSON.parse(stripped.replace(/,(\s*[}\]])/g, '$1')) as Record<
    string,
    unknown
  >;
}

describe('the dna-ts layer', () => {
  it('carries only its own delta, never a copy of a parent', () => {
    const base = new Set(parentDnaRoots.flatMap(filesBelow));
    // `_dna.json` and `_generated.json` are the layer's own bookkeeping,
    // not inherited content — every layer carries both.
    const bookkeeping = ['_dna.json', '_generated.json'];
    const own = filesBelow('dna').filter((p) => !bookkeeping.includes(p));

    expect(own.filter((path) => base.has(path))).toEqual([]);
  });

  it('joins its extensions into the inherited ones', () => {
    const overrides = readJsonc('dna/dot-vscode/extensions.overrides.json');
    // `+` appends and deduplicates; a plain `recommendations` would drop
    // everything the parent layers recommend.
    expect(Object.keys(overrides)).toEqual(['recommendations+']);

    const instance = readJsonc('.vscode/extensions.json');
    expect(instance.recommendations).toEqual(
      expect.arrayContaining([
        ...(overrides['recommendations+'] as string[]),
        // One inherited entry, as proof the join kept the base list.
        'esbenp.prettier-vscode',
      ]),
    );
  });

  it('merges its settings into the inherited ones', () => {
    const overrides = readJsonc('dna/dot-vscode/settings.overrides.json');
    const instance = readJsonc('.vscode/settings.json');

    for (const [key, value] of Object.entries(overrides)) {
      if (key === 'editor.codeActionsOnSave') continue;
      expect(instance[key]).toEqual(value);
    }

    // Objects deep-merge: the ESLint save action arrives without
    // displacing the actions the parent layers declare.
    expect(instance['editor.codeActionsOnSave']).toEqual({
      'source.fixAll': 'always',
      'source.organizeImports': 'always',
      'source.fixAll.eslint': 'explicit',
    });
  });

  it('declares the ggdna topic layers as its parents', () => {
    const config = readJsonc('dna/_dna.json');
    expect(config.layers).toEqual(parentLayers);
  });
});
