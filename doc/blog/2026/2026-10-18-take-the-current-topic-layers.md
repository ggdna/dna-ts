<!--
@license
Copyright (c) ggdna

Use of this source code is governed by terms that can be
found in the LICENSE file in the root of this package.
-->

# Take the current topic layers

## Motivation

- `dna-ts` is the TypeScript layer: it combines the ggdna topic layers
  with what is special about TypeScript projects.
- Its topic layers were several minor versions behind. Repos built on it
  missed, among others, the scoped blog rules of the blog layer.
- The goal: `dna-ts` passes on the current state of every topic layer.

## Strategy

- Raise all `@ggdna/*` topic layers to their current versions
- Leave every other dependency where it is, TypeScript included
- Set the organization variables the newer layers require
- Let the DNA test instantiate and verify the result

## Implementation 1: Raise the topic layers

- `dna-readme`, `dna-guides`, `dna-translate`, `dna-index`, `dna-blog`,
  `dna-install`, `dna-vscode`, `dna-clean-code` and `dna-gg` are raised to
  their current versions
- The instantiated guides, templates, skills and scripts of this repo are
  regenerated from them

## Implementation 2: Organization variables

- The newer topic layers mark the organization variables `mustOverride`:
  `dnaCopyrightHolder`, `dnaCompany`, `dnaGitOrg`, `dnaGitOrgUrl`,
  `dnaGitQuickCheckPipelineName` and `dnaJiraPrefix`
- `dna-ts` now sets them in its own `dna/_vars.json`, with the values of
  its own organization ggdna
- The duty is passed on: every layer built on `dna-ts` sets these
  variables in its own `dna/_vars.json`; the DNA test names each missing
  one
- The layer test treats `dna/_vars.json` as the layer's own bookkeeping,
  like `_dna.json`, not as a copy of a parent file

## Dependency updates

- `dna-blog` 0.3.0: one post per repo, only its own changes and what
  updated dependencies changed for it, no mention of the repos that use
  it; posts are filed under `doc/blog/<yyyy>`
- `dna-translate` 0.3.0: german posts are filed under
  `doc/de/blog/<yyyy>`
- `dna-gg` 0.10.0: the publish step runs `/blog` in every repo of the
  ticket that has the blog guide
- The other topic layers require the organization variables above and
  bring their updated guides and skills

## Open Points

- Layers built on `dna-ts` must set the six organization variables before
  they can take this version, so it is released as a major version
- TypeScript 7 is available but not part of this change
