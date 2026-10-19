# dna-ts

English | [Deutsch](README.de.md)

Gives a TypeScript repo the ggdna topic layers plus the TypeScript editor
settings and the DNA test spec.

## Motivation

dna-ts is the TypeScript layer: it combines the ggdna topic layers with
what only TypeScript projects need — the VS Code settings and extensions
for TypeScript, ESLint, Vite and Vitest, and the vitest spec that runs the
DNA test. A TypeScript repo gets both with one dependency.

The layer carries only this delta, never a copy of a parent. It once held
a full copy of its parent, and every change of the parent stayed invisible
to consumers until it was copied again; `test/dna/dna-layer.spec.ts` keeps
that from coming back.

## Usage

Declare it as a dev-dependency and initialize once:

```bash
pnpm add -D @tssuite/dna-ts @tssuite/helix-js
helix init
```

`helix init` places `test/dna/dna.spec.ts`, a spec that instantiates and
verifies the DNA on every test run, and asks for the organization
variables listed below. The engine runs in the tests through
`@tssuite/helix-js`, the helix engine compiled to WebAssembly.

The test keeps the spec of this layer at `test/dna/dna.spec.ts`, merges
the editor settings into `.vscode/settings.json` and appends the extension
recommendations to `.vscode/extensions.json`, both inherited from
dna-vscode. The parent layers add their guides and templates in `doc/`,
their skills in `.claude/skills/`, their scripts in `scripts/`, the quick
check workflow in `.github/workflows/`, and `CLAUDE.md` and the Prettier
configuration at the root.

## Configuration

- `dna/dot-vscode/settings.overrides.json` — the TypeScript editor
  settings: single quotes, imports updated on file moves, Prettier as
  formatter for TypeScript and JavaScript, ESLint fixes on save and on
  type, and the import sorter; merged into the settings of dna-vscode
- `dna/dot-vscode/extensions.overrides.json` — appends the extensions for
  Vite, Vitest, ESLint, Stylelint, imports, npm and Live Server to the
  recommendations of dna-vscode
- `dna/test/dna/dna.spec.ts` — the vitest spec that instantiates and
  verifies the DNA on every test run, placed as `test/dna/dna.spec.ts`

## Scope

dna-ts carries only what is specific to TypeScript. The TypeScript code
and test rules come from dna-clean-code, every other topic from its own
layer. It lists neither dna-ggdna nor dna-helix: the authoring topic of
DNA layers is not part of it. dna-scripts is not among its parents either.

## Layers

`dna/_dna.json` lists these parents by their npm names `@ggdna/dna-*`,
applied in this order; dna-ts itself is applied last:

- [dna-readme](https://github.com/ggdna/dna_readme) — the README guides
  and templates, the `/readme` skill and the README check script
- [dna-guides](https://github.com/ggdna/dna_guides) — the rules for
  writing guides and documentation, and the `/guide` skill
- [dna-translate](https://github.com/ggdna/dna_translate) — the rules that
  keep English and German documentation in sync, the German blog template
  and the `/translate` skill
- [dna-index](https://github.com/ggdna/dna_index) — the guide and the
  template of the `index.jsonc` that describes a repo, and the `/index`
  skill
- [dna-blog](https://github.com/ggdna/dna_blog) — the blog guide, the blog
  post template and the `/blog` skill
- [dna-install](https://github.com/ggdna/dna_install) — the install guides
  that set up a development machine, and the `/install` skill
- [dna-vscode](https://github.com/ggdna/dna_vscode) — the shared VS Code
  settings and extensions, the Prettier configuration and the `/vscode`
  skill
- [dna-clean-code](https://github.com/ggdna/dna_clean_code) — the code and
  test guides, language neutral and for Dart and TypeScript, and the
  `/code`, `/test`, `/review-light` and `/review-heavy` skills
- [dna-gg](https://github.com/ggsuite/dna_gg) — the gg ticket workflow:
  the develop guides, `CLAUDE.md` and the `/gg` skills; it builds on
  dna-install, dna-index and dna-github, which adds the quick check
  workflow and the GitHub setup script

The two `*.overrides.json` files extend `.vscode/settings.json` and
`.vscode/extensions.json` of dna-vscode: the settings merge object by
object, so the ESLint save action joins the inherited
`editor.codeActionsOnSave`, and the `recommendations+` key appends to the
inherited list.

## Variables

- `dnaCopyrightHolder` — the holder named in the license header of every
  file
- `dnaCompany` — the company
- `dnaGitOrg` — the GitHub organization
- `dnaGitOrgUrl` — the URL of that organization
- `dnaGitQuickCheckPipelineName` — the name of the quick check pipeline
  the branch rules require
- `dnaJiraPrefix` — the prefix of a ticket id

`dna/_vars.json` sets them to the values of ggdna for the instantiation of
this repo. `dna/_dna.json` lifts no duty the topic layers mark
`mustOverride`, so a repo listing dna-ts sets `dnaCopyrightHolder`,
`dnaCompany`, `dnaGitOrg`, `dnaGitOrgUrl` and `dnaJiraPrefix` in its own
`dna/_vars.json`; dna-gg already lifts `dnaGitQuickCheckPipelineName`.
`helix init` asks for them, and the DNA test names each one that is
missing.

## Development

The `dna/` folder is hand-authored source and is never generated. The repo
instantiates its own DNA — run `pnpm test` after changes, which runs
vitest and ESLint; commit first, a file the DNA would overwrite must not
carry uncommitted work.

Edit the files below `dna/`, never their copies in `doc/`, `.claude/`,
`scripts/`, `.vscode/` and `test/dna/dna.spec.ts`: the test overwrites
them. Dotfiles carry a `dot-` prefix inside `dna/` and lose it when
instantiated (`dna/dot-vscode/` becomes `.vscode/`).
`test/dna/dna-layer.spec.ts` checks that the layer carries no copy of a
parent file, that its overrides arrive in the instantiated `.vscode/`
files and that `dna/_dna.json` lists the topic layers. During development
`gg_localize_refs` points the layer dependencies at the local checkouts;
the DNA configuration never holds paths.

## License

MIT — see [LICENSE](LICENSE).
