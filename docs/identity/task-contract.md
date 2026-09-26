# Task Contract

Task Contract 是 Soul 与 Task Ralph 之间的临时桥梁。

它不是 Soul，也不是新的长期记忆层。它更接近一个**任务级、动态、轻量的 AGENTS.md**：由带有 Soul 的 Root Agent 在开始任务前初始化，并在用户明确改变要求时更新，让 fresh Worker 可以稳定理解“这次应该怎样做”。

## 来源

Task Contract 可以由这些输入共同形成：

```text
Current Soul
+ Current User Request
+ Current Conversation
+ Project / Repository Rules
        ↓
Root Agent
        ↓
Task Contract
```

其中 Soul 只提供与执行相关的投影，不应把完整人格、关系历史或 mPFC 复制给 Worker。

## 适合进入 Task Contract 的内容

典型内容包括：

- 本次 objective 的解释与完成条件；
- 用户这次明确要求的应该 / 不应该做；
- 从长期合作习惯投影出的执行偏好；
- 当前项目或仓库已有的规则；
- 本次允许修改、只读或禁止触碰的范围；
- 用户中途 steer 后产生的新约束。

例如：

```text
Objective:
- 独立审查当前 PR。

Constraints:
- 不沿用上一轮 review 的结论。
- 重新读取当前 HEAD 与相关 upstream contract。
- 只报告具有独立失效价值的问题。
- 不做与问题无关的重构。
- 本次只审查，不修改代码。
```

这只是内容示意，不定义固定序列化 schema。

## 不适合进入 Task Contract 的内容

不要把下列内容复制进 Contract：

- 完整 Soul；
- “为什么我们形成这种合作关系”的长期叙事；
- mPFC Reflection 历史；
- 与当前任务无关的用户偏好；
- 项目已经由 Workspace / AGENTS.md / docs 承载的大段事实；
- 上一轮 Ralph 的工作状态。

Ralph 工作状态继续由 Workspace 与标准 Ralph handoff 承担。

## 生命周期

Task Contract 的生命周期跟随一个具体任务，而不是跟随人格。

```text
task start
   ↓
Root initializes contract
   ↓
Ralph rounds consume contract
   ↓
user steering may update contract
   ↓
task ends
   ↓
contract no longer participates in future tasks
```

如果某条约束后来被证明是长期稳定的合作习惯，它是否进入 Soul 应由后续 Reflection 判断，而不是把 Task Contract 自动沉淀进 Soul。

## 传输方式暂不固化

当前设计不要求 Task Contract 必须成为某种特定文件或协议。

可接受的实现包括：

1. Root Agent 直接把约束编译进 Ralph `objective` / request prompt；
2. Harness 在 fresh Worker prompt 中注入一个稳定的 worker constraints section；
3. 对较长任务使用一个 task-local contract 文件，由每轮 Worker 读取。

选择哪一种属于后续工程实现问题。

不变量只有两个：

> Worker 必须获得完成任务所需的用户 / 工程习惯。

以及：

> Worker 不需要、也不应该因此获得完整 Soul。
