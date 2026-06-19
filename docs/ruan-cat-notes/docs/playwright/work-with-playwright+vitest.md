# 结合 playwright 和 vitest 完成可持续迭代固化的自动化测试套件

## 核心工作流

playwright 的 CLI/MCP 验证成功后，必须转成正式测试。必须生成恰当的 playwright 测试来固化视觉验证的结果。

## 明确 playwright 和 vitest 在项目开发内所负责的范围

- Vitest：负责快速、确定性的业务验证。
- 视觉测试必须和功能测试分开。

|       测试层       |             工具             |               主要验证内容               |
| :----------------: | :--------------------------: | :--------------------------------------: |
|    领域单元测试    |         Vitest Node          |    格式化、校验、计算、权限、状态转换    |
| Store / Composable |            Vitest            |      输入、输出、副作用、异常和边界      |
|    Vue 组件行为    | Vitest + Vue Testing Library | Props、事件、表单、Loading、Empty、Error |
|   真实浏览器组件   |  Vitest Browser Mode，可选   |  Focus、键盘、浏览器 API、真实 DOM/CSS   |
|      页面集成      |       Playwright Test        |      Router、接口、组件协作、登录态      |
|    关键业务流程    |       Playwright Test        |      登录、查询、创建、支付、审批等      |
|    响应式与视觉    |       Playwright Test        |    页面截图、组件截图、桌面端和移动端    |
|      临时探索      |        playwright-cli        | 发现元素、验证状态、读取 Console/Network |
|    未知页面推理    |        Playwright MCP        |     探索复杂页面、视觉判断、诊断失败     |

### 避免 vitest 和 playwright 出现重复测试

以 `创建用户` 这个业务场景为例：

Vitest 验证范畴：

```txt
邮箱格式是否合法
字段是否被正确转换
API 错误码如何映射
Composable 的 Loading 状态
Store 是否追加新用户
组件是否发出 submit 事件
错误状态是否保留输入
```

Playwright 验证范畴：

```txt
用户能否从页面入口打开 Dialog
真实 Router 和组件能否协作
提交是否发出正确请求
成功反馈是否出现
列表是否更新
键盘和 Focus 是否正确
桌面端、移动端是否正常
视觉基线是否一致
```

不需要在 Playwright 中穷举 20 种邮箱格式，也不需要在 Vitest 中模拟完整页面导航。
