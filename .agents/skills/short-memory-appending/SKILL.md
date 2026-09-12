---
name: short-memory-appending
description: Maintain one rolling high-density Short-memory slot for a project/session after a completed user-interaction/agent-practice cycle when the assistant judges that recent continuity should be preserved. Prefer using this after most substantive interactions, but activation remains the assistant's own judgment; never invoke it once per tool call.
---

# Short Memory Maintenance

This skill maintains the assistant's fast persistent continuity layer at `<ASSISTANT_HOME>/short-memory.md`. The assistant decides after each complete user interaction and the practice caused by that interaction whether this cycle needs to update Short; for substantive work, state changes, corrections, decisions, or unfinished work, updating Short should be the normal choice, while trivial exchanges may be skipped without adding a separate filtering pipeline.

When the Harness supports subagents, prefer delegating this skill to a short-lived subagent so the parent Agent does not need to keep file-maintenance details in its active reasoning context. Pass only the minimum completed-cycle evidence needed to write an accurate current state, together with the configured absolute assistant-home path and any project/session label already known. The subagent should read the current `short-memory.md`, update the matching slot or create it if none exists, and return only a concise success/failure summary and any conflict that requires parent judgment. If subagents are unavailable, perform the same operation directly.

When the current substantive cycle is already being handled by a short-lived Worker for the user's actual task, prefer coalescing Short maintenance into that same Worker invocation as the final step after the primary work completes. Do not spawn a second maintenance Worker merely to write Short when the existing Worker already has the required evidence and access. If the parent completed the cycle without any Worker and the interaction still warrants Short, use one dedicated memory-only Worker. In either case, the parent should not need to load this skill or perform Short file operations itself.

Invoke this skill at most once for one complete user-interaction/agent-practice cycle. Short-term Memory is maintained as rolling state rather than as an append-only interaction history. Each project/session identity has one rolling slot. The identity key is the project plus the optional session label from the standard memory header: when a session label is present, update the matching project/session slot; when no session label is used, the project itself identifies the slot.

`short-memory.md` remains a flat, naturally ordered document. Different sessions belonging to the same project should stay adjacent so the project's recent contexts can be read together, but do not add workspace, project, or session headings and do not introduce a nested hierarchy. Preserve the existing natural order as much as possible; the only grouping requirement is that slots for the same project remain together.

Use the standard memory format in [references/memory-format.md](references/memory-format.md). A rolling slot has one latest header, optional compressed pending-history lines, and one latest body. The latest body should preserve the semantic order `user input → assistant action → resulting state → assistant response`: briefly state what the user asked, clarified, corrected, or decided; what the assistant actually did in response; what the project or conversation has now advanced to; and, when useful for continuity, how the assistant ultimately replied or delivered the result. Keep this as natural language rather than fixed fields.

When no matching slot exists, create one with the current timestamp and `[reflection:pending]`.

When the matching slot is already `[reflection:pending]`, merge rather than discard the unreflected iteration history. Keep any existing compressed log lines. Compress the previous latest body into one new line using the previous cycle timestamp:

```text
- [YYYY-MM-DD HH:mm:ss] one-line summary of the previous user input, assistant action, and resulting state
```

Then replace the main header with the newest date/time/session values, keep the slot `[reflection:pending]`, and write a new latest body for the current cycle. The old full body is removed after it has been represented by the one-line log. The compressed logs should stay concise and preserve only enough action/state information for later Reflection; they are not a transcript.

When the matching slot is `[reflection:done]` and a new substantive cycle occurs, start a new pending cycle. Do not carry the already-reflected historical log forward as new pending history, and do not convert the old done body into a new pending log. Carry forward only current-state context that is still needed to understand the new latest body, then rewrite the slot with the newest header and `[reflection:pending]`.

Tool calls are evidence inside the cycle and are not written as separate Short entries. A slot should remain concise enough to recover the current work directly while retaining the compressed unreflected iterations that the slower Reflection process has not yet consumed.

`short-memory.md` lives directly under the configured absolute assistant workspace rather than under `memories/`, because it is expected to be accessed frequently. Do not derive a different Short-memory location from the current project directory or working directory. The current deployment treats one absolute assistant workspace as the canonical home; per-project local memories are outside the current design.

Short Memory Maintenance does not perform long-term consolidation. That belongs to the separate `reflection` skill. `[reflection:done]` means the current rolling slot has been considered by Reflection; it does not freeze the slot or remove it. If the deployment defines a retention period, project/session slots that have not been updated within that period and are no longer active may be removed. Retention applies across slots, while iterative history inside a pending slot is governed by the rolling merge rules above.
