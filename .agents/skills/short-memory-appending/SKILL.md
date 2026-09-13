---
name: short-memory-appending
description: Maintain one rolling, high-density Short-memory slot for a project/session after a completed user-interaction/agent-practice cycle when recent continuity should be preserved. Prefer using this after substantive interactions, but never invoke it once per tool call and never use it as a second archival knowledge base.
---

# Short Memory Maintenance

This skill maintains the assistant's fast persistent continuity layer at `<ASSISTANT_HOME>/short-memory.md`. Short exists to restore the current work line quickly. It is not an archive, research notebook, source log, or substitute for Project, Desktop, Shelves, Episodes, or long-term memory.

The assistant decides after each complete user interaction and the practice caused by that interaction whether this cycle needs a Short update. Substantive work, state changes, corrections, decisions, or unfinished work should normally update Short; trivial exchanges may be skipped. Invoke this skill at most once for one complete user-interaction/agent-practice cycle.

When the Harness supports subagents, prefer delegating this skill to a short-lived subagent so the parent Agent does not keep file-maintenance details in its active reasoning context. Pass only the minimum completed-cycle evidence needed to write an accurate current state, together with the configured absolute assistant-home path and any project/session label already known. The subagent should read the current `short-memory.md`, update exactly one matching slot or create it if none exists, and return only a concise success/failure summary and any conflict that requires parent judgment.

When the current substantive cycle is already being handled by a Worker for the user's actual task, coalesce Short maintenance into that same Worker invocation as the final step after the primary work completes. Do not spawn a second maintenance Worker merely to write Short when the existing Worker already has the required evidence and access. If the parent completed the cycle without any Worker and the interaction still warrants Short, use one dedicated memory-only Worker. In either case, the parent should not need to load this skill or perform Short file operations itself.

`short-memory-appending` is a narrow maintenance exception to the normal Assistant Home write boundary: it may read and update `<ASSISTANT_HOME>/short-memory.md`, but it must not use this invocation to modify Shelves, Research, long-term memory, Identity, Episodes, Projects, Skills, or any other persistent file.

## Slot identity and header

Use the standard memory format in [references/memory-format.md](references/memory-format.md). Short uses this canonical header:

```text
[YYYY-MM-DD][project[:session]][HH:mm:ss][reflection:pending|done]
```

The project and optional session share one bracket. When a session label is present, the first `:` separates project from session. The session label may itself contain additional stable hierarchy when useful, so forms such as `[home:research:cost-shifting]` are valid: project=`home`, session=`research:cost-shifting`. When there is no useful session label, use only the project, such as `[labourchain]`.

Each project/session identity has one rolling slot. Different sessions belonging to the same project should stay adjacent, but `short-memory.md` remains a flat document: do not add project headings, workspace headings, or nested hierarchies.

## Pending rolling algorithm

A pending slot consists of:

1. one latest header;
2. zero or more compressed history lines belonging only to that same slot;
3. exactly one latest body.

When no matching slot exists, create one with the current timestamp and `[reflection:pending]`.

When the matching slot is already `[reflection:pending]`, perform this update mechanically:

1. preserve the slot's existing compressed history lines in their current order;
2. identify the slot's single previous latest body;
3. compress that previous latest body into exactly one new history line using the previous cycle timestamp;
4. append that one line after the existing history lines;
5. remove the previous full latest body completely;
6. replace the header with the newest date/time and keep `[reflection:pending]`;
7. write one new latest body for the current cycle.

Never append a new full body underneath an old full body. Never keep multiple uncompressed bodies in one pending slot. Existing compressed history lines are already compressed and must not be recompressed on every update.

History lines use:

```text
- [YYYY-MM-DD HH:mm:ss] one-line summary of the previous user input, assistant action, and resulting state
```

A history line normally stays within roughly 100-120 Chinese characters or an equivalent concise length. It preserves only the turn in direction, state transition, correction, or unresolved continuity needed for later Reflection. It must not reproduce research findings, source lists, long arguments, or tool traces.

Rolling history is slot-local. Do not copy an adjacent slot's previous cycle into a newly created slot merely to preserve narrative continuity. Relationships between work lines belong in Project state or linked files, not duplicated Short history.

## Latest body compression

The latest body follows the semantic order `user input → assistant action → resulting state → assistant response`, but this is an ordering principle, not a set of mandatory field labels. State only what is needed to resume the work line.

When a corresponding file already carries the detailed work, the latest body should usually fit within roughly 200-300 Chinese characters or an equivalent concise length. A typical body contains only:

- what the user changed, requested, corrected, or decided;
- what the assistant actually completed at a high level;
- the current state or key turn in conclusion;
- unresolved items or the next recovery point when needed;
- one or a few relevant file paths.

Details belong in their owning files. Do not copy into Short:

- source lists, citations, or long bibliographies;
- step-by-step research or argument chains;
- large sets of numbers, quotations, or per-source findings;
- tool call sequences, browser-navigation history, scrape details, or routine command failures;
- section-by-section conclusions already present in a document;
- full document summaries when a path is sufficient.

Keep only an operationally important tool limitation if the next turn would otherwise repeat a failed path before another memory layer can preserve it; even then, prefer one short sentence and let durable tool knowledge move to `memories/tools.md` during manual Reflection.

If no external file exists and the Short slot is the only current carrier of the state, the body may be somewhat longer, but it should still optimize for fast recovery rather than completeness.

Optional labels such as `未收口：` and `关联文档：` are allowed when they make recovery faster. They are not required fixed fields.

## Reflection states

`reflection:pending` means the current rolling history and latest body have not yet been manually consolidated by Reflection.

Reflection is not triggered by this skill. Leave pending material pending until the user explicitly requests Reflection.

After a manually triggered Reflection successfully considers a pending slot, the Reflection process will remove the slot's compressed history lines and latest body and replace them with a one-sentence `reflection:done` stub. A done slot therefore contains only its header and a concise acknowledgement that the cycle has already been consolidated; it must not retain the detailed pending history.

When a matching `[reflection:done]` slot later receives new substantive work, begin a fresh pending cycle. Replace the done stub with the newest pending body, change the marker to `[reflection:pending]`, and do not convert the done stub or any already-reflected material into pending history. Carry forward only current-state context that is independently needed in the new latest body.

Tool calls are evidence inside the cycle and are not written as separate Short entries.

`short-memory.md` lives directly under the configured absolute assistant workspace rather than under `memories/`, because it is expected to be accessed frequently. Do not derive a different Short-memory location from the current project directory or working directory. The current deployment treats one absolute assistant workspace as the canonical home; per-project local memories are outside the current design.

Short Memory Maintenance does not perform long-term consolidation. That belongs to the manually triggered `reflection` skill. If the deployment defines a retention period, inactive done stubs or stale slots may later be removed by an explicit maintenance policy; do not invent one here.
