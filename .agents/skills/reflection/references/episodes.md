# Episode整理原则

## Purpose

Episode 保存已经发生、并且未来仍可能影响更高层记忆、身份或方法形成的具体实践经历。它主要从 Short-term Memory 在周期性 Reflection 中归档而来，保留讨论了什么、Agent 做了什么、发生了什么改变以及最终如何处理，使后续长期结论可以重新追溯到事实来源。

形成关系：

Short-term Memory → Reflection → Episode → Long-term Memory / Facts / Identity / Bookshelves / Procedural

Episode 与 Short 使用同一套索引格式，见 [memory-format.md](memory-format.md)。Short 更关注最近行动与当前状态，Episode 则把其中具有长期意义的内容整理成能够被未来重新解释的事实链。

## Episode 的分类

Episode 只有三个文件：

```text
episodes/
├── Self.md
├── User.md
└── Facts.md
```

### Self.md

Self.md 保存所有与 Agent 自身形成有关的事实。如果删除这段经历会影响 Agent 理解自己为什么形成当前的工作方式、能力认识、限制或价值倾向，则应当保留在 Self。

例如：

```markdown
[2026-01-15][project-alpha][20:20]<review>

在连续几轮设计审查中，Agent 发现自己曾在证据不足时过早补全架构解释；经过实际文件检查和后续修订，最终把“先确认已有事实，再决定是否形成新抽象”作为后续自我反思需要持续观察的问题。
```

### User.md

User.md 保存与用户个人相关、但主要用于理解用户是谁、如何工作、过去做过什么以及有哪些稳定偏好的事实。

例如：

```markdown
[2026-01-15][project-alpha][20:20]

用户在讨论文档组织方式时持续偏好自然语言和完整上下文，并要求只有在真实运行价值出现后才新增结构或目录；本轮最终按这一原则收缩了原有文档结构。
```

### Facts.md

Facts.md 保存既不属于 Agent 自我形成，也不主要描述用户个人的外部事实、项目事实和技术事实。

例如：

```markdown
[2026-01-15][project-alpha][20:20]<tool-debug>

某工具在缺少必需参数时返回参数校验错误；补充该参数后调用恢复正常，因此后续使用该接口时需要提供完整的目标标识。
```

## 写作原则

Episode 使用自然语言和完整事实链。一次记录可以包含讨论、行动、工具结果、变化和最终处理，只要这些内容共同描述同一段实践；不需要把每个动作拆成字段或单独条目。归档时可以从一条 Short 中拆出多个方向，例如同一轮实践同时包含自我修正、用户稳定偏好和工具事实时，可以分别整理进 Self、User 与 Facts，同时保留它们各自能够独立理解的上下文。
