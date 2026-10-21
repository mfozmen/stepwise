# Contributing to Stepwise

Thanks for helping improve Stepwise! The core of the plugin is a **prompt-based skill**, so
most changes are to markdown, not code.

## Project layout

```
skills/stepwise/
  SKILL.md         # the brain: the method, its trigger, and the source-loading step
commands/          # Claude Code slash commands: /stepwise, /stepwise:config
agents/            # Claude Code subagent wrapper for orchestration flows
.opencode/         # opencode commands and subagent wrapper
opencode/          # opencode plugin entry (registers commands, agent, skill)
opencode.json      # exposes skills/ to opencode in this repo
.claude-plugin/    # Claude Code plugin + marketplace manifests
.github/workflows/ # required Claude AI review
```

The explanation quality lives in `SKILL.md`. You "teach" Stepwise by refining those rules —
no model training. The Claude Code and opencode wrappers are deliberately thin; keep them in sync
with the skill rather than forking the method into them.

## The two rules that must survive every change

1. **Never advance before the user says continue.** The pacing belongs to them.
2. **Never state anything the source doesn't contain.** Stepwise authors the ordering, the
   headings, and the visuals — never the information.

A change that weakens either one is not a refinement, and the AI review is asked to flag it.

If you edit `SKILL.md`, check the Claude Code wrappers (`commands/stepwise.md`,
`commands/config.md`, `agents/stepwise.md`) and the opencode wrappers (`.opencode/commands/`,
`.opencode/agents/stepwise.md`) still agree with it. The agents deliberately diverge where they have
no choice — a subagent can't receive a "continue", and can't ask the first-run language question.
Each divergence stays written down where it applies, with its reason.

## Conventions

- **English only** in docs and prompts.
- **No internal or company-specific content** — no private hosts, ticket keys, partner names,
  or dependencies on proprietary tooling. Stepwise must work in any environment.
- **Conventional Commits** — commit messages drive versioning and the changelog.
- **Every change goes through a PR**, which runs a **required** Claude AI review
  (`.github/workflows/claude-review.yml`). The review needs a `CLAUDE_CODE_OAUTH_TOKEN` repo
  secret — generate it with `claude setup-token`.
- Keep `package.json` and `.claude-plugin/plugin.json` versions in sync (the release hook does
  this for you).
- opencode-specific changes belong in `.opencode/` and `opencode/plugin.js`; do not make the
  Claude Code files depend on opencode.

## Releasing

Versioning uses [release-it](https://github.com/release-it/release-it) with the
conventional-changelog plugin. From `main`:

```
npm install
npm run release
```

The first release is cut explicitly as `npm run release -- 1.0.0`; after that the version
comes from the commits.

It bumps the version (in both `package.json` and `.claude-plugin/plugin.json`), updates
`CHANGELOG.md`, tags the release, and creates a GitHub release — all derived from your
Conventional Commits.

The same package is the opencode plugin (`opencode-stepwise`). Publishing to npm is manual because
release-it is configured with `npm.publish: false`; after a release run:

```
npm publish
```

Until that package is published, install the plugin with a local path as shown in the README.
