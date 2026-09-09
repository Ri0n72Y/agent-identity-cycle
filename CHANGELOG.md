# Changelog

## 0.1.0

Initial sanitized architecture baseline.

- establish one top-level `reflection` Agent Skill using community `.agents/skills/` conventions;
- define a shared standard memory index format: `[date][project][time]<session(optional)>`;
- define Short-term Memory as one post-interaction action/state record per complete user-interaction/agent-practice cycle with fixed-period retention;
- define Episode as durable factual provenance promoted from Short and organized into Self, User, and Facts;
- separate Long-term personalized memory from dynamic project-state memory in `memories/projects.md`;
- define external Facts, high-access Tool Knowledge, Identity (`mPFC → SOUL → PERSONA`), and Procedural (`Skill → Methodology`) routes;
- preserve architecture, data-flow, C4, research paper, and Skill writing principles under `docs/`;
- keep canonical content file-first and human-readable while treating KG, vector retrieval, and runtime world models as optional external infrastructure.
