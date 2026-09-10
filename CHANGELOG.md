# Changelog

## 0.2.3

Refine Short-term Memory into a rolling slot that preserves unreflected iteration progress without becoming an append-only history.

- define one rolling Short slot for each project/session identity;
- when a pending slot is updated, compress the previous latest body into one `- [YYYY-MM-DD HH:mm:ss] ...` log line and preserve earlier pending logs;
- keep the newest header and latest body as the current state, with the body following `user input → assistant action → resulting state`;
- when a done slot changes again, begin a fresh pending cycle without carrying already-reflected history forward as pending logs;
- keep different sessions of the same project adjacent in `short-memory.md` while preserving a flat natural document without project/workspace heading hierarchies;
- standardize memory timestamps at second precision so rolling logs can preserve the previous cycle time;
- make Reflection consume both pending compressed logs and the latest body before marking the rolling slot done;
- update README and architecture/data-flow documentation to match the rolling-slot model.

## 0.2.2

Change Short-term Memory from append-only recent history to one latest-state slot per project/session.

- keep at most one Short record for each project/session identity;
- rewrite the matching record after a substantive interaction instead of appending another historical snapshot;
- update the record timestamp and current-state summary on each rewrite;
- discard superseded Short state while carrying forward only information that remains relevant to current continuity;
- reset the rewritten current version to `reflection:pending`; a previous `done` marker does not carry across state changes;
- treat retention windows as cleanup across inactive project/session slots rather than history retention inside one slot;
- update README and architecture/data-flow documentation to match the latest-state model.

## 0.2.1

Tighten Reflection references so they describe only their local content model and internal document evolution.

- remove cross-layer `形成关系` diagrams and redundant routing summaries from Reflection references;
- keep Episode focused on factual practice records without promoting conclusions into later layers;
- keep Long-term Memory focused on coherent personalized understanding rather than its upstream source;
- keep project-state memory focused on current recoverable project context rather than Reflection input routing;
- keep Facts and Tool Knowledge within one local factual subsystem and remove downstream Procedural routing;
- keep Identity focused on the internal `mPFC → SOUL → PERSONA` progression without Harness assembly instructions;
- keep Procedural focused on Skill and Methodology without restating the whole memory lifecycle;
- simplify Desktop to active-file maintenance and remove duplicated system lifecycle diagrams.

## 0.2.0

Split fast recent-memory persistence from slower Reflection and align the runtime architecture around that distinction.

- add `short-memory-appending` as an independently invokable Skill for one post-interaction Short write;
- make Short writing a strong default for substantive completed interactions while preserving assistant judgment over whether to invoke it;
- keep `reflection` as the slower consolidation Skill, triggered immediately only when useful or later by the assistant, user, or scheduler;
- prefer dedicated subagents for both maintenance paths so file reads and consolidation do not unnecessarily occupy the parent Agent context;
- move Short to root-level `<ASSISTANT_HOME>/short-memory.md` and keep one configured absolute assistant workspace as the current memory root;
- change the shared base memory format to `[date][project][time][session?]` and add Short-only `[reflection:pending|done]` state;
- keep reflected Short entries until normal retention and inactivity rules remove them;
- update project-state memory directly from Short instead of waiting for Episode promotion;
- keep Episode records at the factual layer before later User, Identity, Facts/Tool Knowledge, and Procedural abstraction;
- place stable facts and high-access Tool Knowledge in `memories/facts.md` and `memories/tools.md`;
- narrow Long-term Memory to a coherent personalized user-context document and keep Identity references Harness-neutral;
- add `.dsh/agent-mode-prompt.md` with the persistent-memory loading order and two independent post-turn activation decisions;
- update README, architecture, data-flow, C4, and Skill-writing documentation to match the two-Skill lifecycle.

## 0.1.0

Initial sanitized architecture baseline.

- establish one top-level `reflection` Agent Skill using community `.agents/skills/` conventions;
- define a shared standard memory index format;
- define Short-term Memory as one post-interaction action/state record per complete user-interaction/agent-practice cycle with fixed-period retention;
- define Episode as durable factual provenance promoted from Short and organized into Self, User, and Facts;
- separate Long-term personalized memory from dynamic project-state memory in `memories/projects.md`;
- define external Facts, high-access Tool Knowledge, Identity (`mPFC → SOUL → PERSONA`), and Procedural (`Skill → Methodology`) routes;
- preserve architecture, data-flow, C4, research paper, and Skill writing principles under `docs/`;
- keep canonical content file-first and human-readable while treating KG, vector retrieval, and runtime world models as optional external infrastructure.
