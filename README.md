# Agent Identity Cycle

Current version: `0.2.1`

A versioned Agent Skill and design reference for a persistent assistant that evolves from concrete practice into recent continuity, episodic evidence, personalized memory, identity, factual knowledge, and procedural knowledge.

The repository follows the community Agent Skills convention under `.agents/skills/`. The runtime lifecycle is split into two independently invokable Skills because they have different activation frequency and context cost: `short-memory-appending` maintains the fast recent-continuity layer after completed interactions, while `reflection` performs slower consolidation only when the assistant, user, or scheduler decides it is useful.

## Repository structure

```text
.dsh/
└── agent-mode-prompt.md

.agents/
└── skills/
    ├── short-memory-appending/
    │   ├── SKILL.md
    │   └── references/
    │       └── memory-format.md
    └── reflection/
        ├── SKILL.md
        └── references/
            ├── episodes.md
            ├── memories.md
            ├── projects.md
            ├── facts.md
            ├── identity.md
            ├── procedural.md
            └── desktop.md

docs/
├── architecture.md
├── data-flow.md
├── c4.md
├── paper.md
└── skill-writing-principles.md
```

## Design summary

Working context changes continuously. After a complete user-interaction/agent-practice cycle, the assistant independently decides whether recent continuity should be persisted; substantive work will usually invoke `short-memory-appending` once, while trivial exchanges may be skipped. The Skill writes one high-density record to the root-level `short-memory.md`, describing the assistant's meaningful actions and the resulting project or conversation state transition. New Short entries use the standard base index `[date][project][time][session?]` plus `[reflection:pending]`.

Short Memory Appending and slower Reflection are separate decisions. Reflection is not forced after every Short write: the assistant may invoke it immediately when durable information or an important state transition deserves consolidation, or leave pending entries for a later interaction, explicit user request, or periodic scheduler. Reflection updates `memories/projects.md` directly from Short when project state changes, promotes durable factual material into Episode, and then allows User, Facts, Self, and procedural routes to update slower structures. A reflected Short entry becomes `[reflection:done]` but remains in recent memory until normal retention and inactivity rules remove it.

Long-term Memory is a complete, dense, personalized understanding rather than a chronological fact pile. Dynamic project state lives in `memories/projects.md`; stable external knowledge and high-access tool knowledge live in `memories/facts.md` and `memories/tools.md`. Self episodes are organized by mPFC into a structured self-evolution document, SOUL compresses those conclusions into a coherent subject description, and PERSONA projects SOUL into a stable runtime identity baseline. Procedural knowledge evolves through concrete Skills and slower Methodology.

Natural-language files remain canonical content. Knowledge graphs, vector stores, full-text indexes, and runtime world models are optional external cognitive infrastructure. The current deployment model uses one configured absolute assistant workspace rather than per-project local memories; `.dsh/agent-mode-prompt.md` records the memory-loading order and activation contract that a Harness persona/preset can incorporate.

When the Harness supports subagents, both maintenance Skills prefer dedicated short-lived subagents so historical reads and file maintenance do not unnecessarily occupy the parent Agent's active working context.

## Documentation

- [Architecture](docs/architecture.md) — overall layers and architecture diagrams.
- [Data flow](docs/data-flow.md) — fast Short writing, optional Reflection, and slower consolidation routes.
- [C4 views](docs/c4.md) — context, container, and component views for the two-Skill lifecycle.
- [Architecture paper](docs/paper.md) — concise research-oriented description of the earlier architecture baseline; it is explanatory rather than the normative runtime specification.
- [Skill writing principles](docs/skill-writing-principles.md) — authoring rules formed during the design process.
- [Changelog](CHANGELOG.md) — versioned architecture revisions.

## Skill installation

For an Agent Skills-compatible workspace, copy or link both `.agents/skills/short-memory-appending/` and `.agents/skills/reflection/` into the workspace's `.agents/skills/` directory. Harness-specific persona assembly can incorporate `.dsh/agent-mode-prompt.md`; the public template intentionally uses `<ASSISTANT_HOME>` rather than a personal absolute path, which should be supplied by the local deployment.
