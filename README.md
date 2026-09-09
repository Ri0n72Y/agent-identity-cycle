# Agent Identity Cycle

Current version: `0.1.0`

A versioned Agent Skill and design reference for a persistent assistant that evolves from concrete practice into memory, identity, factual knowledge, and procedural knowledge.

The repository follows the community Agent Skills convention under `.agents/skills/`: `SKILL.md` is the runtime entry point, while focused material is loaded from `references/` as needed. Reflection remains one top-level skill; memory, identity, facts, and procedural evolution are internal routes of the same consolidation capability.

## Repository structure

```text
.agents/
└── skills/
    └── reflection/
        ├── SKILL.md
        └── references/
            ├── memory-format.md
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

The design is file-first and human-readable. Working context changes continuously. After each complete user-interaction/agent-practice cycle, Short-term Memory receives one compressed record of the assistant's meaningful actions and the resulting project or conversation state transition. Short and Episode share the same minimal memory index format: `[date][project][time]<session(optional)>`. Short keeps only a fixed recent period of active continuity; periodic Reflection promotes durable practice into Episode, which then becomes factual provenance for longer-lived structures.

Long-term Memory is a complete, dense, personalized index rather than a chronological fact pile. Dynamic project state is maintained separately in `memories/projects.md`. Self episodes are organized by mPFC into a structured self-evolution document, SOUL compresses those conclusions into a coherent subject description, and PERSONA projects SOUL into a stable runtime identity baseline. External facts and high-access tool knowledge are kept distinct from the assistant's self-model, while Procedural knowledge evolves through Skills and slower Methodology.

Natural-language files are canonical content and Git preserves their evolution. Knowledge graphs, vector stores, full-text indexes, and runtime world models are optional external cognitive infrastructure, allowing the persistent identity to remain portable across harnesses.

## Documentation

- [Architecture](docs/architecture.md) — overall layers and architecture diagrams.
- [Data flow](docs/data-flow.md) — interaction, Short-term Memory, Episode, Identity, Facts, and Procedural flows.
- [C4 views](docs/c4.md) — context, container, and Reflection Skill component views.
- [Architecture paper](docs/paper.md) — concise research-oriented description and references.
- [Skill writing principles](docs/skill-writing-principles.md) — authoring rules formed during the design process.
- [Changelog](CHANGELOG.md) — versioned architecture baseline and later revisions.

## Skill installation

For an Agent Skills-compatible workspace, copy or link `.agents/skills/reflection/` into the workspace's `.agents/skills/` directory. Harness-specific persona assembly, knowledge graphs, and runtime world-model plugins can evolve independently from this skill.
