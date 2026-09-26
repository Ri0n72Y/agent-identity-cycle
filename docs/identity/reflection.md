# Identity Reflection

Reflection 是一次普通 Ralph 过程。

它不需要独立的长期 Reflection Conversation，也不需要为 Identity 再设计一套 worker report protocol。连续性来自 Identity Workspace 与 mPFC，而不是某个一直存活的 Reflector 对话。

## Reflection 的输入

一次普通 Identity Reflection 可以读取：

```text
constitution.md
+ current soul.md
+ selected new experiences
+ optional relevant mPFC records
```

Deep Reflection 可以扩大 mPFC 历史范围，用于寻找跨时间重复出现的模式、过时判断、矛盾或之前多次被否定但现在已经累积成稳定趋势的证据。

Reflection Worker 每轮都可以是 fresh worker。

## Workspace 是权威状态

Reflection 继续遵循 Ralph 的普通原则：

> Workspace is the source of truth; previous report is only a bounded handoff.

因此，如果 Reflection 判断 Soul 应该改变，它应修改 `identity/soul.md`；如果判断不应该改变，则保持 Soul 不变。

Ralph report 只负责交接“做了什么、依据是什么、还需要做什么”，不成为 Soul 的第二份权威副本。

## 复用原生 Ralph Report

Reflection Round 继续使用 DSH `tool-ralph` 的标准报告：

```ts
interface RalphRoundReport {
  status: 'continue' | 'complete' | 'blocked'
  summary: string
  evidence: string[]
  nextSteps: string[]
  blocker: string
}
```

Reflection 不增加 `decision`、`soulDelta`、`confidence`、`changes` 等新的 worker report 字段。

例如，一次完成但不修改 Soul 的 Reflection 可以正常报告：

```json
{
  "status": "complete",
  "summary": "Reviewed the selected experiences. They are consistent with the current soul but do not justify a persistent identity change.",
  "evidence": [
    "The feedback occurred only in one task-specific context.",
    "The existing soul already captures the broader stable preference.",
    "No persistent change was justified."
  ],
  "nextSteps": [],
  "blocker": ""
}
```

这是一个正式的否定结论，不是“没有 Reflection”。

## mPFC 记录原生结果与派生事实

Reflection 结束后，Harness / Identity 插件把本次 Ralph terminal result 与可客观观察的状态转移写入 `identity/mpfc/reflections/`。

mPFC 记录可以包含三类信息：

```text
Input facts
+ Native Ralph result
+ Derived state transition
```

其中可派生字段例如：

- reflection id；
- 时间；
- 本次审视的 source / scope；
- Ralph terminal status；
- roundsStarted；
- 原生 final report / last report；
- Soul revision 或 hash before；
- Soul revision 或 hash after；
- `soulChanged`。

这些字段是 Harness 根据调用输入和实际文件状态派生的运行事实，不是新的 Reflector 思维协议。

### 否定结果

当：

```text
Ralph status = complete
Soul before == Soul after
```

可以派生：

```text
soulChanged = false
```

它表示：

> 这批经历已经完成 Reflection，但不足以改变当前 Soul。

这条记录必须保留，因为日后的 Deep Reflection 可能发现多次独立的 `no change` 结果已经共同形成新的长期证据。

### 正向状态转移

当：

```text
Ralph status = complete
Soul before != Soul after
```

可以派生：

```text
soulChanged = true
```

从而形成：

```text
Soul revision N
      │
      │ Reflection + evidence
      ▼
Soul revision N+1
```

## Ralph 状态已经足够表达 Reflection 状态

不另外创建 Reflection 状态机：

```text
complete + soulChanged=true
    完成反思，并发生 Soul 状态转移

complete + soulChanged=false
    完成反思，并明确否定 Soul 修改

blocked
    存在具体 blocker，尚未形成完整结论

budget-limited
    Round 用尽，仍有工作未完成

round-failed
    某一 fresh worker 未能产生有效 report
```

## mPFC 的角色

`mpfc/state.json` 可以保存当前 Soul revision / hash、最近一次 Reflection 游标等轻量运行状态。

`mpfc/reflections/*` 应保留每次 Reflection 的审计记录，包括否定结果。它们主要供 Reflection、Deep Reflection 和 Identity 审查使用，不默认进入 Root Agent 的普通上下文。

因此：

```text
constitution:
    我原则上希望成为谁

soul:
    我现在成为了谁

mpfc:
    我曾怎样审视这些变化，
    为什么改变，
    以及为什么有些事情没有让我改变
```

## Trigger

当前守则保持 Reflection 为显式维护过程。普通 Task Ralph 的结果不会自动写 Soul，也不会在任务结束后自动启动 Identity Reflection。

Task experience 是否真正改变长期人格，应在之后明确进入 Reflection 时再判断。
