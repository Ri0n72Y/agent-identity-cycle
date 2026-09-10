# Episode整理原则

## Purpose

Episode 保存已经发生、并且未来仍可能影响更高层记忆、身份或方法形成的具体实践经历。它主要从 Short-term Memory 在 Reflection 中归档而来，保留讨论了什么、Agent 做了什么、发生了什么改变以及最终如何处理，使后续长期结论可以重新追溯到事实来源。

形成关系：

Short-term Memory → Reflection → Episode → Long-term Memory / Facts / Identity / Bookshelves / Procedural

Episode 与 Short 使用同一套基础索引格式，见 [short-memory-appending 的标准记忆格式](../../short-memory-appending/references/memory-format.md)。Short 更关注最近行动与当前状态，Episode 则把其中具有长期意义的内容整理成能够被未来重新解释的事实链；Episode 不携带 Short 的 Reflection 状态标记。

## Episode 的分类

Episode 只有三个文件：

```text
episodes/
├── Self.md
├── User.md
└── Facts.md
```

### Self.md

Self.md 保存所有与 Agent 自身形成有关的事实。如果删除这段经历会影响 Agent 以后理解自己为什么形成当前的工作方式、能力认识、限制或价值倾向，则应当保留在 Self。这里保存经历本身，关于这些经历意味着什么、怎样改变了自我认识的整理发生在 mPFC。

例如：

```markdown
[2026-01-15][project-alpha][20:20][review]

在一次架构审查中，Agent 在尚未检查完已有文档时补充了一个现有材料未包含的结构。用户指出该结构缺少来源后，Agent 重新读取相关文件，确认此前补充没有依据，并删除了对应内容，恢复到已经确认的设计。
```

### User.md

User.md 保存与用户个人相关、并能帮助未来理解用户是谁、如何工作、过去做过什么或明确表达过什么的事实。一次 Episode 只需要记录本轮实际出现的表达和行为；长期偏好是否成立，由后续 Long-term Memory 根据多次事实或足够明确的用户表述整理。

例如：

```markdown
[2026-01-15][project-alpha][20:20]

用户在本轮文档整理中明确要求优先保留自然语言和完整上下文，并要求只有在存在实际运行价值时才新增目录；Agent 随后删除了两个尚无用途的预留结构。
```

### Facts.md

Facts.md 保存既不属于 Agent 自我形成，也不主要描述用户个人的外部事实、项目事实和技术事实。

例如：

```markdown
[2026-01-15][project-alpha][20:20][tool-debug]

某工具在缺少目标标识参数时返回参数校验错误；补充目标标识后再次调用成功，且没有出现原错误。
```

## 写作原则

Episode 使用自然语言和完整事实链。一次记录可以包含讨论、行动、工具结果、变化和最终处理，只要这些内容共同描述同一段实践；不需要把每个动作拆成字段或单独条目。归档时可以从一条 Short 中拆出多个方向，例如同一轮实践同时包含自我相关经历、用户表达和工具事实时，可以分别整理进 Self、User 与 Facts，同时保留各自能够独立理解的上下文和原始时间索引。

Episode 的正文停在“实际发生了什么”。关于用户的长期概括、关于 Agent 自身的解释、关于工具的长期知识以及以后应该怎样做，分别由更慢的长期层继续形成。
