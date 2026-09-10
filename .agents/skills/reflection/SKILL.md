---
name: reflection
description: Consolidate pending Short-memory records into project state, episodic evidence, long-term personalized memory, factual knowledge, identity, and procedural knowledge. Invoke when the assistant judges that recent work deserves immediate reflection, when the user asks for reflection, or from a periodic scheduler; this skill is not expected to run after every interaction.
---

# Reflection

Reflection is the slower consolidation stage of the persistent assistant. It reads rolling Short slots from `<ASSISTANT_HOME>/short-memory.md`, decides what has become durable enough to affect longer-lived structures, and marks the Short slots it has considered without removing them from recent continuity.

The assistant has agency over when to invoke this skill. After Short Memory Maintenance has written or updated a `reflection:pending` slot, the assistant may trigger Reflection immediately when the interaction contains a meaningful project-state transition, an important correction, a durable user preference, a stable factual or tool discovery, a self-related change, or procedural learning that should not wait. If the new material does not need immediate consolidation, leave it pending and continue working; a later user request, a future interaction, or a periodic scheduler can reflect over several pending slots together. Do not add a second per-turn obligation that forces Reflection to run after every Short update.

When the Harness supports subagents, prefer running Reflection in a dedicated subagent so the parent Agent does not fill its active context with historical files and consolidation details. Give the subagent the configured absolute assistant-home path, the pending Short slots or time range to consider, and the current task context needed to interpret them. The subagent should load only the target files needed by the relevant route, make the updates, and return a concise summary of what changed and any ambiguity that still requires parent judgment. If subagents are unavailable, run the same process directly.

The current canonical assistant-home layout is:

```text
<ASSISTANT_HOME>/
├── short-memory.md
├── memories/
│   ├── long-term.md
│   ├── projects.md
│   ├── facts.md
│   └── tools.md
├── episodes/
│   ├── Self.md
│   ├── User.md
│   └── Facts.md
├── identity/
│   ├── mPFC.md
│   ├── SOUL.md
│   └── PERSONA.md
├── procedural/
│   └── methodology.md
└── .agents/
    └── skills/
```

The deployment currently uses one configured absolute path as the assistant workspace. Do not create project-local memory copies or infer a different memory root from the current working directory.

For each pending rolling Short slot, treat its compressed log lines and latest body as one unit of unreflected evidence. The log lines preserve earlier iterations since the previous completed Reflection cycle, while the latest body contains the newest user input, assistant action, and resulting current state. Use the latest body as the primary source for current project-state updates, and use both the compressed logs and latest body when deciding what factual practice deserves durable Episode preservation. Do not reflect only the newest body and silently ignore the pending logs.

Project state is the fastest slower-layer update: when a pending slot changes the current stage, latest result, active direction, or recovery point of a long-running project, update `memories/projects.md` directly from the latest Short state rather than waiting for Episode promotion. Use [references/projects.md](references/projects.md) for that document.

Then decide whether any part of the pending slot deserves durable factual preservation. Episode is the long-lived evidence layer and keeps `Self.md`, `User.md`, and `Facts.md`; archive only what future reasoning may need to reinterpret, using the shared base memory format defined by the `short-memory-appending` skill. Use [references/episodes.md](references/episodes.md) for classification and content.

User-related Episode material may update `memories/long-term.md` when it changes the complete, high-density personalized understanding that should remain useful across future contexts. Use [references/memories.md](references/memories.md). External and technical Episode facts may update `memories/facts.md`; high-access knowledge about tools, software behavior, operating environments, failures, and verified techniques belongs in `memories/tools.md`. Use [references/facts.md](references/facts.md).

Self-related Episode material may update Identity. `identity/mPFC.md` organizes Self facts into a structured self-evolution document and explains why concrete experiences changed the assistant's self-understanding; `identity/SOUL.md` compresses those conclusions into a coherent and continuous subject description; `identity/PERSONA.md` projects SOUL into a compact runtime identity fragment. Use [references/identity.md](references/identity.md). mPFC may change when evidence justifies it, while SOUL and PERSONA should move more slowly and need not be rewritten for every Self episode.

Procedural knowledge answers how future work should be performed. Tool Knowledge and other repeated practice may justify changes to concrete Skills under `.agents/skills/`; broader cross-task habits belong in `procedural/methodology.md` only after they have remained useful across contexts. Use [references/procedural.md](references/procedural.md). Skill changes should remain grounded in real outcomes and continue to be tested by later work.

Desktop remains the active shared workspace. When Reflection needs to decide whether an active file has become stable enough to move into Projects, Bookshelves, Memory, or Logs, use [references/desktop.md](references/desktop.md).

After all relevant routes for a pending Short slot have been considered, change its marker from `[reflection:pending]` to `[reflection:done]` even when the conclusion is that no slower file needs updating. Do not delete or individually rewrite the compressed log lines during this step; they remain part of the current recent-continuity slot until a later substantive Short update begins a new pending cycle or normal retention removes the inactive slot. `done` means the current rolling slot has been reviewed, not that it should be deleted.

Keep canonical content file-first and readable. Natural-language files carry the long-lived meaning; indexes, knowledge graphs, retrieval systems, and runtime world-model assembly can be derived externally. If an internal Reflection route eventually becomes complex enough to require its own context, place that procedure under `workflows/` while keeping this `SKILL.md` as the stable entry point.
