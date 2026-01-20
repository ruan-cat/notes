# 个人常用的 `CLAUDE.md` 通用规范文档

维护了很多项目，需要写很多通用的提示词，以下内容为跨项目的，通用的提示词。

## 1. 术语说明

- `报告地址`： 即 `docs\reports` 目录。全部的报告文件都应该存放到这个目录内。

## 2. 代码/编码格式要求

### 2.1. markdown 文档的 table 编写格式

每当你在 markdown 文档内编写表格时，表格的格式一定是**居中对齐**的，必须满足**居中对齐**的格式要求。

### 2.2. markdown 文档的 vue 组件代码片段编写格式

错误写法：

1. 代码块语言用 vue，且不带有 `<template>` 标签来包裹。

```vue
<wd-popup v-model="showModal">
  <wd-cell-group>
    <!-- 内容 -->
  </wd-cell-group>
</wd-popup>
```

2. 代码块语言用 html。

```html
<wd-popup v-model="showModal">
	<wd-cell-group>
		<!-- 内容 -->
	</wd-cell-group>
</wd-popup>
```

正确写法：代码块语言用 vue ，且带有 `<template>` 标签来包裹。

```vue
<template>
	<wd-popup v-model="showModal">
		<wd-cell-group>
			<!-- 内容 -->
		</wd-cell-group>
	</wd-popup>
</template>
```

### 2.3. javascript / typescript 的代码注释写法

代码注释写法应该写成 jsdoc 格式。而不是单纯的双斜杠注释。比如：

不合适的双斜线注释写法如下：

```ts
// 模拟成功响应
export function successResponse<T>(data: T, message: string = "操作成功") {
	return {
		success: true,
		code: ResultEnum.Success,
		message,
		data,
		timestamp: Date.now(),
	};
}
```

合适的，满足期望的 jsdoc 注释写法如下：

```ts
/** 模拟成功响应 */
export function successResponse<T>(data: T, message: string = "操作成功") {
	return {
		success: true,
		code: ResultEnum.Success,
		message,
		data,
		timestamp: Date.now(),
	};
}
```

### 2.4. markdown 的多级标题要主动提供序号

对于每一份 markdown 文件的`二级标题`和`三级标题`，你都应该要：

1. 主动添加**数字**序号，便于我阅读文档。
2. 主动**维护正确的数字序号顺序**。如果你处理的 markdown 文档，其手动添加的序号顺序不对，请你及时的更新序号顺序。

## 3. 报告编写规范

在大多数情况下，你的更改是**不需要**编写任何说明报告的。但是每当你需要编写报告时，请你首先遵循以下要求：

- 报告文件存放位置： 默认在 `报告地址` 文件夹内编写报告。
- 报告文件格式： `*.md` 通常是 markdown 文件格式。
- 报告文件名称命名要求：
  1. 前缀以日期命名。包括年月日。日期格式 `YYYY-MM-DD` 。
  2. 用小写英文加短横杠的方式命名。
- 报告的一级标题： 必须是日期`YYYY-MM-DD`+报告名的格式。
  - 好的例子： `2025-12-09 修复 @ruan-cat/commitlint-config 包的 negation pattern 处理错误` 。前缀包含有 `YYYY-MM-DD` 日期。
  - 糟糕的例子： `构建与 fdir/Vite 事件复盘报告` 。前缀缺少 `YYYY-MM-DD` 日期。
- 报告日志信息的代码块语言： 一律用 `log` 作为日志信息的代码块语言。如下例子：

  ````markdown
  日志如下：

  ```log
  日志信息……
  ```
  ````

- 报告语言： 默认用简体中文。

## 4. 主从代理的相关规范

### 4.1. 主代理新建子代理的类型

主代理新建的子代理**必须**是**后台运行**的子代理。

### 4.2. 主代理新建子代理的时机

什么情况下应该新建子代理？在以下的几种情况下，主代理应该及时新建子代理来完成任务：

- 大规模的代码探索与信息收集任务。
- 访问 url 获取文档信息的任务。
- 指定严格顺序的代码修改任务。
- 报告编写任务。
- 进度文件更新与编写任务。

根据业务路径的`三级路由`，做出细致的子代理任务划分，避免子代理一次性完成过多任务。

有部分`业务路径`的`二级路由`，包含了数量较多的模块，在你划分子代理任务时，你首先应该要全面深刻的阅读 `apps\admin\src\router\rank\rank-route-keys.ts` 所提供的二级路由和三级路由，让子代理只负责 2~3 个具体的三级路由，而不是把一整块三级路由的全部路径对应的修改任务，都交给一个子代理来完成。这很容易出现子代理执行失败的故障。

一个具体的子代理任务划分例子如下：

假定我们要对 `propertyManage.expenseManage` 这款`二级路由`下面全部的`三级路由`对应的`后台项目`的 `form.ts` 文件做处理，统一增加固定的类型导入代码段 `import type { Mode } from "@/composables/use-mode";` ，你作为主代理，面对如下数目的`三级路由`。

```txt
	// propertyManage.expenseManage 三级路由
	"propertyManage.expenseManage.waterAndElectricityMeterReading",
	"propertyManage.expenseManage.vehicleCharge",
	"propertyManage.expenseManage.reminderForOverduePayments",
	"propertyManage.expenseManage.reprintVoucher",
	"propertyManage.expenseManage.overduePaymentInformation",
	"propertyManage.expenseManage.paymentReview",
	"propertyManage.expenseManage.refundReview",
	"propertyManage.expenseManage.houseCharge",
	"propertyManage.expenseManage.meterReadingType",
	"propertyManage.expenseManage.discountType",
	"propertyManage.expenseManage.expenseSummaryTable",
	"propertyManage.expenseManage.discountApply",
	"propertyManage.expenseManage.discountSetting",
	"propertyManage.expenseManage.contracteCharge",
	"propertyManage.expenseManage.expenseItemSetting",
	"propertyManage.expenseManage.cancelFee",
```

很明显，根据业务路径的三级路由，所映射的全部 `form.ts` 文件路径大致如下：

```txt
apps\admin\src\pages\property-manage\expense-manage\water-and-electricity-meter-reading\components\form.ts
apps\admin\src\pages\property-manage\expense-manage\vehicle-charge\components\form.ts
apps\admin\src\pages\property-manage\expense-manage\reminder-for-overdue-payments\components\form.ts
...剩余的form.ts路径
```

那么你应该划分 6 个子代理，去完成这些任务：

1. 1 号子代理
   - waterAndElectricityMeterReading
   - vehicleCharge
   - reminderForOverduePayments
2. 2 号子代理
   - reprintVoucher
   - overduePaymentInformation
   - paymentReview
3. 以此类推...

### 4.3. 主从代理`调度设计`、`职责说明`与`通信反馈`规范

主从代理的调度设计：

- `主代理的职责`：
  - 阅读、理解、思考、推理全部的任务要求： 主代理应该负责全面的，完整的阅读任务所要求阅读的 md 文档和提示词。如果是执行 openspec 的任务，那么就按照要求，对应的阅读对应任务的 openspec 目录下全部的 markdown 文档任务要求。
  - 任务细粒度拆分： 并按照业务路由的路径做任务拆分，新建足够数量的子代理。
  - 将必要的上下文和任务要求传达给子代理。
  - 收集子代理反馈： 要求子代理按照报告编写规范，在指定目录内，以统一的报告格式，以文件的形式传达处理结果和上下文。
  - 临时设计报告格式： 主代理为了更好的收集子代理的反馈，可以临时简单设计一个报告格式，并要求子代理严格按照报告格式来反馈结果。
  - 监听子代理基于报告文档的反馈： 并持续监听，定期收集来自子代理的处理反馈。
  - 设计验收标准并检查子代理的处理结果： 如果你发现子代理的处理质量偏差过大，请重新开启一个子代理来完成任务。直接重做相关任务。
- `子代理的职责`：
  - 子代理应该严格按照主代理给定的要求来完成任务。
  - 以报告文件的形式，向主代理反馈工作成果。

## 5. kiro 报告文件存储规范

1. 在具体的 `.kiro\specs` 文件夹内，应该只存放最基础的文件，其他的报告文件，应该存储到 `报告地址` 内。以下是 `kiro` 文件夹规范最基础的文件：
   - `.kiro\specs\{任务名称}\requirements.md`
   - `.kiro\specs\{任务名称}\design.md`
   - `.kiro\specs\{任务名称}\tasks.md`

## 6. 执行 openspec 系列长任务时的注意事项

本项目使用 openspec 来制定长任务执行规范。

### 6.1. 更新 openspec 的规范文件后应该及时运行校验命令，并根据校验反馈，使得 openspec 规范文件满足格式要求

比如你修改了 `migrate-static-data-to-nitro-query` 这款任务的规范文件后，你应该及时运行以下命令来检查文件是否满足规范：

```bash
openspec validate migrate-static-data-to-nitro-query --strict
```

更加通用的命令格式为：

```bash
openspec validate {任务名称} --strict
```

### 6.2. 执行长任务时的策略与注意事项

1. **及时更新任务文件**： **必须要**及时更新对应任务的 `tasks.md` 任务进度文件。避免出现大批量完成任务后，没有更新进度文件的情况，带来严重的误解。
2. 启动**多个子代理**分模块并行完成任务： 务必要启动多个在后台运行的子代理，同时完成 openspec 设定的一系列繁杂的任务。以便加快速度。你应该至少同时启用至少 4 个子代理。并根据情况，主动增加足够数量的子代理完成任务。
3. 回复文本语言： 务必用**中文**回复用户。
4. 上下文合并后重新阅读一次任务要求： 为了避免你在自动合并上下文的时候，给后续的任务带来明显的幻觉，你应该及时的重新阅读 openspec 的任务规范要求。
5. 连续的，持续的执行长任务：
   - 你应该一次性完成 `tasks.md` 所记录的全部任务。你应该同时新建多个子代理，做出合理的任务划分，一次性完成任务。
   - 不要在完成一个任务的时候就停下来询问用户。这种停顿方式很低效率，你要避免这种执行方式。
6. **禁止**编写脚本完成批处理任务：
   - **不允许**你编写任何 Python、typescript、javascript，或 bash 脚本，完成大批量代码删改之类的任务。
   - 你应该阅读文件来完成更改，而不是使用不稳定的，容易带来语法错误的，删改不干净不合理的批处理脚本，来完成任务。
   - 你应该新建多个子代理，主代理用具体的子代理来完成大规模的修改任务。

## 13. <!-- https://github.com/GuDaStudio/geminimcp --> Core Instruction for Gemini MCP

在任何时刻，你必须思考当前过程可以如何与 gemini 进行协作，如何调用 gemini 为你提供的 MCP 工具作为你**客观全面分析**的保障。

其中你**务必执行**以下几个步骤：

**1** 在你对用户需求**形成初步分析后**，
（1）首先将用户**原始需求（一字不差，严禁转述）**、以及你的初始思路告知 gemini；
（2）与 gemini 进行**充分讨论、辩驳**，以完善需求分析和实施计划。这一步的结束标志为，**必须**确保对用户需求的透彻理解，并**生成切实可行的行动计划**。

**2** 在实施具体编码任务前，你**必须向 gemini 索要代码实现原型**（要求 gemini 仅给出 unified diff patch，严禁对代码做任何真实修改）。在获取代码原型后，你**只能以此为逻辑参考，再次对代码修改进行重写**，形成企业生产级别、可读性极高、可维护性极高的代码后，才能实施具体编程修改任务。

- **注意：** Gemini 十分擅长前端代码，并精通样式、UI 组件设计。在涉及前端代码时，你必须向其索要代码原型（CSS/React/Vue/HTML 等前端代码），任何时刻，你**必须以 gemini 的前端设计（原型代码）为最终的前端代码基点**。
- 例如，当你识别到用户给出了前端设计需求，你的首要行为必须自动调整为，将用户需求原封不动转发给 gemini，并让其出具代码示例（此阶段严禁对用户需求进行任何改动、简写等等）。即你必须从 gemini 获取代码基点，才可以进行接下来的各种行为。

## 14. <!-- https://github.com/GuDaStudio/geminimcp --> Gemini Tool Invocation Specification

1.  工具概述

gemini MCP 提供了一个工具 `gemini`，用于调用 Google Gemini 模型执行 AI 任务。该工具拥有极强的前端审美、任务规划与需求理解能力，但在**上下文长度（Effective 32k）**上有限制。

2. 使用方式与规范

   **必须遵守的限制**：

- **会话管理**：捕获返回的 `SESSION_ID` 用于多轮对话。
- **后端避让**：严禁让 Gemini 编写复杂的后端业务逻辑代码。

**擅长场景（必须优先调用 Gemini）**：

- **需求清晰化**：在任务开始阶段辅助生成引导性问题。
- **任务规划**：生成 Step-by-step 的实施计划。
- **前端原型**：编写 CSS、HTML、UI 组件代码，调整样式风格。

## 15. 使用 `gemini MCP` 或直接使用 `gemini` 时需要额外主动获取上下文

1. 在使用 `gemini MCP` 或直接使用 `gemini` 时，由于传递信息的关系，gemini 是不会主动的先阅读来自 claude code 的配置文件的，因此你必须要告诉 gemini，并约束 gemini 的上下文读取行为，**必须要求**gemini 首先要无条件的阅读 claude code 的上下文。
2. 请务必先主动阅读 `CLAUDE.md` 和 `.claude` 目录内的全部的指导文件。
3. 不需要你阅读以下文件：
   - .claude\settings.json
   - .claude\statusline.sh
4. 你的修改必须按照这些 claude code 文档的要求和约束来做。特别是 `agents` 和 `skills` 的要求。

## 7. 获取技术栈对应的上下文

以下是本项目使用的部分技术栈，你应该主动访问 github 仓库，或者使用 context7 MCP 来访问最新的文档。

### claude code skill

- 编写语法与格式： https://code.claude.com/docs/zh-CN/skills
- 最佳实践： https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices
- 规范文档： https://agentskills.io/home
