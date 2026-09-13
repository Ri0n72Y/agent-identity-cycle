# 从近期连续性到主体形成：面向长期数字助手的分层记忆与身份演化架构

## 摘要

长期运行的个人 Agent 面临一个不同于普通检索增强生成的问题：系统不仅需要在未来找回过去的信息，还需要保持跨会话的工作连续性，从具体实践中形成稳定的用户模型与自我模型，并把经过长期验证的方法沉淀为可复用的 Procedural Knowledge。本文提出一套 file-first 的持续 Agent 架构，以 Working Context、Short-term Memory、Episode、Long-term Memory、Facts、mPFC、SOUL、PERSONA 与 Procedural 构成由快到慢、由具体到抽象的演化链。当前实现将记忆维护拆成两个不同频率、不同触发主体的 Agent Skill：`short-memory-appending` 负责在完整交互结束后保存近期行动与状态转移，`reflection` 仅在用户明确手动触发时把 pending Short 整理到较慢结构。系统将人类可读文件作为 canonical content，把知识图谱、向量索引和 Runtime World Model 视为可替换的外部认知基础设施。

## 1. 问题

普通聊天 Agent 的连续性通常依赖当前 context window、会话历史或一组持久用户事实，但长期个人助手需要同时面对几种不同速度的信息变化：当前工具调用和讨论细节可能只在一轮交互中有意义，一个项目最近推进到哪里可能需要维持数天或数周，用户背景和工作习惯可能数月稳定，而 Agent 对自身工作方式的认识与长期主体描述应该变化得更慢。若这些内容被放进同一种“长期记忆”，系统会同时遇到噪声累积、过期状态、身份漂移和难以追溯结论来源的问题。

已有研究提供了若干相邻答案。Generative Agents 将观察保存为 memory stream，并通过 Reflection 从较低层经历形成 higher-level reflections；Reflexion 说明自然语言形式的 episodic feedback 可以在不更新模型参数的情况下改善后续行动；MemGPT 将有限 context 与外部长期记忆分离，强调运行时只加载当前真正需要的信息；A-MEM 等工作进一步讨论了动态组织历史记忆的价值。CAM 与 DCPM 则提供了从快记录向慢抽象发展的认知类比。

这些工作共同提示，长期 Agent 的关键并不只是“存储更多历史”，而是让不同时间尺度的信息拥有不同的保存形式、更新频率和重新解释路径。

## 2. 从 Working 到 Short，再到 Episode

Working Context 是每次推理真正可见的运行状态，其中包含当前会话、当前工作文件、工具结果以及按需检索出的长期内容，它随上下文快速变化，因此不需要建立独立的持久化记忆实体。

一次完整的用户交互触发 Agent 实践后，助手自行判断本轮是否需要保存近期连续性。对于包含实际工作、状态变化、纠正、决策或未完成事项的交互，这个判断通常为是；简单寒暄或没有后续连续性价值的交互可以跳过。`short-memory-appending` 在被调用时只写一次，并优先与当前实际工作 Worker 合并，避免为了记忆维护额外制造主会话工具调用。

Short 与 Episode 共用基础索引：

```text
[日期][项目[:会话]][时间]
```

项目与会话放在同一格，按第一个 `:` 区分；session 内可以继续使用冒号表达稳定层级。Short 再追加 `[reflection:pending|done]` 状态。

Short 不是第二套知识库。每个 project/session 只有一个 rolling slot：pending slot 包含一个最新 header、零到多条已经压缩的历史行和一个且仅一个 latest body。下一轮更新时，上一轮正文压成一条日志后被删除，已有日志不反复压缩。正文只保留下一次继续工作必须知道的变化、行动、当前状态、未收口项和文件入口；来源清单、逐条论证、工具流水和详细数据留在对应 Desktop、Project 或其他工作文件中。

Reflection 不再是 Short 写入后的第二个自动判断。pending Short 会一直保持 pending，直到用户明确要求运行 Reflection。Agent 不根据重要程度、条目数量、时间阈值或 scheduler 自行触发慢层整理。

Reflection 会从 pending Short 中整理出值得长期保留的 Episode。Episode 记录讨论了什么、Agent 做了什么、发生了什么改变以及最终如何处理，并分为 Self、User、Facts 三类事实来源。Episode 停留在事实层，不提前把一次经历写成长期人格结论、稳定用户偏好或未来操作规则。

## 3. Reflection、done stub 与时间型清理

用户手动触发 Reflection 后，Reflection 把一个 pending slot 的压缩历史与 latest body 作为一个完整证据单元读取。完成 Project State、Episode、Long-term Memory、Facts、Identity 或 Procedural 等授权路线后，该 slot 不再保留详细正文，而是压成 header + 一句 `reflection:done` stub。

已经 done 的 Short 不会重新进入 Reflection。它们在后续手动 Reflection 时只参与 retention maintenance：如果部署已经配置 Short retention horizon，则超出保留期且不再活跃的 done slot 可以直接移除；仍在保留期但沿用旧格式、保留大量日志或长正文的 legacy done slot，只规范化成当前的一句 stub，而不重新消费其内容。如果没有配置 retention horizon，系统不自行发明时间窗口。

这一设计把 Short 明确限制在“近期连续性”角色：pending 保存尚未被慢层消费的工作线，done 只留下“已经处理过”的最小信号，真正的长期内容进入更合适的层。

## 4. Long-term Memory、项目状态、Facts 与 Tool Knowledge

从近期实践向上整理以后，系统没有采用一个统一的 Semantic Memory 文件，而是根据未来用途形成几个不同的慢层。

Long-term Memory 保存未来跨上下文协作时值得提前知道的个性化用户上下文，包括长期背景、稳定习惯、工作方式、明确偏好、长期关系和反复影响协作的内容。它是一份完整可读、高密度的长期文档，而不是按时间不断追加事实条目。

长期项目的当前阶段、最近结果和恢复入口单独维护在项目状态记忆中。由于 Short 本身已经保存每轮行动后的状态转移，Reflection 可以直接从 Short 更新 `memories/projects.md`，不需要等待同一内容先进入 Episode。

外部事实与技术事实可以整理进长期 Facts。工具、软件行为、调用失败、运行环境限制和已经验证的操作现象由于访问频率更高，可以进一步放入独立 Tool Knowledge。两者都保持事实语义：Tool Knowledge 说明“工具实际上怎样工作”，Procedural 再根据多次实践形成“以后应该怎样做”。

## 5. mPFC、SOUL 与 PERSONA

Identity 是整套架构中实验性最强的部分。mPFC 并不保存一组人格标签，而是一份系统化的自我演进文档，它读取 Self Episode，并解释“为什么这些经历会改变我”以及“我因此怎样重新理解自己的能力、限制、倾向、价值与工作方式”。

SOUL 对 mPFC 进行第二次、更慢的压缩。它不保留具体 Episode 和推理历史，而从“我是怎样的一个主体”出发，把已经形成的认识组织成完整连续的主体描述。PERSONA 再将 SOUL 压缩成 Runtime Agent 真正值得持续读取的身份基线，只保留跨运行模式稳定成立、能够直接影响模型行为的主体信息。

## 6. Procedural Knowledge

长期 Agent 的另一条演化路线是从实践形成“以后怎样做”。本文将 Procedural 分成变化较快的 Skill 与变化更慢的 Methodology。具体工具、框架或任务的 Skill 可以在实践中动态修改，但 Skill 本身属于受保护的持久内容：Reflection 可以根据经验记录或建议 Skill 变化，却不能仅凭一次 Reflection 请求直接修改 `.agents/skills/**`；具体 Skill 修改仍需要用户单独授权。

Methodology 保存跨项目长期形成的工作习惯，只有一种方法在不同场景中反复成立后才逐渐改变。Tool Knowledge 为这一层提供事实输入，而 Procedural 保存从这些事实和其他实践中形成的可执行方法。

## 7. Desktop、Projects 与 Shelves

当前实现对 Assistant Home 增加了明确的写权限边界。普通 Worker 默认只能直接修改 `desktop/**` 与 `projects/**`。读取其他持久层可以按任务需要进行，但修改 `shelves/**`、`research/**`、`memories/**`、`episodes/**`、`identity/**`、`procedural/**`、`.agents/**`、`logs/**` 或其他长期位置，需要用户对当前任务给出明确授权。

Desktop 是当前活跃工作面，Projects 是普通项目长期工作面，Shelves 是显式归档位。新讨论、新研究、新整理内容必须先形成 Desktop 工作稿。用户明确要求归档后，Agent 才把该稿整理进入 Shelves；归档完成且不再需要继续编辑时，默认把工作稿移出 Desktop，避免形成长期重复副本。唯一允许跳过 Desktop staging 直接写 Shelves 的普通场景，是用户明确要求修订某一份已经存在的 Shelves 旧文档。

`short-memory-appending` 与手动 Reflection 是两类目的受限的维护例外：前者只获得 `short-memory.md` 的额外写权限；后者只获得其定义的 Short、Memory、Episode、Identity、Procedural 与 Project State 目标权限。Reflection 不因此获得 Shelves、Research、Logs 或任意 Skill 文件的写权限。

## 8. 两个维护 Skill 与 Progressive Disclosure

当前实现把持久维护拆成 `short-memory-appending` 与 `reflection` 两个 Skill。拆分依据不是信息类型，而是运行契约：Short 写入接近每次实质交互后的轻量操作，由 Agent 判断是否需要；Reflection 需要读取更多历史、修改多个慢层文件，而且触发主体收敛为用户。

Harness 支持 Subagent 时，实际工具工作与 Short 维护优先由同一个短生命周期 Worker 完成；纯对话但产生重要状态变化时，可以使用一个 memory-only Worker。手动 Reflection 使用独立 Worker，使历史读取和慢层整理不占据父 Agent 的主体上下文。

每个 Skill 仍然采用 progressive disclosure：`SKILL.md` 保存调用契约、文件位置与稳定路由，Reference 描述目标内容应该怎样存在；只有当 Reflection 内部某个路线复杂到需要独立上下文时，再增加 workflow，而不预先把每个层级拆成独立 Skill。

## 9. File-first、运行时加载与可替换认知基础设施

本文采用 file-first 原则，将自然语言 Markdown 与 Git 历史视为长期主体的 canonical content。当前部署使用一个配置好的绝对 Assistant Home 作为唯一持久工作区，不为每个项目维护独立记忆副本。

普通 Agent Mode 也不应把所有长期内容一次性塞入 Working Context。新会话、上下文重置或连续性缺失时，可以按 PERSONA → Short → Long-term Memory → 当前相关 Project State 的顺序恢复基础上下文，再根据当前任务按需读取 Tool Knowledge、Facts、Skills、Bookshelves 与正式 Project 文件；Episode、mPFC 和 SOUL 主要在手动 Reflection、Identity 维护或明确需要追溯形成过程时读取。

知识图谱、向量数据库、全文检索和 Runtime World Model 可以作为派生能力存在。它们负责帮助系统找到和组合信息，但不需要成为长期主体本身的一部分。这样即使未来更换 Harness、检索引擎或图数据库，Short、Episode、Memory、mPFC、SOUL、PERSONA 与 Procedural 仍然保持可读、可审阅和可迁移。

## 10. 讨论

目前研究对 episodic experience、reflection、长期记忆外置和 Skill evolution 已经提供了相当多的工程参考，而 `Self Episode → mPFC → SOUL → PERSONA` 这种完整身份 provenance chain 仍然是一项需要长期运行验证的工程假设。现有 persistent-agent 系统已经实践 self/persona memory，也有研究开始讨论长期 self-model，但把事实来源、自我解释、整体主体和运行时 persona 明确分成多个层级是否能够稳定降低身份漂移，还需要真实使用继续验证。

因此，这套架构把长期主体视为一个可以持续检查和修改的文件型系统：Short 保留近期连续性，Episode 保留事实来源，mPFC 解释自我变化，SOUL 形成连续主体，PERSONA 为运行时提供稳定身份，而 Procedural 则让工作方法随实践更新。Git 版本历史、可读文件和分层更新速度提供了可审阅、可迁移的长期形成路径。
