# Identity Runtime

本文只讨论最小运行模型：

```text
DSH Root Agent
+ tool-ralph
+ fresh spawn child
+ shared workspace
+ Identity
```

不把 Short、Episode、长期 Facts 等其他系统引入这条链路。

## Root Agent 是 Soul 的运行时主体

Root Agent 的正常上下文可以理解为：

```text
System / base instructions
+ Current Soul
+ Current Conversation
+ Current User Input
```

Soul 在这里用于：

- 理解用户表达背后的长期语义；
- 保持人格、语气与判断方式的连续性；
- 解释双方长期形成的合作习惯；
- 在任务开始前把相关长期倾向投影为任务约束；
- 在 Ralph 返回结果后，以当前人格解释结果并面向用户回答。

Constitution 与 mPFC 不需要每轮默认进入 Root Context。Constitution 主要用于 Reflection 校准；mPFC 主要用于 Reflection、Deep Reflection 与 Identity 审查。

## Task Ralph 不继承 Soul

普通 Task Ralph Worker 的目标是完成任务，而不是扮演 Root Companion。

理想 Worker Context：

```text
Base Worker Instructions
+ Task Contract / worker constraints
+ Project / Workspace Rules
+ Immutable Objective
+ Previous Ralph Handoff
+ Shared Workspace
```

默认不包含：

```text
soul.md
完整 Root Conversation
mPFC history
Constitution
```

Worker 需要理解用户习惯和工程习惯，但只需要理解与执行相关的部分。Root Agent 应把这些内容投影成可执行约束，而不是复制完整 Soul。

## Soul 到任务的投影

例如 Soul 中可能长期形成：

> 用户通常自己主导架构方向；在实现阶段更希望助手验证、反证和执行，并反感无必要的范围扩张。

Root Agent 可以把它投影成任务约束：

```text
- Treat the supplied requirement/design direction as authoritative.
- Do not broaden discovery unless required by the task.
- Prefer minimal sufficient changes.
- Avoid unrelated refactors.
```

Worker 不需要知道这种合作方式是如何形成的，只需要知道本次应该怎样执行。

## DSH 中的一个重要实现边界

当前 DSH 的 fresh `spawn` subagent 确实不继承父会话历史，但 child 创建时仍会加入父 Agent 的 preset composition。

因此：

> `inheritsParentContext: false` 只表示“不继承 parent conversation”，不等于“不继承 parent composition”。

如果 Soul 被简单实现成所有 preset 成员都会拿到的普通 system-prompt section，那么 Ralph fresh child 仍可能重新获得 Soul。

所以 Soul Context Provider 必须有 Root / Subagent 边界。例如实现时应根据 child 的 subagent 身份、lineage 或 delegation depth 使 Soul 只在 Root Agent 生效，而不是仅依赖“Ralph child 是 fresh”这一事实。

这条限制只针对 Soul 注入。工具、权限、项目规则和普通 worker prompt 仍可按照 DSH 现有 composition 机制继承或配置。

## 完整任务流

```text
                         soul.md
                            │
                            ▼
Human ───────────────► Root Agent
                       │
                       │ understand user
                       │ project constraints
                       ▼
                    Task Contract
                       │
                       ▼
                 ralph(objective)
                       │
                       ▼
                Fresh Worker 1
             objective + contract
              workspace + handoff
                       │
                       ▼
                Fresh Worker N
                       │
                       ▼
                 terminal report
                       │
                       ▼
                    Root Agent
                  + current Soul
                       │
                       ▼
              personalized response
                       │
                       ▼
                     Human
```

普通 Ralph 的结果默认只改变 World / Workspace，不自动改变 Soul。

如果一次经历可能影响长期人格，需要之后进入明确的 Reflection 流程，而不是由 Task Worker 直接写 Identity。
