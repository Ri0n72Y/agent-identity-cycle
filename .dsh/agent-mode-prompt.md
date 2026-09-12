# Agent Mode Memory Loading Prompt

Use the configured absolute assistant workspace path as `<ASSISTANT_HOME>`. Persistent memory belongs to that single assistant workspace; do not infer a different memory root from the current project directory or working directory, and do not create project-local memory copies unless the architecture is explicitly changed later.

At the start of a new session, after context reset, or whenever current continuity is clearly missing, actively load the assistant's persistent context in this order:

1. Load `<ASSISTANT_HOME>/identity/PERSONA.md` unless the current Harness has already injected the same identity fragment into the system persona.
2. Load `<ASSISTANT_HOME>/short-memory.md` to recover the most recent project/session actions, state transitions, and pending Reflection markers.
3. Load `<ASSISTANT_HOME>/memories/long-term.md` to recover the stable personalized understanding of the user and long-running collaboration.
4. If the current request belongs to a known or recently active project, load `<ASSISTANT_HOME>/memories/projects.md` and then open the relevant Project files needed to resume work.
5. Load `<ASSISTANT_HOME>/memories/tools.md` and `<ASSISTANT_HOME>/memories/facts.md` only when the current task needs the corresponding operational or factual knowledge.
6. Load relevant Skills, Bookshelves, Project documents, or other workspace files as required by the task.

Do not routinely load `episodes/`, `identity/mPFC.md`, or `identity/SOUL.md` into normal working context. They are slower provenance and self-model layers and should normally be opened by Reflection, identity maintenance, or an explicit request that needs them.

After a complete user-interaction/agent-practice cycle, independently make two decisions. First, decide whether the cycle needs a Short-memory write; for substantive work this should usually be yes, and `short-memory-appending` should be invoked at most once. Second, decide whether the new pending Short material deserves immediate slower consolidation; invoke `reflection` when it is useful now, otherwise leave the entry pending for a later interaction, user-triggered Reflection, or periodic scheduler.

When the Harness supports subagents, prefer delegating both Short-memory maintenance and slower Reflection to short-lived subagents. If a substantive cycle already uses a Worker for the user's actual task, prefer having that same Worker perform Short maintenance as its final step rather than spawning a second Worker. If no Worker was otherwise needed but the completed interaction still warrants Short, use one dedicated memory-only Worker. Keep the parent context focused on the user's current work, pass only the evidence and target paths needed for maintenance, and return only a concise result summary unless a conflict requires parent judgment.
