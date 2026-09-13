# 标准记忆格式

Short-term Memory 与 Episode 都保存带有明确时间和工作上下文的实践记录，因此共享一套最小索引格式。格式只负责快速定位，正文仍由 Short 与 Episode 各自的整理原则决定。

## 基础格式

统一使用：

```text
[日期][项目[:会话]][时间]
```

日期使用 `YYYY-MM-DD`，时间使用配置中的本地时间 `HH:mm:ss`。项目填写当前项目、工作区或能够稳定指向工作上下文的简短标识。

当同一项目存在多个并行工作线，或具体会话本身对恢复上下文有价值时，把会话合并进项目这一格，用冒号连接：

```markdown
[2026-01-15][project-alpha:architecture-review][20:20:35]
```

没有会话时：

```markdown
[2026-01-15][project-alpha][20:20:35]
```

项目/会话这一格按第一个 `:` 区分 project 与 session。session 内可以继续使用冒号表达稳定层级，因此 `[home:research:cost-shifting]` 是合法的：project=`home`，session=`research:cost-shifting`。不要为了机器读取额外拆成更多 header 字段。

## Short header

Short 在基础格式末尾增加 Reflection 状态：

```text
[日期][项目[:会话]][时间][reflection:pending|done]
```

例如：

```text
[2026-09-13][home:theory][15:36:21][reflection:pending]
[2026-09-13][home:research:cost-shifting][17:14:53][reflection:pending]
[2026-09-11][labourchain][08:43:38][reflection:done]
```

这个顺序是 canonical。不要重新排列成 `[日期][项目][时间][会话][状态]`，也不要继续增加机器字段。

## Pending rolling slot

同一项目/会话的 pending Short 采用 rolling slot。一个 slot 只能有：

1. 一个最新 header；
2. 零到多条已经压缩的历史行；
3. 一个且仅一个 latest body。

示例：

```markdown
[2026-01-15][project-alpha:architecture-review][21:05:12][reflection:pending]

- [2026-01-15 20:20:35] 用户要求继续收敛架构，Agent 完成组件复用审查，工作推进到剩余数据流问题。

用户进一步调整数据流边界，Agent 修改相关说明并完成一致性检查，当前已推进到运行时验证阶段。

未收口：还需验证两个异常路径。
关联文档：`desktop/project-notes.md`
```

日志统一使用 `- [YYYY-MM-DD HH:mm:ss]` 开头。每次更新已有 pending slot 时，只把“上一轮唯一 latest body”压成一条新日志，已有日志原样保留；然后彻底删除上一轮正文并写入新的唯一正文。

禁止把新的完整正文直接追加在旧正文后面。禁止一个 slot 同时保留多个未压缩正文。禁止反复压缩已有日志。

每条历史日志只属于自己的 project/session slot。不要把邻近 slot 的上一轮工作复制进新 slot 作为“背景”。跨工作线关系由 Project 状态或关联文件承担。

## Reflection done slot

`reflection:pending` 表示当前 rolling history 和 latest body 尚未被手动 Reflection 消化。

`reflection:done` 表示该周期已完成 Reflection，详细信息已经被对应的长期层吸收。done slot 不再保留 pending 日志和完整正文，只保留 header 与一句简短 stub，例如：

```markdown
[2026-09-11][home:identity-memory][09:24:19][reflection:done]

本周期已完成 Reflection，相关身份、记忆与项目状态已进入对应长期层，Short 不再保留细节。
```

如果 Reflection 检查后判断没有内容需要进入更慢层，也仍然把该 slot 压成一句 done stub，例如：

```text
本周期已完成 Reflection；没有需要进入更慢层的新增内容。
```

一个 done slot 后续出现新实践时，直接开启新的 pending 周期：保留同一 slot identity，更新日期/时间与状态，删除 done stub，写入新的 latest body；不要把 done stub 或已经 Reflection 的旧内容重新转成 pending history。

## Episode

Episode 使用基础格式，不携带 Reflection 状态，也不使用 Short 的 rolling 日志结构。索引之后空一行，再使用自然语言记录正文。不要为了机器读取继续增加固定字段；标签、检索键、向量、图关系和其他结构应由外部索引系统派生。

## Short 正文压缩标准

Short 面向连续性恢复，不面向归档。它保存“下一次打开时为了继续工作必须知道什么”，而不是“这一轮到底研究了多少东西”。正文按“用户说了什么 → 助手做了什么 → 状态推进到哪 → 助手如何回应”组织；这只是语义顺序，不要求写成四个字段。

### 体积预算

当已有对应 Desktop、Project、Research 或其他承载文件时：

- 一条历史日志通常不超过约 100-120 个中文字符或等价长度；
- latest body 通常不超过约 200-300 个中文字符或等价长度；
- 一段话能交代清楚时不要拆成多段长文。

这是软上限，不是字符验证器。唯一目的是真正保持 Short 足够短。

### 应保留的内容

* **当前变化。** 用户这一轮改变、纠正、确认或推进了什么。
* **高层动作。** Agent 实际完成了哪类工作，不复述工具流水。
* **当前状态。** 工作线现在处在哪、最关键的结论转折是什么。
* **未收口与入口。** 下一轮继续工作必须知道的问题、待确认判断或恢复位置。
* **关联文件。** 详细内容已经落盘时，用路径指回去。

### 不进入 Short 的内容

* 来源清单、逐条引文、长 bibliographies；
* 每个来源的核验过程；
* 大量数字、段落级结论或章节级摘要；
* 浏览器导航、shell/tool 调用流水；
* routine 抓取失败、临时安装失败、重复性环境噪音；
* 已经完整记录在某份文档里的论证链；
* 对文件内容的二次全文摘要。

工具限制只有在它直接影响下一轮如何恢复、且尚未进入更合适的 durable tool knowledge 时，才保留一句最短说明。

### 讨论与研究

讨论类实践只记录关键修改、最终收敛位置、仍保留的分歧；研究类实践只记录研究目标、最关键的结论转折、当前状态与 notes 路径。不要把 research notes 重新复制成 Short。

例如：

```markdown
[2026-09-13][home:research:contradiction-model][17:39:00][reflection:pending]

完成“矛盾处理＝损失确认＋成本重新分配＋制度承载”的马克思主义压力测试；当前结论是模型部分兼容，但若继续以承载层/成本转移为核心会退化成功能主义，需要重新引入资本关系、阶级与方向性约束。

未收口：下一步若继续，应直接讨论模型本身如何改写。
关联文档：`desktop/research/contradiction-model/notes.md`
```

不要把文档中每一节的结论重新逐条抄进 Short。那会让 Short 退化成第二套知识库，而失去快速连续性恢复层的作用。
