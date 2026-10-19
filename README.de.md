# dna-ts

[English](README.md) | Deutsch

Gibt einem TypeScript-Repo die ggdna-Themen-Schichten und dazu die
TypeScript-Editor-Einstellungen und die Spec für den DNA-Test.

## Motivation

dna-ts ist die TypeScript-Schicht: Sie verbindet die
ggdna-Themen-Schichten mit dem, was nur TypeScript-Projekte brauchen — die
VS-Code-Einstellungen und -Erweiterungen für TypeScript, ESLint, Vite und
Vitest sowie die vitest-Spec, die den DNA-Test ausführt. Ein
TypeScript-Repo bekommt beides mit einer Abhängigkeit.

Die Schicht trägt nur diese Differenz, nie eine Kopie einer Eltern-Schicht.
Früher enthielt sie eine vollständige Kopie ihrer Eltern, und jede Änderung
der Eltern blieb für die Nutzer unsichtbar, bis sie erneut kopiert wurde;
`test/dna/dna-layer.spec.ts` verhindert, dass das zurückkommt.

## Verwendung

Als Dev-Dependency eintragen und einmal initialisieren:

```bash
pnpm add -D @tssuite/dna-ts @tssuite/helix-js
helix init
```

`helix init` legt `test/dna/dna.spec.ts` ab, eine Spec, die die DNA bei
jedem Testlauf instanziiert und prüft, und fragt nach den unten genannten
Organisationsvariablen. Die Engine läuft in den Tests über
`@tssuite/helix-js`, die nach WebAssembly kompilierte helix-Engine.

Der Test legt die Spec dieser Schicht unter `test/dna/dna.spec.ts` ab,
führt die Editor-Einstellungen in `.vscode/settings.json` zusammen und
hängt die Erweiterungs-Empfehlungen an `.vscode/extensions.json` an, beide
geerbt von dna-vscode. Die Eltern-Schichten legen ihre Guides und
Templates in `doc/` ab, ihre Skills in `.claude/skills/`, ihre Skripte in
`scripts/`, den Quick-Check-Workflow in `.github/workflows/` sowie
`CLAUDE.md` und die Prettier-Konfiguration im Wurzelverzeichnis.

## Konfiguration

- `dna/dot-vscode/settings.overrides.json` — die
  TypeScript-Editor-Einstellungen: einfache Anführungszeichen, Imports,
  die beim Verschieben von Dateien angepasst werden, Prettier als
  Formatierer für TypeScript und JavaScript, ESLint-Korrekturen beim
  Speichern und Tippen und der Import-Sortierer; zusammengeführt mit den
  Einstellungen von dna-vscode
- `dna/dot-vscode/extensions.overrides.json` — hängt die Erweiterungen für
  Vite, Vitest, ESLint, Stylelint, Imports, npm und Live Server an die
  Empfehlungen von dna-vscode an
- `dna/test/dna/dna.spec.ts` — die vitest-Spec, die die DNA bei jedem
  Testlauf instanziiert und prüft, abgelegt als `test/dna/dna.spec.ts`

## Umfang

dna-ts trägt nur, was für TypeScript spezifisch ist. Die Code- und
Testregeln für TypeScript kommen aus dna-clean-code, jedes andere Thema
aus seiner eigenen Schicht. Sie nennt weder dna-ggdna noch dna-helix: Das
Thema, wie man DNA-Schichten erstellt, gehört nicht dazu. Auch dna-scripts
ist keine ihrer Eltern.

## Schichten

`dna/_dna.json` nennt diese Eltern mit ihren npm-Namen `@ggdna/dna-*`,
angewendet in dieser Reihenfolge; dna-ts selbst kommt zuletzt:

- [dna-readme](https://github.com/ggdna/dna_readme) — die README-Guides
  und -Templates, der Skill `/readme` und das Skript, das die README prüft
- [dna-guides](https://github.com/ggdna/dna_guides) — die Regeln für
  Guides und Dokumentation und der Skill `/guide`
- [dna-translate](https://github.com/ggdna/dna_translate) — die Regeln,
  die englische und deutsche Dokumentation synchron halten, das deutsche
  Blog-Template und der Skill `/translate`
- [dna-index](https://github.com/ggdna/dna_index) — der Guide und das
  Template der `index.jsonc`, die ein Repo beschreibt, und der Skill
  `/index`
- [dna-blog](https://github.com/ggdna/dna_blog) — der Blog-Guide, das
  Template für Blogbeiträge und der Skill `/blog`
- [dna-install](https://github.com/ggdna/dna_install) — die
  Installations-Guides, die einen Entwicklungsrechner einrichten, und der
  Skill `/install`
- [dna-vscode](https://github.com/ggdna/dna_vscode) — die gemeinsamen
  VS-Code-Einstellungen und -Erweiterungen, die Prettier-Konfiguration
  und der Skill `/vscode`
- [dna-clean-code](https://github.com/ggdna/dna_clean_code) — die Code-
  und Test-Guides, sprachneutral sowie für Dart und TypeScript, und die
  Skills `/code`, `/test`, `/review-light` und `/review-heavy`
- [dna-gg](https://github.com/ggsuite/dna_gg) — der gg-Ticket-Workflow:
  die Entwicklungs-Guides, `CLAUDE.md` und die `/gg`-Skills; sie baut auf
  dna-install, dna-index und dna-github auf, die den Quick-Check-Workflow
  und das GitHub-Setup-Skript beisteuert

Die beiden `*.overrides.json`-Dateien erweitern `.vscode/settings.json`
und `.vscode/extensions.json` von dna-vscode: Die Einstellungen werden
Objekt für Objekt zusammengeführt, so kommt die ESLint-Aktion beim
Speichern zum geerbten `editor.codeActionsOnSave` hinzu, und der
Schlüssel `recommendations+` hängt an die geerbte Liste an.

## Variablen

- `dnaCopyrightHolder` — der Rechteinhaber im Lizenzkopf jeder Datei
- `dnaCompany` — die Firma
- `dnaGitOrg` — die GitHub-Organisation
- `dnaGitOrgUrl` — die URL dieser Organisation
- `dnaGitQuickCheckPipelineName` — der Name der Quick-Check-Pipeline, die
  die Branch-Regeln verlangen
- `dnaJiraPrefix` — das Präfix einer Ticket-ID

`dna/_vars.json` setzt sie für die Instanziierung dieses Repos auf die
Werte von ggdna. `dna/_dna.json` hebt keine Pflicht auf, die die
Themen-Schichten mit `mustOverride` markieren, also setzt ein Repo, das
dna-ts einbindet, `dnaCopyrightHolder`, `dnaCompany`, `dnaGitOrg`,
`dnaGitOrgUrl` und `dnaJiraPrefix` in seiner eigenen `dna/_vars.json`;
`dnaGitQuickCheckPipelineName` hebt bereits dna-gg auf. `helix init` fragt
nach ihnen, und der DNA-Test nennt jede, die fehlt.

## Entwicklung

Der Ordner `dna/` ist handgeschriebene Quelle und wird nie generiert. Das
Repo instanziiert seine eigene DNA — nach Änderungen `pnpm test` laufen
lassen, das vitest und ESLint ausführt; vorher committen, denn eine
Datei, die die DNA überschreiben würde, darf keine uncommittete Arbeit
enthalten.

Bearbeite die Dateien unter `dna/`, nie ihre Kopien in `doc/`, `.claude/`,
`scripts/`, `.vscode/` und `test/dna/dna.spec.ts`: Der Test überschreibt
sie. Dotfiles tragen in `dna/` das Präfix `dot-` und verlieren es beim
Instanziieren (`dna/dot-vscode/` wird zu `.vscode/`).
`test/dna/dna-layer.spec.ts` prüft, dass die Schicht keine Kopie einer
Datei ihrer Eltern trägt, dass ihre Overrides in den instanziierten
`.vscode/`-Dateien ankommen und dass `dna/_dna.json` die
Themen-Schichten nennt. Während der Entwicklung lässt `gg_localize_refs`
die Abhängigkeiten auf die lokalen Checkouts zeigen; die
DNA-Konfiguration enthält nie Pfade.

## Lizenz

MIT — siehe [LICENSE](LICENSE).
