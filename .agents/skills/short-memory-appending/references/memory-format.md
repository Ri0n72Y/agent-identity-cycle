# 标准记忆格式

Short-term Memory 与 Episode 都保存带有明确时间和工作上下文的实践记录，因此共享同一套最小索引格式。格式只负责让一段记忆能够被快速定位，正文内容仍由 Short 与 Episode 各自的整理原则决定。

基础格式：

```text
[日期][项目][时间][会话?]
```

日期使用 `YYYY-MM-DD`，时间使用配置中的本地时间 `HH:mm:ss`；项目填写当前项目、工作区或能够稳定指向该工作上下文的简短标识。只有在同一项目存在多个并行会话，或者具体会话本身对恢复上下文有价值时才增加第四段会话索引，否则直接省略。

例如：

```markdown
[2026-01-15][project-alpha][20:20:35]

用户确认了下一阶段实现目标，Agent 完成了核心接口审查并调整实现顺序，当前工作已经从接口确认阶段进入实现阶段。
```

需要区分具体会话时：

```markdown
[2026-01-15][project-alpha][20:20:35][architecture-review]

用户要求继续收敛当前架构，Agent 完成一轮审查并确认已有组件可以复用，当前会话已经推进到剩余数据流问题的处理阶段。
```

Short 在基础格式后额外增加 Reflection 状态：

```text
[日期][项目][时间][会话?][reflection:pending|done]
```

没有会话索引时：

```text
[2026-01-15][project-alpha][20:20:35][reflection:pending]
```

存在会话索引时：

```text
[2026-01-15][project-alpha][20:20:35][architecture-review][reflection:pending]
```

同一项目/会话的 pending Short 采用 rolling slot 形式。主标题始终使用最新一轮的日期、时间与会话信息；此前尚未 Reflection 的完整主体被压缩为一行日志并保留在最新主体之前：

```markdown
[2026-01-15][project-alpha][21:05:12][architecture-review][reflection:pending]

- [2026-01-15 20:20:35] 用户要求继续收敛架构，Agent 完成组件复用审查，工作推进到剩余数据流问题。

用户进一步要求调整数据流边界，Agent 修改了相关说明并完成一致性检查，当前会话已经推进到运行时验证阶段。
```

日志统一使用 `- [YYYY-MM-DD HH:mm:ss]` 开头，一条旧迭代压缩为一行。已有日志按原有顺序保留，新压缩出的旧主体追加到日志末尾；日志记录尚未被 Reflection 消化的迭代轨迹，不保存完整对话或工具流水。

`pending` 表示当前 rolling slot 中仍有尚未被较慢 Reflection 检查的内容，`done` 表示当前 slot 已经完成检查。Reflection 状态不参与 Short 的保留周期判断。一个 `done` slot 后续发生新实践时会进入新的 pending 周期，已经反思的旧日志不再继续作为 pending 历史携带。

Episode 使用基础格式，不携带 Reflection 状态，也不使用 Short 的 rolling 日志结构。索引之后空一行，再使用自然语言记录正文。不要为了机器读取继续增加固定字段；标签、检索键、向量、图关系和其他结构可以由外部索引系统派生。
