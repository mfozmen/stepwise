# Stepwise

A Claude Code plugin that **teaches** a dense technical document instead of summarizing it.

You hand it a research write-up, design doc, RFC, spec, or long ticket. It reads the whole
thing once, reorders it into a teaching sequence, and explains it **2–3 sections per turn** —
then stops and waits for you to say *continue*. Every section is appended to **one page** that
grows into a single readable document, so at the end you have a deliverable, not eight
scattered chat fragments.

Built for the case where someone new to a subject has to actually understand it — a new team
member, someone from another discipline, or you three months from now.

## Install

```
/plugin marketplace add mfozmen/stepwise
/plugin install stepwise@stepwise
```

## Use

```
/stepwise https://example.com/design-doc
/stepwise ./docs/rfc-0042.md
/stepwise PROJ-123
```

Then just say `continue` between turns. Ask anything mid-stream — it answers, ties the answer
back to the subject, and returns to waiting. It never runs ahead of you.

You can also state the rules in your own words and they are taken literally:
*"in small pieces"*, *"don't drown me in technical detail"*, *"use diagrams"*,
*"problem first, then the solution"*.

## Language

On its first run Stepwise asks which language you want to be taught in and remembers the answer in
`~/.stepwise/config.md`. Change it any time:

```
/stepwise:config explain in English
```

## What it guarantees

- **You hold the pace.** No turn advances before you say so.
- **Nothing invented.** It authors the ordering, the headings, and the visuals — never the
  information. If the source doesn't answer something, it says so.
- **Uncertainty stays visible.** What the source flagged as unverified, undecided, or risky is
  marked as such, inline and again at the end.
- **One visual per section**, and never as decoration.
- **One growing page**, republished to the same address every turn.

## The method

The full technique lives in [`skills/stepwise/SKILL.md`](skills/stepwise/SKILL.md) — the 11-step
process, the section skeleton, the writing rules, the diagram patterns, and the table of common
mistakes. It's written to be readable on its own, independent of any subject it gets applied to.

## Layout

```
skills/stepwise/SKILL.md   # the brain: the method
commands/stepwise.md       # the /stepwise slash command
commands/config.md         # /stepwise:config — the language setting
agents/stepwise.md         # subagent wrapper (produces the whole page in one run)
.claude-plugin/            # plugin + marketplace manifests
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Most changes are markdown, not code.

## License

MIT
