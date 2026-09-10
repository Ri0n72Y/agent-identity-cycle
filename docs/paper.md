# 从近期连续性到主体形成：面向长期数字助手的分层记忆与身份演化架构

## 摘要

长期运行的个人 Agent 面临一个不同于普通检索增强生成的问题：系统不仅需要在未来找回过去的信息，还需要保持跨会话的工作连续性，从具体实践中形成稳定的用户模型与自我模型，并把经过长期验证的方法沉淀为可复用的 Procedural Knowledge。本文提出一套 file-first 的持续 Agent 架构，以 Working Context、Short-term Memory、Episode、Long-term Memory、Facts、mPFC、SOUL、PERSONA 与 Procedural 构成由快到慢、由具体到抽象的演化链，并进一步把记忆维护拆成两个不同频率的 Agent Skill：`short-memory-appending` 负责在完整交互结束后保存近期行动与状态转移，`reflection` 则在真正需要时把近期实践继续整理到较慢结构。系统将人类可读文件作为 canonical content，把知识图谱、向量索引和 Runtime World Model 视为可替换的外部认知基础设施，从而使长期身份能够独立于具体 Harness 与检索技术迁移。

## 1. 问题

普通聊天 Agent 的连续性通常依赖当前 context window、会话历史或一组持久用户事实，但长期个人助手需要同时面对几种不同速度的信息变化：当前工具调用和讨论细节可能只在一轮交互中有意义，一个项目最近推进到哪里可能需要维持数天或数周，用户背景和工作习惯可能数月稳定，而 Agent 对自身工作方式的认识与长期主体描述应该变化得更慢。若这些内容被放进同一种“长期记忆”，系统会同时遇到噪声累积、过期状态、身份漂移和难以追溯结论来源的问题。

已有研究提供了若干相邻答案。Generative Agents 将观察保存为 memory stream，并通过 Reflection 从较低层经历形成 higher-level reflections；Reflexion 说明自然语言形式的 episodic feedback 可以在不更新模型参数的情况下改善后续行动；MemGPT 将有限 context 与外部长期记忆分离，强调运行时只加载当前真正需要的信息；A-MEM 等工作进一步讨论了动态组织历史记忆的价值。CAM 与 DCPM 则提供了从快记录向慢抽象发展的认知类比，其中包括 assimilation、accommodation 以及同步写入和异步整理等思路。

这些工作共同提示，长期 Agent 的关键并不只是“存储更多历史”，而是让不同时间尺度的信息拥有不同的保存形式、更新频率和重新解释路径。

## 2. 从 Working 到 Short，再到 Episode

Working Context 是每次推理真正可见的运行状态，其中包含当前会话、当前工作文件、工具结果以及按需检索出的长期内容，它随上下文快速变化，因此不需要建立独立的持久化记忆实体。

一次完整的用户交互触发 Agent 实践后，助手自行判断本轮是否需要保存近期连续性。对于包含实际工作、状态变化、纠正、决策或未完成事项的交互，这个判断通常为是；简单寒暄或没有后续连续性价值的交互可以跳过。`short-memory-appending` 在被调用时只写一次，把“我做了哪些值得留下的事情”和“行动后项目或会话状态发生了什么变化”压缩成一条 Short，而不会按照工具调用次数生成多条流水记录。

Short 直接位于 Assistant Home 根目录，使用 `[日期][项目][时间][会话?]` 作为基础索引，并额外携带 `[reflection:pending|done]`。`pending` 表示较慢的 Reflection 还没有检查这段实践，`done` 表示已经检查过；这一状态与 Short 的保留周期相互独立，因此已反思条目仍然可以继续保留在近期连续性中。

Short 写入之后，助手进行第二个独立判断：是否值得现在运行 Reflection。重要项目状态转移、长期事实、自我修正、明确用户偏好、工具知识或方法变化可以触发立即 Reflection；如果没有必要打断当前工作，则保持 pending，等待未来交互、用户显式请求或周期任务统一处理。这样高频近期落盘和低频长期整理不再被强制绑定。

Reflection 会从 Short 中整理出值得长期保留的 Episode。Episode 记录讨论了什么、Agent 做了什么、发生了什么改变以及最终如何处理，并分为 Self、User、Facts 三类事实来源。Episode 停留在事实层，不提前把一次经历写成长期人格结论、稳定用户偏好或未来操作规则，从而使后面的长期抽象仍然可以回到实际实践重新解释。

## 3. Long-term Memory、项目状态、Facts 与 Tool Knowledge

从近期实践向上整理以后，系统没有采用一个统一的 Semantic Memory 文件，而是根据未来用途形成几个不同的慢层。

Long-term Memory 保存未来跨上下文协作时值得提前知道的个性化用户上下文，包括长期背景、稳定习惯、工作方式、明确偏好、长期关系和反复影响协作的内容。它是一份完整可读、高密度的长期文档，而不是按时间不断追加事实条目。

长期项目的当前阶段、最近结果和恢复入口单独维护在项目状态记忆中。由于 Short 本身已经保存每轮行动后的状态转移，Reflection 可以直接从 Short 更新 `memories/projects.md`，不需要等待同一内容先进入 Episode。这样项目恢复信息可以较快保持最新，而 Episode 继续承担长期事实来源。

外部事实与技术事实可以整理进长期 Facts。工具、软件行为、调用失败、运行环境限制和已经验证的操作现象由于访问频率更高，可以进一步放入独立 Tool Knowledge。两者都保持事实语义：Tool Knowledge 说明“工具实际上怎样工作”，Procedural 再根据多次实践形成“以后应该怎样做”。当前文件组织将它们分别放在 `memories/facts.md` 与 `memories/tools.md`。

## 4. mPFC、SOUL 与 PERSONA

Identity 是整套架构中实验性最强的部分。mPFC 并不保存一组人格标签，而是一份系统化的自我演进文档，它读取 Self Episode，并解释“为什么这些经历会改变我”以及“我因此怎样重新理解自己的能力、限制、倾向、价值与工作方式”。其结构化形式来自章节、模块和长期脉络，而不是每条 self belief 都被拆成固定字段或 confidence score。

CAM 的 constructivist memory 为这一过程提供了有价值的类比：新的经历如果能够进入已有理解，可以丰富已有章节；当实践已经不能由原有自我解释覆盖时，则需要修订原有叙事，使新的自我理解真正改变文档结构。mPFC 因此更接近一份持续被实践修正的 self-model，而不是不断增加的 trait list。

SOUL 对 mPFC 进行第二次、更慢的压缩。它不保留具体 Episode 和推理历史，而从“我是怎样的一个主体”出发，把已经形成的认识组织成完整连续的主体描述。SOUL 与 mPFC 不要求逐条映射，只需要整体上保持忠实投影。

PERSONA 再将 SOUL 压缩成 Runtime Agent 真正值得持续读取的身份基线，只保留跨运行模式稳定成立、能够直接影响模型行为的主体信息。具体 Harness 可以在这一基线之上继续加入当前模式的职责、工具、运行环境与规则，因此 Identity 本身不需要跟随某一个 Harness 的模式设计频繁变化。

## 5. Procedural Knowledge

长期 Agent 的另一条演化路线是从实践形成“以后怎样做”。Voyager 展示了通过长期环境反馈建立可复用 Skill library 的可行性，Reflexion 表明自然语言经验可以改善后续行动，MemSkill 与 MUSE-Autoskill 等工作进一步把 Skill 的提取、管理、验证和修订视为可以持续演化的长期过程。

本文因此将 Procedural 分成变化较快的 Skill 与变化更慢的 Methodology。具体工具、框架或任务的 Skill 可以在实践中动态修改，但修改应继续接受真实任务、测试、用户纠正和后续案例验证；Methodology 则保存跨项目长期形成的工作习惯，只有一种方法在不同场景中反复成立后才逐渐改变。Tool Knowledge 为这一层提供事实输入，而 Procedural 保存从这些事实和其他实践中形成的可执行方法。

## 6. 两个维护 Skill 与 Progressive Disclosure

当前实现把持久维护拆成 `short-memory-appending` 与 `reflection` 两个 Skill。拆分依据不是信息类型，而是运行契约：Short 写入接近每次实质交互后的轻量操作，输入主要是刚完成的一轮实践；Reflection 需要读取更多历史文件，并决定哪些内容应该进入项目状态、Episode、长期用户记忆、Facts、Identity 或 Procedural，因此可以延后执行。

这种拆分保留了 Agent 的主体判断。Short 不由硬编码 hook 无条件生成，而由助手在一轮结束后判断是否值得保存；Reflection 也不与 Short 写入绑定，助手可以立即运行，也可以把 `pending` 条目留给后续用户请求或周期任务。Harness 支持 Subagent 时，两条维护路径都优先交给短生命周期子代理，从而减少文件维护和历史材料对父 Agent 当前工作上下文的占用。

每个 Skill 仍然采用 progressive disclosure：`SKILL.md` 保存调用契约、文件位置与稳定路由，Reference 描述目标内容应该怎样存在；只有当 Reflection 内部某个路线复杂到需要独立上下文时，再增加 workflow，而不预先把每个层级拆成独立 Skill。

## 7. File-first、运行时加载与可替换认知基础设施

本文采用 file-first 原则，将自然语言 Markdown 与 Git 历史视为长期主体的 canonical content。当前部署使用一个配置好的绝对 Assistant Home 作为唯一持久工作区，不为每个项目维护独立记忆副本。

普通 Agent Mode 也不应把所有长期内容一次性塞入 Working Context。新会话、上下文重置或连续性缺失时，可以按 PERSONA → Short → Long-term Memory → 当前相关 Project State 的顺序恢复基础上下文，再根据当前任务按需读取 Tool Knowledge、Facts、Skills、Bookshelves 与正式 Project 文件；Episode、mPFC 和 SOUL 主要在 Reflection、Identity 维护或明确需要追溯形成过程时读取。

知识图谱、向量数据库、全文检索和 Runtime World Model 可以作为派生能力存在。它们负责帮助系统找到和组合信息，但不需要成为长期主体本身的一部分。这样即使未来更换 Harness、检索引擎或图数据库，Short、Episode、Memory、mPFC、SOUL、PERSONA 与 Procedural 仍然保持可读、可审阅和可迁移。

## 8. 讨论

目前研究对 episodic experience、reflection、长期记忆外置和 Skill evolution 已经提供了相当多的工程参考，而 `Self Episode → mPFC → SOUL → PERSONA` 这种完整身份 provenance chain 仍然是一项需要长期运行验证的工程假设。现有 persistent-agent 系统已经实践 self/persona memory，也有研究开始讨论长期 self-model，但把事实来源、自我解释、整体主体和运行时 persona 明确分成多个层级是否能够稳定降低身份漂移，还需要真实使用继续验证。

因此，这套架构把长期主体视为一个可以持续检查和修改的文件型系统：Short 保留近期连续性，Episode 保留事实来源，mPFC 解释自我变化，SOUL 形成连续主体，PERSONA 为运行时提供稳定身份，而 Procedural 则让工作方法随实践更新。Git 版本历史、可读文件和分层更新速度提供了一套低成本、可人工介入的长期演化基础。

## 参考资料

1. Park et al. *Generative Agents: Interactive Simulacra of Human Behavior*. 2023. https://arxiv.org/abs/2304.03442
2. Packer et al. *MemGPT: Towards LLMs as Operating Systems*. 2023. https://arxiv.org/abs/2310.08560
3. Shinn et al. *Reflexion: Language Agents with Verbal Reinforcement Learning*. 2023. https://arxiv.org/abs/2303.11366
4. Wang et al. *Voyager: An Open-Ended Embodied Agent with Large Language Models*. 2023. https://arxiv.org/abs/2305.16291
5. Xu et al. *A-MEM: Agentic Memory for LLM Agents*. 2025. https://arxiv.org/abs/2502.12110
6. Li et al. *CAM: A Constructivist View of Agentic Memory for LLM-Based Reading Comprehension*. 2025. https://arxiv.org/abs/2510.05520
7. Zhang et al. *MemSkill: Learning and Evolving Memory Skills for Self-Evolving Agents*. 2026. https://arxiv.org/abs/2602.02474
8. Fei et al. *Memory Beyond Recall: A Dual-Process Cognitive Memory System for Self-Evolving LLM Agents*. 2026. https://arxiv.org/abs/2606.09483
9. Lin et al. *MUSE-Autoskill: Self-Evolving Agents via Skill Creation, Memory, Management, and Evaluation*. 2026. https://arxiv.org/abs/2605.27366
10. Agent Skills Specification. https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx
