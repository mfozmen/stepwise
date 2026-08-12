# Contributing to Stepwise

Thanks for helping improve Stepwise! The core of the plugin is a **prompt-based skill**, so
most changes are to markdown, not code.

## Project layout

```
skills/stepwise/
  SKILL.md         # the brain: the method, its trigger, and the source-loading step
commands/          # slash commands: /stepwise, /stepwise:config
agents/            # subagent wrapper for orchestration flows
.claude-plugin/    # plugin + marketplace manifests
.github/workflows/ # required Claude AI review
```

The explanation quality lives in `SKILL.md`. You "teach" Stepwise by refining those rules —
no model training.

## The two rules that must survive every change

1. **Never advance before the user says continue.** The pacing belongs to them.
2. **Never state anything the source doesn't contain.** Stepwise authors the ordering, the
   headings, and the visuals — never the information.

A change that weakens either one is not a refinement, and the AI review is asked to flag it.

If you edit `SKILL.md`, check `commands/stepwise.md` and `agents/stepwise.md` still agree with
it. The agent deliberately diverges where it has no choice — a subagent can't receive a "continue",
and can't ask the first-run language question. Each divergence stays written down where it applies,
with its reason.

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
