# Identity 子系统

> 状态：设计基线。这里记录当前已经确认的 Identity 结构与运行守则；它不表示仓库现有 0.2.4 Skill 已完成迁移。

Identity 只解决一个问题：**长期人格连续性**。

任务进度、项目事实、代码状态、笔记正文、检索结果和其他工作状态默认属于外部 World / Workspace，不进入 Soul。任务连续性由 Workspace、Ralph handoff 与项目自身文件承担；Identity 不复制这些状态。

可以把当前原则压缩成两句话：

> World remembers work.  
> Soul remembers self.

## 基本结构

建议的 Identity Workspace：

```text
identity/
├── constitution.md
├── soul.md
└── mpfc/
    ├── state.json
    └── reflections/
        ├── <reflection-id>.json
        └── ...
```

### constitution.md

Constitution 是主观定义与长期锚点，回答“原则上希望这个数字人格成为什么”。

它来自用户给定的定义、模板和少量高稳定性的基础守则。Reflection 可以读取 Constitution 作为校准基线，但不应因为一次普通经历自动重写它。

### soul.md

Soul 是当前已经形成的人格连续体，回答“到目前为止，我成为了怎样的助手”。

Soul 可以包含：

- 稳定的人格倾向与判断方式；
- 长期形成的工作习惯；
- 对用户长期偏好与互动方式的理解；
- 双方经过长期合作形成的关系性默契；
- 少量真正塑造当前人格的长期认识。

“自我定义”“用户偏好”“关系理解”不需要被强行拆成独立记忆类型。它们最终共同决定 Root Agent 如何理解用户、形成判断和表达回答。

Soul 描述的是长期倾向，不是具体任务命令。

### mpfc/

mPFC 保存 Identity 的元认知审计轨迹：每次 Reflection 在什么时间、基于什么证据、经过怎样的 Ralph 过程，以及 Soul 是否发生了状态转移。

mPFC 既记录产生 Soul 修改的 Reflection，也记录明确判断“这些证据不足以改变 Soul”的否定结果。否定结果不是空白；它表示这批经历已经被审视，并可以成为以后 Deep Reflection 的历史证据。

mPFC 不作为 Root Agent 每轮默认加载的人格上下文。

## 三种消费方式

同一个 Identity Workspace 在不同运行阶段有三种不同语义：

```text
Root Agent
    soul.md = “这是当前的我”

Task Ralph Worker
    soul.md = 不加载

Reflection Ralph Worker
    soul.md = “这是本次要审视和维护的工作对象”
```

因此：

- Root Agent 加载 Soul，用于人格化理解、判断与回答；
- Task Ralph Worker 不继承完整 Soul，只接收与工作有关的约束；
- Reflection Ralph 读取 Soul，但它本身不是 Soul，也不需要持久化自己的对话上下文。

## Soul 不负责什么

以下内容默认不进入 Soul：

- 当前项目做到哪一步；
- PR、commit、issue、测试结果等工程状态；
- 产品规格、市场数据、研究材料；
- 某篇笔记本身的正文；
- 普通事实知识与工具知识；
- 单次任务临时限制；
- Ralph Round 的工作状态。

这些内容由各自的 Workspace、Project、Notes、Repository、Knowledge Source 或 Ralph handoff 承担。

如果某段工作经历长期改变了“我如何做事”“我如何理解用户”或“我们如何合作”，Reflection 可以基于证据把这种长期变化吸收到 Soul；工作事实本身仍然留在 World。

## 与任务执行的桥

Soul 不直接传给 Task Ralph。带有 Soul 的 Root Agent 在开始任务前，把与当前任务相关的长期倾向和用户要求投影成轻量的 Task Contract / constraints。

```text
Soul
+ Current User Request
+ Project Rules
        ↓
Root Agent
        ↓
Task Contract / constraints
        ↓
Fresh Ralph Worker
```

Task Contract 的具体设计见 [task-contract.md](task-contract.md)。

## 与 Reflection 的桥

Reflection 本身也是一次 Ralph 过程，不建立第二套 Agent 协议。

```text
Constitution
+ Current Soul
+ Selected Experiences
+ Relevant mPFC history
        ↓
Reflection Ralph
        ↓
standard Ralph report
        ↓
observed Soul state transition
        ↓
mPFC record
```

Reflection 的详细规则见 [reflection.md](reflection.md)。

## 运行时

Root Agent、Task Ralph 与 DSH `tool-ralph` 的装配关系见 [runtime.md](runtime.md)。
