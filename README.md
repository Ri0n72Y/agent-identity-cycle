# Agent Identity Cycle

Current version: `0.2.4`

A versioned Agent Skill and design reference for a persistent assistant that evolves from concrete practice into recent continuity, episodic evidence, personalized memory, identity, factual knowledge, and procedural knowledge.

The repository follows the community Agent Skills convention under `.agents/skills/`. The runtime lifecycle is split into two Skills with different activation contracts: `short-memory-appending` maintains fast recent continuity after completed interactions when the assistant judges that continuity is worth preserving, while `reflection` performs slower consolidation only after an explicit user-triggered Reflection request.

## Repository structure

```text
.dsh/
├── agent-mode-prompt.md
└── .agent-presets/luna/

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

Working context changes continuously. After a complete user-interaction/agent-practice cycle, the assistant decides whether recent continuity should be persisted; substantive work will usually invoke `short-memory-appending` once, while trivial exchanges may be skipped. When the current turn already uses a Worker, Short maintenance is coalesced into that same Worker as its final step whenever possible.

Short and Episode share the base index:

```text
[date][project[:session]][time]
```

Short adds `[reflection:pending|done]`. The first `:` separates project from session; the session portion may contain additional stable hierarchy, such as `home:research:cost-shifting`.

`short-memory.md` keeps one rolling slot for each project/session identity. A pending slot contains one latest header, zero or more one-line compressed logs for earlier unreflected iterations, and exactly one latest body. On the next update, the previous latest body is compressed into one history line and removed before the new body is written. Existing logs are not repeatedly recompressed. Detailed research, source lists, tool traces, and section-level findings stay in their owning files rather than being duplicated into Short.

Reflection is manual-only. Pending material remains pending until the user explicitly asks to run Reflection; the assistant does not trigger it based on importance, thresholds, elapsed time, or a scheduler. Reflection consumes the full pending slot, routes durable information to the authorized slower layers, then replaces the slot with a one-sentence `reflection:done` stub. At the same maintenance point, already-completed done slots are cleaned according to the deployment's configured retention policy; retained legacy done slots that still contain old detailed bodies are normalized to the current stub format without being reflected again.

Assistant Home has an explicit write boundary. Ordinary Workers may directly write `desktop/**` and `projects/**`. Other persistent areas such as Shelves, Research, Memory, Episodes, Identity, Procedural, Logs, and Skills require explicit user authorization for that write. `short-memory-appending` is a narrow exception for `short-memory.md`; manually triggered Reflection is a narrow exception for its defined memory/project/episode/identity/procedural targets.

Desktop is the active shared workspace; Shelves is an archival destination. New discussion, research, and organization work must first exist in Desktop. After an explicit archive request, the result may be moved into Shelves; when the Desktop copy is no longer active, it is removed rather than kept as a duplicate. Direct modification of Shelves is reserved for an explicit request to revise an already-existing Shelves document.

Long-term Memory is a complete, dense, personalized understanding rather than a chronological fact pile. Dynamic project state lives in `memories/projects.md`; stable external knowledge and high-access tool knowledge live in `memories/facts.md` and `memories/tools.md`. Self episodes are organized by mPFC into a structured self-evolution document, SOUL compresses those conclusions into a coherent subject description, and PERSONA projects SOUL into a stable runtime identity baseline. Procedural knowledge evolves through authorized concrete Skills and slower Methodology.

Natural-language files remain canonical content. Knowledge graphs, vector stores, full-text indexes, and runtime world models are optional external cognitive infrastructure. The current deployment uses one configured absolute assistant workspace rather than per-project local memories.

## Documentation

- [Architecture](docs/architecture.md) — current normative architecture and write boundaries.
- [Data flow](docs/data-flow.md) — fast Short maintenance, manual Reflection, retention cleanup, and Desktop/Shelves flow.
- [C4 views](docs/c4.md) — context, container, and component views for the current two-Skill lifecycle.
- [Architecture paper](docs/paper.md) — research-oriented explanation synchronized to the current 0.2.4 behavior.
- [Skill writing principles](docs/skill-writing-principles.md) — authoring rules formed during the design process.
- [Changelog](CHANGELOG.md) — versioned architecture revisions.

## Skill installation

For an Agent Skills-compatible workspace, copy or link both `.agents/skills/short-memory-appending/` and `.agents/skills/reflection/` into the workspace's `.agents/skills/` directory. Harness-specific persona assembly can incorporate `.dsh/agent-mode-prompt.md`; the public template uses `<ASSISTANT_HOME>` while a local deployment supplies its concrete absolute path.
