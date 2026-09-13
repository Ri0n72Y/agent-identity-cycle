# Desktop整理原则

## Purpose

Desktop 保存 Agent 与用户当前正在进行的工作，是围绕任务、文件和上下文形成的共同工作空间。它让一次对话产生的草稿、分析、计划和临时产物能够在后续会话中继续推进，直到形成稳定成果并进入更长期的位置。

## Desktop 的内容

Desktop 的基本单位是文件。每个文件代表当前活跃上下文中的一项人机合作产物，通常仍处于草稿、讨论或临时整理状态；Agent 也可以在 Desktop 中留下为当前工作服务的临时文件。内容完成以后，根据实际用途进入对应 Project、Bookshelves、Memory 或 Logs。

Desktop 有一个稳定的 `todo.md`，用于快速记录接下来需要处理的事情，可以指向某个项目、工作区、Desktop 文件或临时任务，而不要求所有待办本身都成为 Desktop 文档。

例如：

```markdown
当前正在整理一份尚未完成的设计说明，已经确认主要目标和已有实现，剩余工作是把两个未决的数据流问题讨论清楚。完成后将正式说明移动到对应 Project，目前继续保留在 Desktop 便于共同修改。
```

Desktop 内容优先使用自然语言和完整上下文。索引、关系和其他结构化信息可以由工具层生成，不要求人在创作过程中维护大量机器字段。

维护 Desktop 时应围绕当前是否仍在工作来判断文件状态：仍需继续讨论、修改或依赖当前上下文的内容继续保留；已经形成稳定成果的文件根据实际用途准备进入更长期的位置。`todo.md` 直接修订当前有效待办，不保留已经失效的长期清单。

## Assistant Home 写入边界

这条规则只约束 `<ASSISTANT_HOME>` 内的持久内容，不限制用户明确交付给 Agent 的外部代码仓库或普通工作目录。

普通工作默认可以直接修改：

- `<ASSISTANT_HOME>/desktop/**`
- `<ASSISTANT_HOME>/projects/**`

读取其他持久目录可以按任务需要进行；但修改 `shelves/**`、`research/**`、`memories/**`、`episodes/**`、`identity/**`、`procedural/**`、`.agents/**`、`logs/**` 或其他持久位置前，必须已有用户对当前任务中的该目录或该具体文档给出明确写入授权。不能把“整理”“研究”“完善”“沉淀”“同步”等泛化任务描述解释成这些目录的修改授权。

没有授权时，优先把新的工作结果放到 Desktop，并保留需要用户确认的归档或长期层修改请求。不要因为内容看起来成熟、相关文件已经存在，或修改似乎只是“顺手同步”就跨过这条边界。

维护流程有两个窄例外：

- `short-memory-appending` 可以按其 Skill 直接维护 `<ASSISTANT_HOME>/short-memory.md`，不得借此修改其他长期文件；
- 用户明确手动触发 `reflection` 时，该请求视为对 Reflection Skill 明确定义的 memory、episode、identity、procedural、project-state 与 Short 目标的授权。它不自动授权 `shelves/**`、`research/**`、`logs/**` 或任意 `.agents/skills/**` 修改；这些仍需额外明确授权。

## 落点纪律：工作先 Desktop，归档才 Shelves

当前正在进行的讨论、研究、草稿、整理与待收敛产物默认先落在 Desktop，不得从对话或临时结果直接写进 `shelves/`。Desktop 是双方共同工作面，文件在这里可以被反复修改、追加与推翻；`shelves/` 是归档位，一旦进入就带有“已稳定、可长期引用”的默认语义。

新 Shelves 内容必须先形成 Desktop 工作稿。之后只有在用户明确要求归档时，才把该 Desktop 结果移动、复制或整理进 Shelves；这两个动作可以在同一个明确的归档任务中连续完成，但不能省略 Desktop staging。

唯一允许跳过 Desktop 直接写 Shelves 的普通任务，是用户明确要求修订某一份已经存在的 Shelves 旧文档。对旧 Shelves 文档进行阅读、引用、比较不等于获得修改权限；如果当前任务只是继续讨论其中的内容，应在 Desktop 建立工作稿或修订稿，待用户确认后再归档。

`projects/**` 与 Shelves 不同：它是项目长期工作面的组成部分，普通项目任务可以直接维护对应 Project 文件。将 Desktop 内容移入 Project 仍应在内容确实属于该项目长期状态时进行，但不需要额外把 Project 当作受保护归档层。

稳定只是归档的前提，不是自动归档的授权。Agent 不应自行决定把 Desktop 内容迁往 Shelves、Research、Logs 或其他受保护持久层；需要时先向用户说明拟修改的目标与原因并取得明确同意。
