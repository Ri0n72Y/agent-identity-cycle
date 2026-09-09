---
name: reflection
description: Consolidate a persistent assistant's recent work into short-term continuity, episodic evidence, long-term personalized memory, project state, factual knowledge, identity, and procedural knowledge. Use after a completed user-interaction/agent-practice cycle when maintaining Short-term Memory, and during periodic reflection when promoting recent activity into slower structures.
---

# Reflection

Reflection is the main consolidation entry for the persistent assistant. It receives practice that has already happened, keeps recent continuity compact, and routes durable information into slower files whose meaning and update speed differ.

After each complete user interaction and the Agent practice caused by that interaction, update Short-term Memory once. Record what I did that is worth retaining and how the project or conversation state changed after those actions. Short-term Memory is already a highly compressed post-practice record, so it does not need a second pre-write filtering layer and it is never appended once per tool call. Short and Episode use the shared index defined in [references/memory-format.md](references/memory-format.md).

Short-term Memory keeps only the fixed recent period of each active project and conversation. During periodic Reflection, review recent Short entries: completed or durable practice that should remain as future evidence is archived into Episode, still using the same standard memory format; inactive entries beyond the retention period leave Short after any needed long-lived information has been consolidated. Use [references/episodes.md](references/episodes.md) for Episode content and classification.

Memory provides cross-context continuity. Long-term Memory is a complete, dense, personalized index about the user and environment, while dynamic project stages and progress are maintained in `memories/projects.md`; use [references/memories.md](references/memories.md) and [references/projects.md](references/projects.md) when updating them.

Episode `Facts.md` preserves external factual provenance. When facts become stable long-lived knowledge, consolidate them according to [references/facts.md](references/facts.md). General factual knowledge and high-access knowledge about tools, software behavior, operating environments, failures, and verified techniques can be organized separately so operational knowledge remains easy to reach without turning procedural rules into facts.

Self-related episodes may change Identity. mPFC organizes Self facts into a structured self-evolution document and explains why specific experiences changed my self-understanding; SOUL compresses those conclusions into a coherent and continuous description of what kind of subject I am; PERSONA compresses SOUL again into the stable runtime identity fragment that a harness can load or copy into its own persona assembly. Use [references/identity.md](references/identity.md).

Procedural knowledge answers how future work should be performed. Skills may change relatively quickly when real practice provides new evidence and should continue to be validated by later use; Methodology changes more slowly as working patterns become stable across tools and tasks. Use [references/procedural.md](references/procedural.md).

Desktop is the active shared workspace used while work is still being discussed, drafted, or modified. When Reflection needs to decide whether a working file remains active or has become stable enough to move into Projects, Bookshelves, Memory, or Logs, use [references/desktop.md](references/desktop.md).

Keep canonical content file-first and readable. Natural-language documents carry the long-lived meaning; indexes, knowledge graphs, retrieval systems, and runtime world-model assembly can be derived externally. If an internal Reflection route eventually becomes complex enough to require its own context, place that procedure under `workflows/` and keep this `SKILL.md` as the stable entry point rather than splitting the lifecycle into unrelated top-level Skills.
