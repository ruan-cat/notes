# LangGraph

LangGraph 是一个低级的 AI Agent 编排执行引擎，用来解决多步流程、条件控制、长时交互、复杂状态管理的 AI agent 系统构建。

LangGraph 用于管理 agent 的逻辑流、状态、条件、持久化、多人合作

---

入门 typescript 版本的 LangGraph 至少需要学习到那些东西？

LangGraph 是一个针对 AI agent（智能体）工作流管理与执行的框架，核心理念是：

- 将智能体的逻辑流程 建模成有状态的图（Graph）
- 在图里，节点（Node） 是执行单元（比如调用 LLM、运行工具、处理数据）
- 边（Edge） 定义节点之间的流程走向（可以是条件分支、循环、分支逻辑）
- 所有执行都围绕一个 共享的状态（Shared State） 进行更新和流转

## 要掌握的基础概念

- Graph 概念（Nodes/Edges/State）
- State 管理
- checkpoint / persistence
- Agent 模板

## 依赖包

- @langchain/langgraph
- @langchain/core

## 对应的常见业务场景

- 客服 Agent: 查询订单 + 触发工单
- coding assistant: 读 repo + 运行测试 + 生成 patch
- 知识库机器人: 检索 + 校验 + 生成答案
- 多 agent 协作机器人：分任务 + 汇总答案

## 学习路径推荐

1. 先熟悉大模型 API → simple prompt → stream responses
2. 学习 LLM tool calling 基础
3. 学 LangGraph 的基本概念（StateGraph/Nodes/Edges）
4. 实战：写一个简单的 agent
5. 再加上持久化 + 人工交互 + 多 agent

## 最低限度目标

- 能用 LangGraph TypeScript 构建一个完整可运行的 agent
- 能写基本的 workflow graph（状态 + 条件 + 团队 agent 协作）
- 能处理 agent 的持久化 & 流式响应（SSE / WebSocket）
- 能整合模型 API，实现多步骤逻辑

## 官方快速入门内容

- TypeScript LangGraph Quickstart

## 其他人给的入门学习资料

- https://lcn7g9phqy51.feishu.cn/wiki/QV2RwTDcci6upckzl2mcRimRn0c
