# dna-ts

The DNA for all of our TypeScript projects. Builds on the ggdna topic layers — see
[dna_ggdna](https://github.com/ggdna/dna_ggdna) for the set — and adds the
TypeScript-specific layer, inherited via
[helix-js](https://github.com/ggdna/helix-js):

- `dna/dot-vscode/settings.overrides.json` — TS/ESLint editor settings
  merged into the base settings
- `dna/dot-vscode/extensions.overrides.json` — TS extension
  recommendations (array join)
- `dna/dot-vscode/typescript.code-snippets` — workspace snippets (license
  header, test skeleton)
- `dna/dot-claude/skills/review/SKILL.md` — the review skill with the
  kebab-case convention filenames a TypeScript project instantiates
- `dna/test/dna/dna.spec.ts` — the DNA wrapper spec shipped to TS
  consumers (instantiated as `test/dna/dna.spec.ts`)

Dotfiles carry a `dot-` prefix inside `dna/` and lose it when
instantiated (`dna/dot-vscode/…` → `.vscode/…`). Without the escape
`dart pub publish` drops them, and the layer would reach pub consumers
incomplete.

## Usage

```bash
pnpm add -D @tssuite/dna-ts @tssuite/helix-js
helix init
```

The placed spec instantiates and verifies the DNA on every test run (the
topic layers are pulled in transitively). The engine runs via
`@tssuite/helix-js` — the helix engine compiled to WebAssembly.

## Development

`role: "dna"` in `dna/_dna.json`: the `dna/` folder is authored by hand.
The repo instantiates its own DNA — run `pnpm test` after changes; commit
first (a file the DNA would overwrite must not carry uncommitted work).
During development `gg_localize_refs` points the layer dependencies at the
local checkouts; the DNA config itself never holds paths.
