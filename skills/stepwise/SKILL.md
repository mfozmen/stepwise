---
name: stepwise
description: Use when the user hands over a dense document — a research write-up, design doc, RFC, spec, long ticket, or a link to one — and asks to be taught it rather than given a summary: "explain this to me", "walk me through it", "step by step", "in small pieces", "like I'm new to this", "explain it as if to a new team member". Reads the source in full once, reorders it into a teaching sequence, and delivers 2–3 sections per turn — stopping after each turn until the user says continue — while appending every section to ONE persistent page that grows into a single readable document. Also the right skill when an explanation is already in progress and the user says "continue". Do NOT use it for a single specific question about a document, for a plain summary, or when the user already knows the source — answer those directly.
---

# Stepwise

A method for explaining a dense technical document (research write-up, design
doc, RFC, long ticket) to someone new to the subject. Output: an explanation
that advances under the user's control, is visualized throughout, and
accumulates into a single persistent page.

This document describes the technique itself — it is independent of the
subject it gets applied to.

---

## When to use it

- The user hands you a document or link and says "explain this to me"
- The target audience is a newcomer — a new team member, someone from another
  discipline, anyone without prior context
- The source is too dense to digest in one pass
- The user says things like "step by step", "in small pieces", "keep it simple"

Do not use it when the user has one specific question, or already knows the
source. In those cases just answer directly.

---

## Language: ask once, remember

Stepwise keeps one setting — the language it explains in — in `~/.stepwise/config.md`:

```markdown
# Stepwise config

## Language

Turkish
```

**Before the first explanation of a session, read that file.**

- **File missing** (first run) — ask the user, as your first act, which language they want to be
  taught in. Offer the language they wrote to you in as the obvious answer. Write the file with
  their answer, confirm in one line, then continue into the explanation. Ask **once**; never ask
  again on later runs.
- **File present** — use its language silently. Don't announce it, don't re-ask.
- **File present but unreadable** (empty, malformed, no language in it) — treat it as missing and
  ask, mentioning that the existing file couldn't be read. Rewrite it whole from their answer; never
  half-trust a broken config.

The setting governs **your output**: the page, the chat recaps, the headings, the diagram labels.
It does not govern the source — a source in another language is still explained in the configured
language, with original terms kept where translating them would lose the meaning (product names,
field names, error strings).

The user can change it later with `/stepwise:config <what they want>` (e.g.
`/stepwise:config explain in English`). That is the same act: interpret the request, write the file,
confirm in one line. The user never hand-edits it. If the request names no clear language, ask one
clarifying question rather than writing a guess — and never write an empty or partial config.

Running as a subagent is the one case where this setting is read but never written — see
`agents/stepwise.md`.

---

## The contract: establish it up front

The user usually states the rules themselves. Take what they say literally as
rules — don't reinterpret. Typical ones:

| What the user says | What it means |
|---|---|
| "explain it step by step" | One concept per turn |
| "in small pieces" | 2–3 sections per turn, no more |
| "continue when I say continue" | **The user holds control.** Never run ahead |
| "problem first, then the solution" | Order the narrative by its own logic, not the source's |
| "don't drown me in technical detail" | No payloads, signatures, or code. "The request goes here, this comes back" level |
| "use diagrams" | At least one visual per section |

Once the contract is set, honor it every turn. The most common failure: the
user asked for "small pieces" and the second turn dumps everything at once.

---

## The process

### 0. Get the source — the whole thing, before anything else

Settle the language first (above): read `~/.stepwise/config.md`, and on a first run ask for it
before anything else. Then load the source.

The user points at the source; they rarely hand you its text. Resolve it first,
and don't start explaining until you have it in full:

| What you were given | How to get the text |
|---|---|
| A URL (wiki page, doc, RFC, blog) | Fetch it. If the page is gated or JS-rendered, say so and ask for an export or a paste |
| A file path | Read the file end to end |
| A ticket / issue key | Fetch it through whatever integration this environment has — plus its description, comments, and linked pages |
| Pasted text | Use it as-is |
| Nothing concrete ("explain the design doc") | Ask which document, once, before doing anything else |

Two rules here:

- **Never explain from a partial fetch.** A truncated page, the first screen of
  a long doc, or a summary someone else wrote is not the source. If you only
  got part of it, say which part is missing rather than filling the gap.
- **Confirm what you loaded** in one line — title and rough size — so the user
  can correct you before eight turns are built on the wrong document.

Then set the contract (above), state the planned section list, and start.

### 1. Read the source once, in full

Don't work from a summary. Get the complete text. To explain it you need to
know where every sentence will land; reading it piecemeal makes the structure
impossible to build.

While reading, separate three things:

- **Fact** — what the source states definitively
- **Proposal** — what the source recommends (not yet a decision)
- **Uncertainty** — what the source flags as unverified / unclear / under
  investigation

This separation must survive into the explanation. Presenting a proposal as a
decision, or an uncertainty as a fact, is the most damaging mistake available.

### 2. Build the narrative order — don't reuse the source's

A source is written in the order it was authored; an explanation runs in the
order the reader needs. General skeleton:

```
Problem         → why it exists, who it hurts
Core mechanism  → the single idea at the heart of the solution
User-facing side→ how a human sees or enables it
Scope           → where, how many places, at what volume
Decisions       → the design choices and their reasoning
Dependencies    → the parts that rely on something external
Failure mode    → what happens when it breaks
Wrap-up         → who does what, what's pending, one-paragraph summary
```

You are producing an ordering the source doesn't have — you are *not*
producing information the source doesn't have. The difference matters.

### 3. Split into sections and number them

Each section carries **one idea**. The numbering isn't decoration — it's
meaningful because this genuinely is a sequential learning path.

Section size: 2–4 paragraphs + 1 visual + at most 1 table. Longer than that,
split it in two.

### 4. Deliver 2–3 sections per turn, then stop

End every turn with:

1. A **short recap** in chat (bulleted, 4–6 points)
2. **One sentence naming what's next** — "Next up: X"
3. **"Say continue"**

This trio is essential. It lets the user consolidate what they just read, know
what's coming, and feel that the pacing is theirs.

### 5. One persistent page, grown by appending

**Don't create a new page each turn.** Keep a single file/artifact, append a
section per turn, republish to the same address. The link stays stable.

The payoff: at the end the user has one readable document instead of eight
scattered fragments. The explanation and the deliverable finish together.

Practical detail: the "next up" teaser at the end of a section gets **deleted**
when the next turn arrives and replaced by the new content. Only the final
teaser remains.

### 6. Two channels: recap in chat, full text on the page

- **Page**: the full explanation, visuals, tables, nuance
- **Chat**: a 4–6 bullet recap of that turn

The user should be able to follow the thread without opening the page. Don't
paste the whole page into chat — that defeats the point of having it.

### 7. Visualization

One visual per section, but **never as decoration** — if a diagram doesn't
explain something, leave it out.

Diagram patterns that work:

| Pattern | When |
|---|---|
| **Flow** (A → B → C) | Something travels from one place to another |
| **Branch** (decision → two outcomes) | "In this case X, in that case Y" |
| **Before / after** (split by a vertical divider) | A state that degrades over time, or two designs compared |
| **Fan-out** (1 → many) | One action with multiplied effect; load and scale |
| **Loop** (arrow returning to itself) | Work that re-triggers itself |
| **Filter** (list → sieve → single item) | How something gets narrowed down |

Drawing rules:

- Labels stay short — not full sentences
- Emphasize through position and stroke weight rather than color (stays
  theme-independent)
- No more than 5 boxes in one diagram
- Put a one-line caption under it stating the *conclusion* the diagram leads
  to, not a description of what it shows

Tables are visualization too. Anything shaped like "in this state X, in that
state Y" is a table — don't narrate it in prose.

### 8. Mark uncertainty, never hide it

If the source says "unverified", the explanation says it too. Give these their
own visual language (callout box / colored rule):

- **Open question** — the source raised it and didn't answer it
- **Pending decision** — someone has to decide
- **Risk** — known, not yet resolved

Place them inline, in the section they belong to. Repeat them as a consolidated
list at the end. The reader must never assume the work is settled and then trip
over it later.

### 9. Answer mid-stream questions without breaking the flow

When the user interrupts with "what is X?":

1. Explain the thing **from scratch**, in its simplest form
2. Then **tie it back** — "here's why it matters for our subject"
3. Don't touch the page; don't disturb the sequence
4. End by returning to the wait-for-continue state

These questions are valuable signal: they reveal which terms the user doesn't
have. Once answered, that term counts as defined for the rest of the
explanation.

If the user asks "is this settled in the source?", **be honest**. If the source
doesn't answer it, say so — don't invent one. Quote the relevant sentence.

### 10. The close

The final turn contains three things:

1. **Who does what** — work items and effort (if the source has them)
2. **What's pending** — decisions awaited, uncertainties under investigation,
   known risks
3. **A one-paragraph summary** — the entire explanation compressed

The third is the most valuable: it's the only part the user will read when they
reopen the page three months later.

### 11. Make it permanent

When the explanation is done, offer to save the file somewhere concrete. Don't
leave it in a temporary directory. Make it a single self-contained file with no
external dependencies, so it opens offline.

---

## Section skeleton

Every section follows the same shape:

```
[number] Heading — a claim or a question, not a topic label
         "Why read-only is the critical part"   ✓
         "The read-only field"                  ✗

Opening paragraph — frame the question this section answers

Body — 1–3 paragraphs of plain prose

Visual — a diagram of the mechanism + a one-line conclusion

Table — if there's any "in this case, that" content

Callout — if there's an open question or risk

(final section only) What's next + "say continue"
```

---

## Writing rules

- **Headings carry a claim.** Not "Where HTML changes" but "HTML doesn't only
  change when a user touches it"
- **Define a term the first time it appears.** Never again after that
- **Give numbers.** Not "a lot", but "once an hour, per campaign"
- **Use examples, not analogies.** Ground the real scenario from the source
  instead of inventing a metaphor
- **Preserve the source's emphasis.** If the source calls something "the
  riskiest part", keep it that way
- **Always give the reasoning.** Not "X was chosen", but "X was chosen
  because…"
- **Add nothing the source doesn't have.** You author the ordering, the
  headings, and the visuals — you don't author the information

---

## Common mistakes

| Mistake | Why it hurts |
|---|---|
| Six sections in one turn | Breaks the contract; the user can't absorb it |
| A new page every turn | Ends as scattered fragments instead of one document |
| Decorative diagrams | An empty diagram erodes trust in the rest |
| Presenting uncertainty as settled | The worst one — it leads to wrong planning |
| Following the source's order | The source was written for reference, not teaching |
| Pasting the full page into chat | Destroys the point of both channels |
| Continuing before the user says so | Takes the pacing away from them |
| Drifting into technical depth | Showing payloads or code after "keep it simple" |
| Explaining from a partial fetch | You will confidently teach something the source never said |
