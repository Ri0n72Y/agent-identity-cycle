/**
 * Root-only tool visibility policy for the Luna preset.
 *
 * The preset itself still registers the complete worker toolset so in-process
 * spawn children can use it. This plugin waits until each session is published,
 * then applies a restriction to the exact root Agent scope. Subagent sessions
 * are identified by the durable session header and deliberately skipped.
 *
 * @module luna-tool-policy
 */

export const name = "luna-tool-policy";
export const inject = ["agents", "sessions", "tools"];

const DEFAULT_ALLOW = ["subagent", "present"];

export function apply(ctx, config) {
  const allow =
    Array.isArray(config?.allow) && config.allow.length > 0
      ? config.allow.map((name) => String(name).trim()).filter(Boolean)
      : DEFAULT_ALLOW;

  ctx.on("session/created", (session) => {
    if (session.header?.origin === "subagent") return;

    const agent = ctx.agents.get(session.id);
    if (!agent) {
      throw new Error(
        `luna-tool-policy: root agent not found for session ${String(session.id)}`,
      );
    }

    // Register through the exact live Agent context so the mask affects only
    // this root Agent. Spawn children join the same preset but receive their own
    // scope and therefore retain the worker toolset before their own toolFilter.
    agent.ctx.tools.restrict({ allow });
  });
}
