# 标准记忆格式

Short-term Memory 与 Episode 都保存带有明确时间和工作上下文的实践记录，因此共享同一套最小索引格式。格式只负责让一段记忆能够被快速定位，正文内容仍由 Short 与 Episode 各自的整理原则决定。

基础格式：

```text
[日期][项目][时间][会话?]
```

日期使用 `YYYY-MM-DD`，时间使用配置中的本地时间 `HH:mm`；项目填写当前项目、工作区或能够稳定指向该工作上下文的简短标识。只有在同一项目存在多个并行会话，或者具体会话本身对恢复上下文有价值时才增加第四段会话索引，否则直接省略。

例如：

```markdown
[2026-01-15][project-alpha][20:20]

本轮完成了核心接口审查并根据验证结果调整实现顺序，当前工作已经从接口确认阶段进入实现阶段。
```

需要区分具体会话时：

```markdown
[2026-01-15][project-alpha][20:20][architecture-review]

围绕当前架构完成一轮审查，确认已有组件可以复用，并把下一轮工作的入口收敛到剩余的数据流问题。
```

Short 在基础格式后额外增加 Reflection 状态：

```text
[日期][项目][时间][会话?][reflection:pending|done]
```

没有会话索引时直接写：

```text
[2026-01-15][project-alpha][20:20][reflection:pending]
```

存在会话索引时写：

```text
[2026-01-15][project-alpha][20:20][architecture-review][reflection:pending]
```

`pending` 表示这条 Short 尚未被较慢的 Reflection 流程检查，`done` 表示已经被检查过；这一标记不参与 Short 的保留周期判断，已经反思的记录仍可以继续保留在近期连续性中。Episode 使用基础格式，不携带 Reflection 状态。

索引之后空一行，再使用自然语言记录正文。不要为了机器读取继续增加固定字段；标签、检索键、向量、图关系和其他结构可以由外部索引系统派生。当 Short 被归档为 Episode 时，优先保留原 Short 的日期、项目、时间与会话索引，使 Episode 继续指向实际发生实践的时间位置；归档时间不要替代经历发生时间。
