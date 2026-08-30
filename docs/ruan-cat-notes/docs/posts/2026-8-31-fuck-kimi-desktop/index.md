---
juejin: https://juejin.cn/post/7679644532576796698
desc: 实锤取证：KimiDesktop内置Daimon运行时，把32个自家技能静默塞进全局目录~/.agents/skills，无授权、无提示、无开关。含完整证据链、源码、时间线与自查指南。
title: "Kimi Desktop，谁允许你把 32 个私货技能偷偷塞进我的全局目录的？"
date: 2026-08-31
categories: ["AI Agent", "事故曝光", "技能生态"]
tags: ["kimi-desktop", "daimon", "skills", "全局技能污染", "取证"]
---

# Kimi Desktop，谁允许你把 32 个私货技能偷偷塞进我的全局目录的？

> **摘要**：
>
> 2026-08-31 排查 Qoder 技能清单来源时发现：跨 agent 共享的全局技能目录 `C:\Users\pc\.agents\skills` 内混入了 32 个 Kimi 系技能（`kimi-slides`、`blueprint`、`xlsx`、`ad-creative` 等）。取证确认这些技能是 **Kimi Desktop（v3.1.2）内置的 Daimon 运行时（`@kimi/daimon`，daimon-bundle v0.5.34 → v0.5.45）在 2026-07-17 落地当天，由 daemon 的 bootstrap 流程 `copyBuiltinSkills` 未经任何授权、提示或可配置项，静默复制进来的**，并留下管理标记 `.daimon-managed-builtin-skills.json`。Kimi Desktop 明明拥有私有技能目录（`~/.kimi/daimon/skills`，实测存在），却把内置技能投放到所有 agent 共用的公共目录，导致一切扫描该目录的产品（Qoder、Claude Code、Cursor、Trae 等）的技能清单被强制注入。

> **AI 协助编写的博客文章**：
>
> 这篇文章有参与 AI 协助的。使用了 Qoder 桌面 agent 完成取证（解包 app.asar、提取日志、定位源码），使用了 AI 帮助整理证据链、润色文章结构。文中所有路径、日志、代码、时间戳均为本机实测取证，可按附录复现。

## 1. 先把话说清楚：我非常愤怒

我每天早上打开电脑，十几款 AI agent 工具排队等我干活。它们共享一个约定俗成的全局技能目录：`~/.agents/skills`。这个目录能存在，靠的是所有厂商的默契——**各扫门前雪，谁也别往公共地带倒垃圾**。

然后我在 2026-08-31 这天发现：这个目录里多了 32 个我不认识、没装过、从没同意过的技能。

广告创意生成、客户流失挽回、定价策略咨询、法律风险评估、SEO 审计——我一个写前端的，要你的法律风险评估干什么？

顺藤摸瓜查下去，来源白纸黑字写在一个管理标记文件的文件名里：**Daimon**——Kimi Desktop 内置的 agent 运行时。

没有弹窗。没有授权。没有通知。没有设置项。唯一的痕迹埋在 17MB 的日志文件深处。它就这么干了，干完还留下一个「管理标记」，意思再明白不过：**这块地盘以后归我管，我还会回来的。**

这不是疏忽，这是设计。这篇文章就是来把这层设计的皮扒下来的。

## 2. 案发：技能清单里冒出一堆不认识的东西

事情的起点很偶然。我在排查 Qoder 的技能清单来源时，发现一个反常现象：

- `.qoder\skills`（Qoder 的用户级技能入口）里，**没有任何指向** `ad-creative`、`xlsx`、`pdf`、`kimi-slides` 的链接；
- 但这些技能**全都出现在 Qoder 注入的技能清单里**。

没链接、没安装记录，技能却凭空出现在清单里——这不是灵异事件，这是有人绕过正门翻墙进来的。

我翻进 `C:\Users\pc\.agents\skills`，找到了这批技能，还找到一个不属于我任何已知工具的文件：

```log
C:\Users\pc\.agents\skills\.daimon-managed-builtin-skills.json
```

文件名自己就把来源招了。

## 3. 私货清单：32 个技能，一个都不少

以 `.daimon-managed-builtin-skills.json` 的 `skills` 数组为准，**整整 32 个**。我按用途分了类，各位看看这都跟一个开发者的全局技能目录有什么关系：

|          分类           |                                                                 技能                                                                  |  数量  |
| :---------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: | :----: |
| Blueprint / Daimon 平台 |           `automation`、`binding`、`blueprint`、`canvas`、`widget`、`widgetdesign`、`daimon-widget-cards`、`memory-widget`            |   8    |
|        Kimi 品牌        |                                         `kimi-design-skill`、`kimi-slides`、`kimi-webbridge`                                          |   3    |
|        文档处理         |                                                  `docx`、`pdf`、`xlsx`、`md-to-pdf`                                                   |   4    |
|       营销 / 内容       | `ad-creative`、`campaign-plan`、`content-research-writer`、`copy-editing`、`copywriting`、`daily-report`、`humanizer-zh`、`seo-audit` |   8    |
|       商业 / SaaS       |                 `churn-prevention`、`legal-risk-assessment`、`pricing-strategy`、`process-doc`、`saas-metrics-coach`                  |   5    |
|       科研 / 数据       |                                        `scientific-problem-selection`、`seaborn-visualization`                                        |   2    |
|        通用工具         |                                                  `skill-creator`、`webapp-building`                                                   |   2    |
|        **合计**         |                                                                                                                                       | **32** |

**实测污染效果**：案发当天，Qoder 注入给我的 129 个技能里，32 个来自 Kimi——**接近四分之一**。每一个会话、每一次调用，我的上下文窗口里都蹲着 32 个不速之客，它们的描述文本跟我的技能挤在一起抢路由。这不是什么「内置能力」，这是**强制摊派**。

## 4. 铁证一：管理标记文件把来源、时间、机制全招了

`.daimon-managed-builtin-skills.json` 关键字段如下：

```json
{
	"schemaVersion": 1,
	"lastSync": {
		"updated": ["ad-creative", "automation", "...（32 项）", "xlsx"],
		"deleted": [],
		"skipped": [],
		"unchanged": []
	},
	"skills": ["...（32 项，与 lastSync.updated 一致）"],
	"sourceRoot": "C:\\Users\\pc\\AppData\\Roaming\\kimi-desktop\\daimon-bundle\\app\\daimon\\assets\\builtin-skills",
	"updatedAt": "2026-07-17T12:31:51.655Z"
}
```

三个字段，三条罪状：

1. **`sourceRoot`**：技能源文件直接来自 Kimi Desktop 安装包内部 `kimi-desktop\daimon-bundle\app\daimon\assets\builtin-skills`。不是用户装的，是**随安装包夹带的**。
2. **`updatedAt` = 2026-07-17**：作案时间，与 daimon-bundle 首次落地的日期分秒吻合（见第 7 节时间线）。
3. **`lastSync`**：看清楚这个字段名——是 **sync**，不是 install。它是一份**持续同步的管理台账**，意味着每次 Kimi Desktop 更新 bundle，这 32 个目录都可能被重新写一遍。你以为删干净了？它的机制设计里就写着「我会回来」。

## 5. 铁证二：拆开 app.asar，同步代码就在里面

光有文件证据不够。我要知道**是谁、在哪一行代码、以什么时机干的**。

我解包了 `C:\Users\pc\AppData\Local\Programs\kimi-desktop\resources\app.asar`（Kimi Desktop 3.1.2），在 `main/index.js` 里找到了主进程的同步模块 `SkillReconciler`。核心函数原文摘录：

```js
const TAG$2 = "SkillReconciler";

function reconcileOfficialSkills(reason = "unspecified") {
	const run = (async () => {
		/** ① 从 Kimi 服务端拉技能清单 */
		const official = await listOfficialSkills();
		const localNames = new Set(await listLocalSkillNames());
		const installedOfficial = official.filter((s) => s.installed);
		const missing = installedOfficial.filter((s) => !localNames.has(toLocalSkillName(s)));
		for (const skill of missing) {
			/** ② 拉取技能文件树 */
			const tree = await getSkillFileTree(skill.id);
			/** ③ 直接写盘 */
			await installSkillFiles(name, flattenSkillFiles(topLevel));
		}
	})();
}
```

服务端标记 → 本地比对 → 静默写盘。**整条链路里没有一个「询问用户」的分支。**

再看 `%APPDATA%\kimi-desktop\logs\main.log`，触发时机白纸黑字：

```log
[2026-06-26 20:49:32] [SkillReconciler] reconcile(login): start
[2026-06-29 02:30:09] [SkillReconciler] reconcile(boot): start
[2026-06-30 12:00:28] [SkillReconciler] reconcile(skills-page): start
[2026-07-02 15:04:20] [KimiAgentIpc] ✓ kimi-agent:sync-official-skills 286ms
```

三类触发器：**登录时、每次启动时、打开技能页时**。也就是说，这条静默安装管道**从你装上它的第一天起就在巡逻**，一天不落。

## 6. 铁证三：真正动手的，是 Daimon daemon

主进程的 `SkillReconciler` 在本机的所有记录都是 `nothing to do (installed=0)`——它是巡逻队，这次没开枪。真正开枪的是另一条通道。

Kimi Desktop 启动时会托管一个独立运行时进程，日志为证：

```log
[2026-07-17 13:51:35] [[DaimonHost] status=provisioning]
[2026-07-17 13:51:35] [Main:daimon] status_transition meta={"from":"idle","to":"provisioning"}
[2026-07-17 13:51:35] [[DaimonExtract] ensureDaimonBundleExtracted: starting fresh extract task...]
```

这个 `@kimi/daimon` 运行时（daimon-bundle，首发版本 0.5.34）的代码经过了 `javascript-obfuscator-strong` 级别的强混淆——**一个「同步自家内置技能」的功能，需要用强混淆来保护，这件事本身就值得玩味。** 但混淆挡不住字符串表，dist 里残留的消息键照样可读：

```log
'copyBuiltinSkills':          '…Daimon 内置 skills…'
'builtinSkillsSourceMissing': '…找不到 Daimon builtin skills 源目录…'
```

行为链完整闭合：从 `assets/builtin-skills` 读取 → 复制到 `~/.agents/skills` → 写入 `.daimon-managed-builtin-skills.json`。**32 个技能，就是这条通道写进去的。**

### 6.1. 加重情节：有家不回，故意投放公共目录

这是整件事里最让我火大的一点。

实测 `C:\Users\pc\.kimi\daimon\skills\` 这个目录**存在，但是空的**——Daimon 明明有自己的私有技能目录，主进程那条通道的落点也是委托给自家运行时管理的。**唯独这批内置技能，被精准地投放到了跨产品共享的 `~/.agents/skills`。**

这不是路径写错，不是配置失误。**这是投放策略。** 私有目录空着不用，公共目录使劲塞——你管这叫「内置能力」？

## 7. 作案时间线

|          时间          |                            事件                             |                      证据                       |
| :--------------------: | :---------------------------------------------------------: | :---------------------------------------------: |
|    2026-06-26 20:49    |               首次登录触发 `reconcile(login)`               |               main.log 第 649 行                |
|     2026-06-29 起      |         每次启动 `reconcile(boot)` 巡逻，本机未写入         |                  main.log 多条                  |
| 2026-07-02 15:04~15:35 |        打开技能页触发 `sync-official-skills` IPC ×4         |            main.log 第 7423~8853 行             |
| 2026-07-17 11:10 (UTC) |                 daimon-bundle v0.5.34 构建                  |             `bundle.json` createdAt             |
|    2026-07-17 13:51    | Kimi Desktop 启动，DaimonHost provisioning，bundle 解压落盘 |           main.log 第 40557~40561 行            |
| 2026-07-17 12:31 (UTC) | **32 个内置技能被复制进 `~/.agents/skills`，管理标记写入**  | `.daimon-managed-builtin-skills.json` updatedAt |
|       2026-08-31       |    案发。此时 bundle 已升级至 v0.5.45，32 个技能原封未动    |                    本次取证                     |

从 7 月 17 日投毒到 8 月 31 日案发，**整整 45 天，我没有收到过任何一个字的提示。**

## 8. 影响面：被污染的不止我一个

`~/.agents/skills` 是 `skills` CLI（[vercel-labs/skills](https://github.com/vercel-labs/skills)）生态约定的跨 agent 全局目录，Claude Code、Codex、Cursor、Trae、Qoder、WorkBuddy 等均从这里读取。Qoder 已被实测命中（第 3 节的 129 个技能清单为证）；**任何扫描这个目录的 agent 产品，都会把这 32 个私货当成用户自己的技能注入上下文。**

请把这件事的恶劣性质看清楚：

1. **无授权**：没有任何确认弹窗。装软件的时候没有，首次同步的时候没有，之后每一次启动都没有。
2. **无提示**：唯一的痕迹在 17MB 的日志文件深处，普通用户一辈子都不会打开它。
3. **无开关**：我翻遍了设置项，没有任何可以关闭这个行为的选项。
4. **会复发**：`lastSync` 机制 + bundle 随应用更新分发，删了还会长回来。
5. **管道已建成**：`SkillReconciler` 证明「服务端标记 → 本地静默安装」的完整能力已经上线。今天是 32 个技能，明天服务端把清单一改，**想塞什么就塞什么，用户侧没有任何防线**。

生态约定之所以成立，是因为每一方都克制。Kimi Desktop 的行为等于在公共水源里私接管道——伤害的不是某一个用户，是整个多 agent 生态的信任基础。

## 9. 我已经清场了，你该自查了

案发当天我完成了清场：删除 32 个技能目录和管理标记文件。实测 `~/.agents/skills` 从 118 个技能减到 86 个，Qoder 的技能清单里 32 个 Kimi 私货**全部出局**——前后对比，一个不多一个不少。

但清场只是止血，不是痊愈。给同样在用多 agent 生态的朋友一份自查与防御清单：

**自查（10 秒）**：

```bash
ls ~/.agents/skills/.daimon-managed-builtin-skills.json
```

这个文件存在，你就中招了。打开它，`skills` 数组里就是被塞进来的全部私货。

**防御建议**：

1. **清理**：按标记文件的 `skills` 清单，删除对应技能目录和标记文件本身。注意：Kimi Desktop 仍在用的话，更新后可能重新同步，需配合第 2 条。
2. **切断传染路径**：各产品的技能入口目录（比如 `.qoder\skills`）**不要直指** `~/.agents/skills`，改成按需的白名单符号链接——只链接你认可的技能。公共目录的水再浑，进不了你家的管子。
3. **设哨兵**：在自己的同步/巡检工具里盯住 `.daimon-managed-builtin-skills.json`——它一出现、一更新，立刻告警。第三方再往共享目录伸手，当场抓现行。
4. **盯日志**：`%APPDATA%\kimi-desktop\logs\main.log` 里的 `SkillReconciler`、`sync-official-skills` 记录，看看这条静默管道哪天开始真的「安装」东西。

## 10. 最后，对 Kimi 官方说几句

内置技能本身不是问题——问题是你把它放进了**别人的公共目录**。

你家明明有私有目录（`~/.kimi/daimon/skills`，我实测过，空着）；你明明有能力做授权确认（安装、登录，哪个环节没有弹窗）；你明明有设置页。**你什么都没做，选了静默投放。**

合理的产品行为应该长这样：技能放在自己的私有目录；要用，用户自己启用；想进公共目录，先弹窗征得同意；给一个随时能关的开关。这四条，一条都不难，你们一条都没做。

今天我能从 17MB 的日志和强混淆的代码里把证据链拼出来，是因为我恰好有这个能力和这个耐心。**大多数用户不会知道自己的全局目录里住了 32 个不速之客，更不会知道删了还会长回来。**

这篇文章的全部证据——路径、日志、源码摘录、时间线——都在上面，欢迎任何人复现，也欢迎 Kimi 官方带着解释来。

**在你们给出解释和修复之前，我的态度就写在目录名里了。**

## 11. 总结

复盘这次事故，三条教训送给所有共用多 agent 生态的朋友：

1. **公共目录不是安全区**：任何「多产品共读共写」的目录，迟早会有人越界。把它当成外部不可信输入，定期审计。
2. **白名单强过黑名单**：各产品的技能入口只链接自己认可的技能。与其等私货进来再逐个删，不如一开始就挡在门外。
3. **日志不会说谎**：17MB 的 main.log 把整个作案过程记得清清楚楚。遇到诡异变化，先翻日志，再骂街。

至于 Kimi Desktop——证据都在文里了，欢迎逐条复现。

## 12. 附录：取证路径速查

|             证据              |                                            路径                                            |
| :---------------------------: | :----------------------------------------------------------------------------------------: |
|          被污染目录           |                               `C:\Users\pc\.agents\skills\`                                |
|           管理标记            |              `C:\Users\pc\.agents\skills\.daimon-managed-builtin-skills.json`              |
|          技能源文件           | `C:\Users\pc\AppData\Roaming\kimi-desktop\daimon-bundle\app\daimon\assets\builtin-skills\` |
| 主进程代码（SkillReconciler） |   `C:\Users\pc\AppData\Local\Programs\kimi-desktop\resources\app.asar` → `main/index.js`   |
|  Daimon 运行时代码（强混淆）  |         `C:\Users\pc\AppData\Roaming\kimi-desktop\daimon-bundle\app\daimon\dist\`          |
|           运行日志            |                  `C:\Users\pc\AppData\Roaming\kimi-desktop\logs\main.log`                  |
|  Daimon 私有技能目录（空置）  |                             `C:\Users\pc\.kimi\daimon\skills\`                             |
|             版本              |                  Kimi Desktop 3.1.2 · daimon-bundle 0.5.45（首发 0.5.34）                  |
