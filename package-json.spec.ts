// @license
// Copyright (c) ggsuite
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { NormalizedPackageJson, readPackage } from 'read-pkg';
import { beforeAll, describe, expect, it } from 'vitest';


// A DNA package ships content, not code: its payload is the `dna/`
// folder that gg_dna instantiates into consumers. These checks keep the
// manifest honest about that.
describe('package.json', () => {
  let json: NormalizedPackageJson;

  beforeAll(async () => {
    json = await readPackage();
  });

  it('ships the dna folder to consumers', () => {
    // The configuration travels inside dna/_dna.json — `pub` drops every
    // path with a leading dot, so nothing below `.gg/` ever arrives.
    expect(json.files).toContain('dna');
    expect(json.files).not.toContain('.gg/dna.json');
  });

  it('declares no build output — there is nothing to compile', () => {
    expect(json.main).toBeUndefined();
    expect(json.types).toBeUndefined();
    expect(json.files).not.toContain('dist');
  });

  it('depends on the DNA it builds upon', () => {
    // The individual ggdna topic layers. Regular dependencies, so npm
    // installs them transitively for every consumer of this layer.
    expect(Object.keys(json.dependencies ?? {}).sort()).toEqual([
      '@ggdna/dna-blog',
      '@ggdna/dna-clean-code',
      '@ggdna/dna-gg',
      '@ggdna/dna-guides',
      '@ggdna/dna-index',
      '@ggdna/dna-install',
      '@ggdna/dna-readme',
      '@ggdna/dna-translate',
      '@ggdna/dna-vscode',
    ]);
  });

  it('is an ES module package', () => {
    expect(json.type).toBe('module');
  });
});
