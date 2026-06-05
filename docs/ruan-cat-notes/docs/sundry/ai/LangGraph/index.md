# LangGraph

LangGraph 是一个低级的 AI Agent 编排执行引擎，用来解决多步流程、条件控制、长时交互、复杂状态管理的 AI agent 系统构建。

---

入门 typescript 版本的 LangGraph 至少需要学习到那些东西？

LangGraph 是一个针对 AI agent（智能体）工作流管理与执行的框架，核心理念是：

- 将智能体的逻辑流程 建模成有状态的图（Graph）
- 在图里，节点（Node） 是执行单元（比如调用 LLM、运行工具、处理数据）
- 边（Edge） 定义节点之间的流程走向（可以是条件分支、循环、分支逻辑）
- 所有执行都围绕一个 共享的状态（Shared State） 进行更新和流转

## 依赖包

- @langchain/langgraph
- @langchain/core

## 对应的常见业务场景

- 客服 Agent: 查询订单 + 触发工单
- coding assistant: 读 repo + 运行测试 + 生成 patch
- 知识库机器人: 检索 + 校验 + 生成答案
- 多 agent 协作机器人：分任务 + 汇总答案
