# Desktop整理原则

## Purpose

Desktop 保存 Agent 与用户当前正在进行的工作，是围绕任务、文件和上下文形成的共同工作空间。它让一次对话产生的草稿、分析、计划和临时产物能够在后续会话中继续推进，直到形成稳定成果并进入更长期的位置。

形成关系：

Experience → Desktop → Project / Bookshelves / Memory / Logs

## Desktop 的内容

Desktop 的基本单位是文件。每个文件代表当前活跃上下文中的一项人机合作产物，通常仍处于草稿、讨论或临时整理状态；Agent 也可以在 Desktop 中留下为当前工作服务的临时文件。内容完成以后，根据实际用途进入对应 Project、Bookshelves、Memory 或 Logs。

Desktop 有一个稳定的 `todo.md`，用于快速记录接下来需要处理的事情，可以指向某个项目、工作区、Desktop 文件或临时任务，而不要求所有待办本身都成为 Desktop 文档。

例如：

```markdown
当前正在整理一份尚未完成的设计说明，已经确认主要目标和已有实现，剩余工作是把两个未决的数据流问题讨论清楚。完成后将正式说明移动到对应 Project，目前继续保留在 Desktop 便于共同修改。
```

Desktop 内容优先使用自然语言和完整上下文。索引、关系和其他结构化信息可以由工具层生成，不要求人在创作过程中维护大量机器字段。

## 生命周期

```text
新问题出现
↓
进入 Desktop
↓
人与 Agent 共同讨论和修改
↓
形成稳定成果
↓
Project / Bookshelves / Memory / Logs
```

Desktop 本身用于承载活跃工作，完成后的长期价值由目标位置保存；其中发生的实践仍然通过 Short-term Memory 与 Episode 进入 Reflection 的长期形成链。
