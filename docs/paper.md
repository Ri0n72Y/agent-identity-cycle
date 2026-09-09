# 从近期连续性到主体形成：面向长期数字助手的分层记忆与身份演化架构

## 摘要

长期运行的个人 Agent 面临一个不同于普通检索增强生成的问题：系统不仅需要在未来找回过去的信息，还需要保持跨会话的工作连续性，从具体实践中形成稳定的用户模型与自我模型，并把经过长期验证的方法沉淀为可复用的 Procedural Knowledge。本文提出一套 file-first 的持续 Agent 架构，以 Working Context、Short-term Memory、Episode、Long-term Memory、Facts、mPFC、SOUL、PERSONA 与 Procedural 构成由快到慢、由具体到抽象的演化链。该设计吸收 Generative Agents、MemGPT/Letta、Reflexion、A-MEM、CAM、DCPM、MemSkill 与长期 Skill Evolution 研究中的工程经验，同时保留一条较为实验性的身份形成路径：`Self Episode → mPFC → SOUL → PERSONA`。系统将人类可读文件作为 canonical content，把知识图谱、向量索引和 Runtime World Model 视为可替换的外部认知基础设施，从而使长期身份能够独立于具体 Harness 与检索技术迁移。

## 1. 问题

普通聊天 Agent 的连续性通常依赖当前 context window、会话历史或一组持久用户事实，但长期个人助手需要同时面对几种不同速度的信息变化：当前工具调用和讨论细节可能只在一轮交互中有意义，一个项目最近推进到哪里可能需要维持数天或数周，用户背景和工作习惯可能数月稳定，而 Agent 对自身工作方式的认识与长期主体描述应该变化得更慢。若这些内容被放进同一种“长期记忆”，系统会同时遇到噪声累积、过期状态、身份漂移和难以追溯结论来源的问题。

已有研究提供了若干相邻答案。Generative Agents 将观察保存为 memory stream，并通过 Reflection 从较低层经历形成 higher-level reflections；Reflexion 证明自然语言形式的 episodic feedback 可以在不更新模型参数的情况下改善后续行动；MemGPT 将有限 context 与外部长期记忆分离，强调运行时只加载当前真正需要的信息；A-MEM 进一步证明动态连接和组织历史记忆比简单向量检索具有价值。近年的 CAM 与 DCPM 又把长期记忆描述为一种从快记录向慢抽象发展的认知过程，前者借用 Piaget 建构主义中的 assimilation 与 accommodation，后者使用 dual-process 架构将同步写入和异步抽象分离。

这些工作共同说明，长期 Agent 的关键不只是“存储更多历史”，而是决定一段实践在不同时间尺度上应该形成什么内容，以及已有长期结构怎样在新实践到来后被修订。

## 2. 从 Working 到 Episode

Working Context 是每次推理真正可见的运行状态，其中包含当前会话、当前工作文件、工具结果以及按需检索出的长期内容，它随上下文快速变化，因此不需要建立独立的持久化记忆实体。一次完整的用户交互触发 Agent 实践后，系统写入一条 Short-term Memory，使用一到两段高度凝练的自然语言记录“我做了哪些值得留下的事情”以及“这些行动之后项目或会话状态发生了什么变化”。Short-term Memory 按项目和会话保持近期连续性，只保存固定周期内仍然活跃的状态，周期外不活跃内容在后续整理中被移除。

这一设计与逐工具调用写记忆的策略不同。工具调用是 Working Context 中的实践细节，Short-term Memory 在一轮实践结束后才进行一次压缩，因此其本身已经是高密度 continuity cache。进一步增加写入过滤器会重复这一压缩职责，并增加额外判断与工程复杂度。

周期性 Reflection 会从 Short-term Memory 中提取值得长期保留的实践，整理成 Episode。Episode 记录讨论了什么、Agent 做了什么、发生了什么改变以及最终如何处理，并被分成 Self、User、Facts 三类事实来源。Self 保存与 Agent 自身形成有关的经历，User 保存用户身份、习惯与经历，Facts 保存其余外部与项目事实。Episode 保留足够具体的实践上下文，使后来的更高层结论能够重新回到事实来源进行解释，而不需要把已经形成的自我认识反向写回历史经历。

## 3. Long-term Memory、Facts 与项目状态

从 Episode 向上抽象以后，系统没有采用单一 Semantic Memory，而是根据长期使用目的分为不同文件。Long-term Memory 保存用户身份、背景、长期习惯、工作方式、关系与经常需要直接调用的协作上下文，并逐渐从详细档案收敛成一份高密度但完整可读的个性化 index。它保持标题、自然段、少量列表和链接等轻量结构，使模型可以一次读取较完整的用户背景，同时避免逐条事实不断 append 造成碎片化。

长期项目的具体状态和最近进度由独立的项目状态记忆维护。Long-term Memory 只需要知道长期项目存在、其意义以及状态入口位于哪里；频繁变化的阶段、最近结果和当前阻塞集中在 project-state memory 中，因此项目推进不会反复扰动用户长期档案。

Facts 保存与用户模型和 Agent 自我形成无直接关系的外部事实。DCPM 提出的 atomic facts、belief revision 和 supersession 对事实更新具有参考价值，但本文不把这些概念直接转化成数据库 schema；文件可以直接表达当前有效事实，历史变化由 Episode 与 Git 保存。工具、软件行为、调用失败和已经验证的操作技巧未来可以从 Facts 中进一步形成高可达的 Tool Knowledge，因为这些知识比一般文史事实更直接影响实际 Agent 工作。

## 4. mPFC、SOUL 与 PERSONA

Identity 是本文中最具实验性的部分。mPFC 并不保存一组人格标签，而是一份系统化的自我演进文档，它读取 Self Episode，并解释“为什么这些经历会改变我”以及“我因此怎样重新理解自己的能力、限制、倾向、价值与工作方式”。其结构化形式来自文档章节和长期脉络，而不是每条 self belief 都被拆成固定字段或 confidence score。

CAM 的 constructivist memory 为这一过程提供了有价值的类比：新经验如果能够进入已有理解，可以被 assimilation 到现有章节；当实践已经不能由原有自我解释覆盖时，mPFC 需要 accommodation，即修订原有叙事，使新的自我理解真正改变文档结构。这样 mPFC 不会演化成无穷增加的 trait list，而是保持为一份持续被现实修正的 self-model。

SOUL 对 mPFC 进行第二次、更慢的压缩。它不保留具体 Episode 和推理历史，而从“我是怎样的一个主体”出发，把 mPFC 已经形成的认识组织成完整连续的主体描述。SOUL 与 mPFC 不要求逐条映射，只需要整体上保持忠实投影，因此它可以比 mPFC 稳定得多，并通过 Git 和人工审阅限制长期身份漂移。

PERSONA 再将 SOUL 压缩成 Runtime Agent 真正值得持续读取的身份基线，只保留跨运行模式稳定成立、能够直接影响模型行为的主体信息。具体 Harness 可以在这一基线之上继续加入 coding、creator、minimal 等模式职责、工具说明、动态工作目录和模式规则。以 DeepSeek Harness 为例，官方 Standard preset 将 persona、plan mode、skills、compaction 与 delegation 分别作为 composition row 组装，因此 Identity/PERSONA 可以作为 harness-neutral identity fragment，而 DSH preset 只负责将该 fragment 与当前模式组合。

## 5. Procedural Knowledge

长期 Agent 的另一条演化路线是从实践形成“以后怎样做”。Voyager 展示了通过长期环境反馈建立可复用 Skill library 的可行性，Reflexion 表明自然语言经验能够直接改善后续行动，2026 年的 MemSkill 又进一步把“如何提取和整理记忆”本身定义成能够从 hard cases 中演化的 memory skill，而 MUSE-Autoskill 则把 Skill 视为拥有 creation、memory、management、evaluation 和 refinement 生命周期的长期资产。

本文因此将 Procedural 分成变化较快的 Skill 与变化更慢的 Methodology。具体工具、框架或任务的 Skill 可以在实践中动态修改，但修改应继续接受真实任务、测试、用户纠正和后续案例验证；Methodology 则保存跨项目长期形成的工作习惯，只有某种方法在不同场景中反复成立后才逐渐改变。Tool Knowledge 为这一层提供事实输入，而 Procedural 保存从这些事实中形成的可执行方法。

## 6. Reflection Skill 与 Progressive Disclosure

整个整理流程由一个主 Reflection Skill 负责，而不把 memory、identity、procedural 拆成多个互不相关的顶层 Skill。社区 Agent Skills 规范以 `SKILL.md` 为必需入口，并允许 `references/`、`scripts/`、`assets/` 和其他附加目录按需进行 progressive disclosure，这为大型 Reflection 能力内部继续增加 `workflows/` 提供了自然基础。

主 `SKILL.md` 保存稳定入口与路由原则；Reference 描述 Episode、Desktop、Memory、Identity 等目标文档中的内容应该怎样存在；当某个内部流程复杂到需要独立上下文时，再增加对应 workflow。未来 Harness 如果支持 namespace，同一结构可以自然演化为 `reflection.identity`、`reflection.procedural` 等子路由，而无需改变当前长期文件模型。

## 7. File-first 与可替换认知基础设施

本文采用 file-first 原则，将自然语言 Markdown 与 Git 历史视为长期主体的 canonical content。知识图谱、向量数据库、全文检索和 Runtime World Model 可以作为派生能力存在：KG 可以表达 Episode 支撑 mPFC、LTM 指向 Project、Skill 来自某些实践等关系，Context Assembler 可以在每次运行时根据当前任务组合 LLM prior、Short、LTM、Facts、Bookshelves、Projects、Identity 与工具观察，但这些技术不需要成为数字主体自身的一部分。

这种边界带来直接的工程收益：Identity 可以从 DSH 迁移到另一种 Harness，检索系统可以从 SQLite 更换到 Graph DB，Context Assembly 可以独立演化，而 Episode、Memory、mPFC、SOUL、PERSONA 和 Procedural 仍然保持可读、可审阅和可迁移。外部认知基础设施提升“怎样找到和组织信息”，长期文件则保存“哪些实践构成了我的连续性”。

## 8. 讨论

目前研究对 episodic experience、reflection、长期记忆外置和 Skill evolution 已经提供了较强的实证支持，而 `Self Episode → mPFC → SOUL → PERSONA` 这种完整身份 provenance chain 仍然是一项工程假设。Letta 等系统已经实践 persistent self/persona memory，Narrative Identity 相关 Agent 研究也开始讨论长期 self-model，但把事实来源、自我解释、整体主体和运行时 persona 明确分成四个层级的收益仍需要长期运行实验验证。

因此，这套架构不把“数字灵魂”当作已经得到认知科学证明的实现，而将其视为一个可测试的长期助手设计：如果 mPFC 能够减少人格结论失去来源的问题，SOUL 能够在保持稳定身份的同时允许实践修正，PERSONA 能够在不同 Harness 模式间保持一致主体，同时 Procedural 能够通过真实反馈持续提高工作质量，那么这一分层才具有实际工程价值。Git 版本历史、Episode provenance 和人工低频审阅为这种实验提供了最低成本的可检查基础。

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
