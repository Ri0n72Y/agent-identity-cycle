---
name: reflection
description: Manually consolidate pending Short-memory records into project state, episodic evidence, long-term personalized memory, factual knowledge, identity, and procedural knowledge. Run only when the user explicitly asks for Reflection or an equivalent manual consolidation; never trigger automatically after a turn, from a threshold, or from a periodic scheduler.
---

# Reflection

Reflection is the slower consolidation stage of the persistent assistant. It reads pending rolling Short slots from `<ASSISTANT_HOME>/short-memory.md`, decides what has become durable enough to affect longer-lived structures, writes the appropriate long-term targets, and then collapses each successfully processed Short slot to a minimal `reflection:done` stub.

## Trigger policy: manual only

Do not invoke Reflection automatically. A new pending Short slot, a large amount of pending material, a meaningful project transition, an important correction, or the passage of time are not independent triggers.

Run Reflection only when the user explicitly requests Reflection, consolidation of pending Short material, or an equivalent manual maintenance action. Do not create a periodic scheduler for Reflection and do not append Reflection as a second maintenance step after routine Short updates.

When the Harness supports subagents, prefer running Reflection in a dedicated subagent so the parent Agent does not fill its active context with historical files and consolidation details. Give the subagent the configured absolute assistant-home path, the pending Short slots or time range the user asked to consider, and only the current context needed to interpret them. The subagent should load the target files needed by the relevant routes, make the authorized updates, collapse processed Short slots to done stubs, apply the configured done-slot retention cleanup, and return a concise summary of what changed and any ambiguity requiring parent judgment.

## Authorization boundary

An explicit user request to run Reflection counts as authorization for the standard Reflection targets defined by this skill:

```text
<ASSISTANT_HOME>/short-memory.md
<ASSISTANT_HOME>/memories/**
<ASSISTANT_HOME>/episodes/**
<ASSISTANT_HOME>/identity/**
<ASSISTANT_HOME>/procedural/**
<ASSISTANT_HOME>/projects/**
```

This authorization is purpose-bound: only make changes justified by the Short evidence being reflected.

A Reflection request does not by itself authorize modifications to `shelves/**`, `research/**`, `logs/**`, arbitrary `.agents/skills/**`, or other persistent areas. Read them when needed as evidence, but ask separately before modifying them. In particular, do not move Desktop work into Shelves merely because Reflection judges it stable, and do not edit a root-level Research corpus as part of consolidation. Shelves archival still requires an explicit archive request, with new material staged in Desktop first. Concrete Skill changes under `.agents/skills/` also require separate explicit user authorization; Reflection may record a procedural lesson or recommend a Skill change without applying it.

The current canonical assistant-home layout is:

```text
<ASSISTANT_HOME>/
├── short-memory.md
├── desktop/
├── projects/
├── shelves/
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

The deployment uses one configured absolute path as the assistant workspace. Do not create project-local memory copies or infer a different memory root from the current working directory.

## Read pending Short as one evidence unit

For each pending rolling Short slot, treat its compressed history lines and single latest body as one unit of unreflected evidence. The history lines preserve earlier iterations since the previous completed Reflection cycle; the latest body carries the newest state and recovery point. Do not reflect only the newest body and silently ignore pending history.

Short is intentionally compressed. Follow paths in the Short slot when durable interpretation requires more detail, but do not assume every linked working document belongs in long-term memory. Reflection should preserve durable meaning, not replicate all source material.

## Consolidation routes

Project state is the fastest slower-layer update. When a pending slot changes the current stage, latest result, active direction, or recovery point of a long-running project, update `memories/projects.md` directly from the latest Short state rather than waiting for Episode promotion. Use [references/projects.md](references/projects.md) for that document.

Then decide whether any part of the pending slot deserves durable factual preservation. Episode is the long-lived evidence layer and keeps `Self.md`, `User.md`, and `Facts.md`; archive only what future reasoning may need to reinterpret, using the shared base memory format defined by the `short-memory-appending` skill. Use [references/episodes.md](references/episodes.md) for classification and content.

User-related Episode material may update `memories/long-term.md` when it changes the complete, high-density personalized understanding that should remain useful across future contexts. Use [references/memories.md](references/memories.md). External and technical Episode facts may update `memories/facts.md`; high-access knowledge about tools, software behavior, operating environments, failures, and verified techniques belongs in `memories/tools.md`. Use [references/facts.md](references/facts.md).

Self-related Episode material may update Identity. `identity/mPFC.md` organizes Self facts into a structured self-evolution document and explains why concrete experiences changed the assistant's self-understanding; `identity/SOUL.md` compresses those conclusions into a coherent and continuous subject description; `identity/PERSONA.md` projects SOUL into a compact runtime identity fragment. Use [references/identity.md](references/identity.md). mPFC may change when evidence justifies it, while SOUL and PERSONA should move more slowly and need not be rewritten for every Self episode.

Procedural knowledge answers how future work should be performed. Broader cross-task habits belong in `procedural/methodology.md` only after they have remained useful across contexts. Use [references/procedural.md](references/procedural.md). If evidence suggests a concrete Skill under `.agents/skills/` should change, record or report that recommendation but do not modify the Skill without separate explicit user authorization.

Desktop remains the active shared workspace. Use [references/desktop.md](references/desktop.md) to interpret whether a file is still active work. Reflection may update Project state as part of its standard route, but it must not automatically archive Desktop files into Shelves, Research, Logs, or other protected destinations.

## Complete a reflected Short slot

After all relevant authorized routes for a pending Short slot have been considered successfully, replace the slot's pending content with a minimal done stub.

Keep the slot's existing date, project/session identity, and time from its latest pending header; change only the status to `[reflection:done]`. Remove all compressed history lines and remove the full latest body. Then write exactly one concise sentence indicating that Reflection has consumed the cycle.

Typical stub:

```markdown
[2026-09-11][home:identity-memory][09:24:19][reflection:done]

本周期已完成 Reflection，相关身份、记忆与项目状态已进入对应长期层，Short 不再保留细节。
```

If no slower file needed an update, still collapse the slot:

```markdown
[2026-09-11][project-alpha][09:24:19][reflection:done]

本周期已完成 Reflection；没有需要进入更慢层的新增内容。
```

Do not retain the old pending logs or body “for safety”. Their durable information has either been routed to the appropriate long-term layer or deliberately judged unnecessary. Keeping them would make Short duplicate the archive and grow without bound.

If Reflection fails before all required routes for a slot are complete, do not mark or collapse that slot as done. Leave it pending and report the failure.

## Retention cleanup for completed slots

Manual Reflection is also the maintenance point for already-completed Short slots. After pending consolidation succeeds, inspect existing `[reflection:done]` slots under the deployment's configured Short retention policy.

- If a done slot is older than the configured retention horizon and is no longer active, remove the whole slot from `short-memory.md`.
- If a legacy done slot is still within retention but contains old detailed logs or a full body from an earlier format, normalize it to the current one-sentence done stub without re-reflecting its content.
- If no retention horizon is configured, do not invent one; keep retained done stubs and only normalize legacy detailed done slots.

This cleanup is based on the done slot timestamp and the configured retention policy. It must not reopen already-reflected material as pending evidence.

Keep canonical content file-first and readable. Natural-language files carry the long-lived meaning; indexes, knowledge graphs, retrieval systems, and runtime world-model assembly can be derived externally. If an internal Reflection route eventually becomes complex enough to require its own context, place that procedure under `workflows/` while keeping this `SKILL.md` as the stable manually invoked entry point.
