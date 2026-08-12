---
description: "Set the language Stepwise explains in — asked once on first run, changed here any time. Usage: /stepwise:config <what you want>"
---

Configure Stepwise by conversation. Arguments: `$ARGUMENTS`

Invoke the **stepwise** skill (use the Skill tool with skill `stepwise`) **in this (main) thread**
and follow its **"Language: ask once, remember"** section, which owns the exact behaviour — the file,
its format, and what the setting governs.

From `$ARGUMENTS`, take the natural-language request (e.g. `/stepwise:config explain in English`,
`/stepwise:config switch to Turkish`). No source document is needed — this only writes `~/.stepwise/config.md`.

If the request names no clear language, ask one clarifying question rather than writing a guess. If
`$ARGUMENTS` is empty, tell the user the language currently configured and ask what to change it to.

Confirm in one line what was set. Do not explain anything here — configuring and explaining are
separate acts.
