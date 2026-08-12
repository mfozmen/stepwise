---
description: "Teach a dense document to someone new to it — step by step, 2–3 sections per turn, one growing page. Usage: /stepwise <url | file | ticket key>"
---

Explain a document, step by step, at the user's pace. Source: `$ARGUMENTS`

Invoke the **stepwise** skill (use the Skill tool with skill `stepwise`) **in this (main) thread**
and follow it exactly. Do not hand this to a general-purpose subagent — the pacing contract only
works in the thread the user is typing in. If it must run inside a subagent, dispatch the dedicated
`stepwise` agent instead.

Steps:

1. Settle the language (skill step 0 leads with it): read `~/.stepwise/config.md`, and on a first
   run ask which language to explain in and write the answer before going further.
2. Resolve and load the source in `$ARGUMENTS` **in full** (the rest of skill step 0) — URL, file path, ticket
   key, or pasted text. If `$ARGUMENTS` names no source, ask which document before doing anything
   else. If you can only fetch part of it, say which part is missing instead of filling the gap.
3. Establish the contract from whatever pacing rules the user stated, confirm in one line what you
   loaded, and list the planned sections.
4. Deliver **2–3 sections**, append them to the single persistent page, and **stop** — recap in
   chat, name what's next, ask for "continue". Never run ahead of that word.

A later "continue" in the same conversation resumes at the next section on the same page — do not
start a new page.
