---
name: short-memory-appending
description: Append one high-density recent-memory record after a completed user-interaction/agent-practice cycle when the assistant judges that recent continuity should be preserved. Prefer using this after most substantive interactions, but activation remains the assistant's own judgment; never invoke it once per tool call.
---

# Short Memory Appending

This skill maintains the assistant's fast persistent continuity layer at `<ASSISTANT_HOME>/short-memory.md`. The assistant decides after each complete user interaction and the practice caused by that interaction whether this cycle needs to be written; for substantive work, state changes, corrections, decisions, or unfinished work, writing Short should be the normal choice, while trivial exchanges may be skipped without adding a separate filtering pipeline.

When the Harness supports subagents, prefer delegating this skill to a short-lived subagent so the parent Agent does not need to keep file-maintenance details in its active reasoning context. Pass only the minimum completed-cycle evidence needed to write an accurate record, together with the configured absolute assistant-home path and any project/session label already known. The subagent should read the current `short-memory.md`, perform the write, and return only a concise success/failure summary and any conflict that requires parent judgment. If subagents are unavailable, perform the same operation directly.

Invoke this skill at most once for one complete user-interaction/agent-practice cycle. On invocation, append one natural-language record describing two things together: what the assistant actually did that is worth preserving, and how the project or conversation state changed after those actions. Tool calls are evidence inside the cycle and are not written as separate Short entries.

Use the standard memory format in [references/memory-format.md](references/memory-format.md). New Short entries are written with `[reflection:pending]`. A pending marker means the entry has not yet been considered by the slower Reflection process; `[reflection:done]` means it has already been considered. Reflection status is independent from Short retention, so a reflected entry remains in `short-memory.md` while it is still inside the configured retention period or still useful for recent continuity.

`short-memory.md` lives directly under the configured absolute assistant workspace rather than under `memories/`, because it is expected to be accessed frequently. Do not derive a different Short-memory location from the current project directory or working directory. The current deployment treats one absolute assistant workspace as the canonical home; per-project local memories are outside the current design.

Short Memory Appending does not perform long-term consolidation. It does not promote entries into Episode, update mPFC, extract Tool Knowledge, or decide Methodology. Those slower changes belong to the separate `reflection` skill. If the deployment defines a retention period, old inactive Short entries may be cleaned when it is safe to do so; never invent a retention window when none is configured, and never delete an entry merely because its reflection marker is `done`.
