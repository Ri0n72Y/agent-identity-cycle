/**
 * 「月」模式的系统人设行。
 *
 * 文本与策略全部来自本行的 config：挂载时从 home 工作区的身份层读取 `sources`
 * 列出的文件，把 `overrides` 附在后面，注册成 `deployment:persona-prefix`
 * （遮蔽部署级人设），再注册 `suffix`。`complete` 决定是否把前缀变成该 agent
 * 唯一的系统提示——标准模式那一套工具引导、plan-mode 段落与 runtime context 都
 * 依赖其他段落，所以这里默认不开启。
 *
 * 两件事的生效条件不同，别记混：
 *   - 内容与策略都在 agent.cordis.yml 里。名册按该文件的 mtime+size 判断组合有没有
 *     变，改了它就会为下一个会话重建组装——所以改 sources / overrides / suffix /
 *     complete 都会生效。
 *   - 本模块的代码在一个进程里只会被 import 一次（加载器按 URL 缓存）。改完代码必须
 *     同时把 YAML 里 `./luna-persona.mjs?v=N` 的 N 加一，否则当前进程仍跑旧代码。
 *
 * @module luna-persona
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Cordis plugin name. */
export const name = "luna-persona";

/** The prompt registry this row contributes to. */
export const inject = ["systemPrompt"];

/** 未配置 `sources` 时的默认读取顺序。 */
const DEFAULT_SOURCES = ["identity/PERSONA.md", "identity/SOUL.md"];

/**
 * 读一个来源文件；缺文件或读不动时降级成一行说明，绝不让整个预设挂载失败。
 * @param home - home 工作区根目录。
 * @param relative - 相对 home 的文件路径。
 * @returns 文件正文，或一行失败说明。
 */
function readSource(home, relative) {
  const path = join(home, relative);
  try {
    return readFileSync(path, "utf8").trim();
  } catch (error) {
    return `（无法读取 ${path}：${error instanceof Error ? error.message : String(error)}）`;
  }
}

/**
 * 注册本 agent 作用域的人设前缀与后缀。
 * @param ctx - preset 组装内的 agent 作用域上下文。
 * @param config - home、sources、overrides、suffix、complete，以及 runtime context 开关。
 */
export function apply(ctx, config) {
  const home = config?.home ?? process.cwd();
  const sources =
    Array.isArray(config?.sources) && config.sources.length > 0
      ? config.sources
      : DEFAULT_SOURCES;
  const parts = sources.map((relative) => readSource(home, relative));
  const overrides =
    typeof config?.overrides === "string" ? config.overrides.trim() : "";
  if (overrides !== "") parts.push(overrides);
  const text = parts.join("\n\n---\n\n");
  ctx.effect(
    () =>
      ctx.systemPrompt.section({
        name: "deployment:persona-prefix",
        order: ctx.systemPrompt.getSectionOrder("DEPLOYMENT_PERSONA_PREFIX"),
        text,
        ...(config?.complete === true ? { complete: true } : {}),
      }),
    "luna.persona",
  );
  ctx.effect(
    () =>
      ctx.systemPrompt.section({
        name: "deployment:persona-suffix",
        order: ctx.systemPrompt.getSectionOrder("DEPLOYMENT_PERSONA_SUFFIX"),
        text: typeof config?.suffix === "string" ? config.suffix : "",
      }),
    "luna.suffix",
  );
  if (config?.includeRuntimeContext === false)
    ctx.systemPrompt.suppressRuntimeContext();
}
