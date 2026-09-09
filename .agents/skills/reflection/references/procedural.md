# Procedural整理原则

## Purpose

Procedural 保存 Agent 在长期实践中形成的“以后怎样做”，包括变化较快的 Skill 与变化更慢的 Methodology。它来自真实任务、工具结果、错误修正、用户反馈和反复验证后的工作经验，并随着后续实践继续修订。

形成关系：

```text
Experience
→ Short-term Memory
→ Episode / Tool Knowledge
→ Skill
→ Methodology
```

## Skill

Skill 描述某类具体任务、工具或工作流程当前应怎样执行。实践发现新的有效方式、旧规则失效或真实结果暴露问题时，可以直接修订对应 Skill；修改应能够指出来自哪些实际结果，并在后续任务、测试或案例中继续验证。

Skill 的目标是可执行和可复用，因此可以使用步骤、检查项、脚本、Reference 或其他对运行真正有帮助的结构，但复杂度随真实需要增长，不预先建立没有运行价值的目录和字段。

## Methodology

Methodology 保存跨工具、跨任务逐渐稳定下来的工作习惯与方法。它比具体 Skill 更慢，只有一种做法在不同场景中反复有效，并已经能够脱离单一工具或项目成立时，才值得进入 Methodology。

例如，某工具的已验证参数行为属于 Tool Knowledge；围绕该工具形成的可靠调用流程可以进入 Skill；如果进一步发现“修改成熟系统前先检查已有扩展机制”在多个技术环境中长期有效，这种跨任务习惯才逐渐形成 Methodology。

## 写作原则

Procedural 允许比 Memory 和 Episode 更明显的执行结构，因为它直接服务未来行动，但每项规则仍应来自实践而不是为了完整性预先设计。Skill 与 Methodology 都通过 Git 保留变化历史，使后续 Agent 可以看到方法如何被真实工作修正。
