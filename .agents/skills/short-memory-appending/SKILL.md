---
name: short-memory-appending
description: Maintain the latest high-density recent-memory state after a completed user-interaction/agent-practice cycle when the assistant judges that recent continuity should be preserved. Prefer using this after most substantive interactions, but activation remains the assistant's own judgment; never invoke it once per tool call.
---

# Short Memory Maintenance

This skill maintains the assistant's fast persistent continuity layer at `<ASSISTANT_HOME>/short-memory.md`. The assistant decides after each complete user interaction and the practice caused by that interaction whether this cycle needs to update Short; for substantive work, state changes, corrections, decisions, or unfinished work, updating Short should be the normal choice, while trivial exchanges may be skipped without adding a separate filtering pipeline.

When the Harness supports subagents, prefer delegating this skill to a short-lived subagent so the parent Agent does not need to keep file-maintenance details in its active reasoning context. Pass only the minimum completed-cycle evidence needed to write an accurate current state, together with the configured absolute assistant-home path and any project/session label already known. The subagent should read the current `short-memory.md`, update the matching record or create it if none exists, and return only a concise success/failure summary and any conflict that requires parent judgment. If subagents are unavailable, perform the same operation directly.

Invoke this skill at most once for one complete user-interaction/agent-practice cycle. Short-term Memory is maintained as current state rather than as an append-only history. For each project/session identity, `short-memory.md` keeps only one latest record. The identity key is the project plus the optional session label from the standard memory header: when a session label is present, update the record matching that project and session; when no session label is used, the project itself identifies the record.

On invocation, first find the existing record for the same project/session identity. If it exists, replace that record with a newly condensed description of the latest meaningful assistant actions and the current project or conversation state after this cycle. Update its date and time to the current cycle. Do not preserve the previous Short text merely to retain history, and do not accumulate successive state snapshots for the same project/session. Information that is still relevant to the current state may be carried forward into the rewritten record; obsolete state and superseded actions should disappear from Short. If no matching record exists, create one new record.

Tool calls are evidence inside the cycle and are not written as separate Short entries. The record should remain concise enough to restore the latest working state directly, rather than forcing the Agent to reconstruct the present from several older Short entries.

Use the standard memory format in [references/memory-format.md](references/memory-format.md). Every newly created or materially updated Short record is written with `[reflection:pending]`, because the current version has not yet been considered by the slower Reflection process. A previous `[reflection:done]` marker belongs only to the superseded version of that record and must not be carried forward after the state changes. `[reflection:done]` means the current record version has already been considered; it does not freeze the record or cause it to be removed.

`short-memory.md` lives directly under the configured absolute assistant workspace rather than under `memories/`, because it is expected to be accessed frequently. Do not derive a different Short-memory location from the current project directory or working directory. The current deployment treats one absolute assistant workspace as the canonical home; per-project local memories are outside the current design.

Short Memory Maintenance does not preserve historical state for a project/session. Durable history and slower consolidation belong to the separate `reflection` skill and its target files. If an older Short version is replaced before Reflection has preserved anything from it, that old Short version is intentionally discarded; Short is optimized for current continuity rather than historical completeness.

If the deployment defines a retention period, project/session records that have not been updated within that period and are no longer active may be removed. Retention applies across project/session records; within one project/session, replacement by a newer record happens immediately regardless of the retention window.
