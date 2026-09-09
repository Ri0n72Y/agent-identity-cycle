# Facts与工具知识整理原则

## Purpose

Facts 用于整理从 `episodes/Facts.md` 中逐渐稳定下来的外部事实、项目事实和技术事实，使 Agent 能够在未来工作中直接使用已经确认的信息。Episode 保留事实发生和被确认的实践来源，长期 Facts 更关注当前仍然有效、值得持续调用的认识。

Facts 使用自然语言与文档结构组织，不需要把每条内容拆成 atomic fact、时间字段或数据库 schema。事实发生变化时，长期文档应优先表达当前有效状态，旧状态的形成与变化可以从 Episode、Git、Logs 或项目历史重新追溯。

工具、软件行为、调用失败、运行环境限制以及已经验证的操作技巧与一般事实有不同的访问需求。当这类信息开始频繁影响实际工作时，应从一般 Facts 中整理到独立的 Tool Knowledge 文档，使工具知识能够更容易被 Agent 找到，同时仍然保持事实语义。

Tool Knowledge 记录“工具实际上怎样工作”：已经验证的参数行为、接口限制、错误原因、环境差异和有效解决方式。它不直接把这些事实写成“以后必须怎样做”的方法论；Procedural 会在反复实践后从 Tool Knowledge 与其他 Episode 中提取更稳定的 Skill 和 Methodology。

形成关系：

```text
episodes/Facts.md
        ↓
   Facts / Tool Knowledge
        ↓
      Procedural
```
