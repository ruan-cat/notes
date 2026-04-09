<!-- 有价值的报告 不予删除 -->

# 2026-04-09 conventional-changelog angular loader 依赖识别联调报告

## 执行摘要

本次联调的核心结论不是“两个仓库都在用同一个 `angular preset`，只是表现不同”，而是：

- `D:\code\store\eams-component-lib` 当前 `pnpm run changelog:conventional-changelog` 实际命中的是 `conventional-changelog-angular@8.3.1`
- `D:\code\ruan-cat\01s-11comm` 当前同名脚本在 `conventional-changelog-cli@5` 链路下，最终命中的却是 `conventional-changelog-angular@6.0.0`
- `conventional-changelog-angular@8.3.1` 导出的是函数，满足 `conventional-changelog-preset-loader@5` 的加载契约，因此可以成功注入 `writer` 模板，生成 compare-link 标题
- `conventional-changelog-angular@6.0.0` 导出的不是函数，而是一个 `Promise -> 配置对象` 的旧形态，不满足 `loader@5` 的新契约，因此在 `01s-11comm` 中直接报错：`The "angular" preset does not export a function`
- `<small>` 标题不是 `angular@6.0.0` 提供的模板，而是 `conventional-changelog-writer` 的默认 header 模板

一句话总结：

`eams-component-lib` 是“新 loader + 新 angular preset”，所以能覆盖默认模板并输出 compare-link；`01s-11comm` 是“新 loader 撞上旧 angular preset”，所以当前命令无法成功加载 preset。

## 调查对象

- 仓库 A：`D:\code\store\eams-component-lib`
- 仓库 B：`D:\code\ruan-cat\01s-11comm`
- 关注命令：`pnpm run changelog:conventional-changelog`
- 关注脚本：`conventional-changelog -p angular -i CHANGELOG.md -s`

## 调查方法

本次没有只看 `package.json`，而是同时检查了以下层级：

- 根脚本实际调用的 `.bin/conventional-changelog`
- `conventional-changelog-cli` 私有依赖链
- `conventional-changelog@6` 对 `conventional-changelog-preset-loader` 的调用方式
- `loader` 在两个仓库中各自实际解析到的 `conventional-changelog-angular` 物理包
- `angular@8.3.1` 与 `angular@6.0.0` 的导出形态差异
- `conventional-changelog-core` 与 `conventional-changelog-writer` 的模板合并逻辑

## 完整链路清单

### 链路 1：eams-component-lib 当前生效链路

`pnpm run changelog:conventional-changelog`
-> `node_modules/.bin/conventional-changelog`
-> `conventional-changelog-cli@5.0.0`
-> `conventional-changelog@6.0.0`
-> `conventional-changelog-preset-loader@5.0.0`
-> `import('conventional-changelog-angular')`
-> `root node_modules/conventional-changelog-angular@8.3.1`
-> `default export function createPreset`
-> 返回 `{ commits, parser, writer, whatBump }`
-> `conventional-changelog-core@8.0.0` 合并 `config.writer`
-> `conventional-changelog-writer@8.4.0`
-> compare-link 标题

### 链路 2：01s-11comm 当前脚本实际失败链路

`pnpm run changelog:conventional-changelog`
-> `node_modules/.bin/conventional-changelog`
-> `conventional-changelog-cli@5.0.0`
-> `conventional-changelog@6.0.0`
-> `conventional-changelog-preset-loader@5.0.0`
-> `import('conventional-changelog-angular')`
-> `root node_modules/conventional-changelog-angular@6.0.0`
-> `default export Promise / object`
-> 不满足 `loader@5` 需要的函数导出
-> 抛出 `does not export a function`

### 链路 3：01s-11comm 中引入 angular@6.0.0 的旧链路

`commit-and-tag-version@12.6.1`
-> `conventional-changelog@4.0.0`
-> `conventional-changelog-preset-loader@3.0.0`
-> `conventional-changelog-angular@6.0.0`

## 仓库 A：eams-component-lib 的成功链路

### 结果

`eams-component-lib` 当前的 changelog 命令可以正常加载 `angular` preset，并成功覆盖 writer 默认模板，最终输出 compare-link 标题。

### 依赖链路图

```mermaid
graph TB
    subgraph A_IN["eams-component-lib 命令入口"]
        A1["package.json script<br/>conventional-changelog -p angular"]
        A2["bin conventional-changelog"]
        A3["conventional-changelog-cli 5.0.0"]
        A4["conventional-changelog 6.0.0"]
        A1 --> A2 --> A3 --> A4
    end

    subgraph A_PRESET["preset 加载"]
        A5["preset-loader 5.0.0"]
        A6["import angular preset"]
        A7["root angular 8.3.1"]
        A8["default export is function"]
        A9["createPreset returns writer config"]
        A5 --> A6 --> A7 --> A8 --> A9
    end

    subgraph A_RENDER["writer 渲染"]
        A10["compare-link writer template"]
        A11["conventional-changelog-core 8.0.0"]
        A12["conventional-changelog-writer 8.4.0"]
        A13["final compare-link heading"]
        A11 --> A12 --> A13
        A10 --> A12
    end

    A4 --> A5
    A4 --> A11
    A9 --> A10

    style A7 fill:#9c6,stroke:#690
    style A8 fill:#9c6,stroke:#690
    style A9 fill:#9c6,stroke:#690
    style A10 fill:#9c6,stroke:#690
    style A13 fill:#9c6,stroke:#690
```

### 关键点

- `conventional-changelog@6` 会先调用 `loadPreset('angular')`
- `loader@5` 在该仓库中解析到的是 `root node_modules/conventional-changelog-angular@8.3.1`
- `angular@8.3.1` 的入口导出函数，满足 `loader@5` 的期望
- 该函数返回的 `writer` 配置会覆盖 `conventional-changelog-writer` 默认模板
- 因此最终标题来自 `angular` 模板，而不是 writer 默认 `<small>`

## 仓库 B：01s-11comm 的失败链路

### 结果

`01s-11comm` 当前同名脚本并没有成功加载 `angular` preset。当前 fresh install 环境下执行：

```bash
pnpm exec conventional-changelog -p angular -r 1 -v
```

会直接报错：

```text
Error: The "angular" preset does not export a function. Maybe you are using an old version of the preset. Please upgrade.
```

### 当前失败链路图

```mermaid
graph TB
    subgraph B_IN["01s-11comm 命令入口"]
        B1["package.json script<br/>conventional-changelog -p angular"]
        B2["bin conventional-changelog"]
        B3["conventional-changelog-cli 5.0.0"]
        B4["conventional-changelog 6.0.0"]
        B1 --> B2 --> B3 --> B4
    end

    subgraph B_PRESET["preset 解析"]
        B5["preset-loader 5.0.0"]
        B6["import angular preset"]
        B7["root angular 6.0.0"]
        B8["default export is promise object"]
        B9["loader expects function export"]
        B5 --> B6 --> B7 --> B8 --> B9
    end

    subgraph B_RESULT["失败结果"]
        B10["command throws error"]
    end

    B4 --> B5
    B9 --> B10

    style B7 fill:#f96,stroke:#c60
    style B8 fill:#f96,stroke:#c60
    style B9 fill:#f66,stroke:#900,color:#fff
    style B10 fill:#f66,stroke:#900,color:#fff
```

### 关键点

- `01s-11comm` 同时存在两代链路：
  - 新链：`conventional-changelog-cli@5 -> conventional-changelog@6 -> loader@5`
  - 旧链：`commit-and-tag-version@12.6.1 -> conventional-changelog@4 -> loader@3 -> angular@6`
- 当前命令虽然是通过 CLI5 进入 `conventional-changelog@6`
- 但是 `loader@5` 在该仓库里做 `import('conventional-changelog-angular')` 时，最终命中的是根目录的 `angular@6.0.0`
- `angular@6.0.0` 不是“函数导出型 preset”，因此不符合 `loader@5` 的新接口要求

## 旧链路为什么会干扰新链路

### 01s-11comm 的包图混装现象

```mermaid
graph TB
    subgraph ROOT["01s-11comm 根 node_modules"]
        R1A["root conventional-changelog<br/>4.0.0"]
        R1B["root angular preset<br/>6.0.0"]
    end

    subgraph NEW["新 changelog 链路"]
        N1A["conventional-changelog-cli 5.0.0"]
        N1B["conventional-changelog 6.0.0"]
        N1C["preset-loader 5.0.0"]
        N1D["expected angular 8.3.0"]
        N1A --> N1B --> N1C --> N1D
    end

    subgraph OLD["旧 release 链路"]
        O1A["commit-and-tag-version 12.6.1"]
        O1B["conventional-changelog 4.0.0"]
        O1C["preset-loader 3.0.0"]
        O1D["legacy angular 6.0.0"]
        O1A --> O1B
        O1A --> O1C
        O1A --> O1D
    end

    O1B -. "hoist source" .-> R1A
    O1D -. "hoist source" .-> R1B
    N1C -. "resolved at runtime" .-> R1B
    N1D -. "not chosen" .-> R1E["runtime still picks root 6.0.0"]
    R1E --> R1B

    style R1B fill:#f96,stroke:#c60
    style O1D fill:#f66,stroke:#900,color:#fff
    style N1D fill:#6c6,stroke:#090,color:#fff
    style R1E fill:#fce,stroke:#c66
```

### 解释

这个仓库的问题不是“没有装 `angular@8`”，而是“`loader@5` 最终没有命中 `angular@8`”。

更准确地说：

- `conventional-changelog@6` 自己私有依赖里的 `loader` 确实是 `5.0.0`
- 但 `loader@5` 里面使用的是 `import('conventional-changelog-angular')`
- 这个 bare specifier 的解析结果会向上命中仓库根的 `node_modules/conventional-changelog-angular`
- 而 `01s-11comm` 根目录的这个包当前指向的是 `6.0.0`
- 所以新链路并没有得到新式 `angular` preset，而是拿到了旧式 `angular@6`

## angular@8.3.1 与 angular@6.0.0 的导出差异

### 对比图

```mermaid
graph LR
    subgraph NEW_API["新 API"]
        X1["angular 8.3.1"]
        X2["default export is function"]
        X3["loader 5 can call createPreset"]
        X1 --> X2 --> X3
    end

    subgraph OLD_API["旧 API"]
        Y1["angular 6.0.0"]
        Y2["module exports promise"]
        Y3["resolves to legacy config object"]
        Y1 --> Y2 --> Y3
    end

    subgraph BREAKAGE["交叉不兼容"]
        Z1["loader 5 expects function"]
        Z2["angular 6 returns object"]
        Z3["preset loading fails"]
        Z1 --> Z2 --> Z3
    end

    style X3 fill:#9c6,stroke:#690
    style Z3 fill:#f66,stroke:#900,color:#fff
```

### 语义差异

`angular@8.3.1`：

- 入口导出一个函数
- `loader@5` 调用 `createPreset()` 后得到 `writer` 配置
- 能被 `conventional-changelog@6` 正常消费

`angular@6.0.0`：

- 入口导出的是一个 `Promise`
- Promise resolve 之后才得到旧结构配置对象
- 这种导出形态是为旧链路准备的，不符合 `loader@5` 的函数契约

## 为什么 `<small>` 不是 angular@6.0.0 提供的

### 默认 writer 模板

`conventional-changelog-writer` 的默认 header 模板内置了 `<small>`：

```mermaid
graph TD
    W1["conventional-changelog-core"]
    W2["merge writer options"]
    W3{"preset writer injected"}
    W4["use angular writer template"]
    W5["fallback to writer default template"]
    W6["default small heading"]
    W7["compare-link heading"]

    W1 --> W2 --> W3
    W3 -->|yes| W4 --> W7
    W3 -->|no| W5 --> W6

    style W4 fill:#9c6,stroke:#690
    style W7 fill:#9c6,stroke:#690
    style W5 fill:#f96,stroke:#c60
    style W6 fill:#f96,stroke:#c60
```

### 本次调查结论

- `<small>` 来自 `conventional-changelog-writer` 默认模板
- compare-link 来自 `angular` preset 返回的 `writer` 模板
- `angular@6.0.0` 自己的 header 模板也已经是 compare-link 风格，不是 `<small>`
- `01s-11comm` 当前脚本下的关键问题不是“加载成功但模板不同”，而是“当前 loader 根本没有成功加载 preset”

## 两仓联调对照图

```mermaid
graph TB
    subgraph TOP["eams-component-lib"]
        direction LR
        EA1["loader 5"]
        EA2["root angular 8.3.1"]
        EA3["function export"]
        EA4["writer override works"]
        EA5["compare-link heading"]
        EA1 --> EA2 --> EA3 --> EA4 --> EA5
    end

    subgraph BOTTOM["01s-11comm"]
        direction LR
        OB1["loader 5"]
        OB2["root angular 6.0.0"]
        OB3["promise object export"]
        OB4["function check fails"]
        OB5["command throws error"]
        OB1 --> OB2 --> OB3 --> OB4 --> OB5
    end

    EA5 ~~~ OB1

    style EA2 fill:#6c6,stroke:#090,color:#fff
    style EA4 fill:#6c6,stroke:#090,color:#fff
    style EA5 fill:#9c6,stroke:#690
    style OB2 fill:#f96,stroke:#c60
    style OB4 fill:#f66,stroke:#900,color:#fff
    style OB5 fill:#f66,stroke:#900,color:#fff
```

## 证据摘要

### eams-component-lib

- 当前脚本链路实际命中 `conventional-changelog-angular@8.3.1`
- `loader@5` 在该仓库中可正常执行 `loadPreset('angular')`
- 当前 `CHANGELOG.md` 顶部是 compare-link 标题

### 01s-11comm

- `pnpm why conventional-changelog-preset-loader` 显示同时存在 `3.0.0` 和 `5.0.0`
- 根 `node_modules/conventional-changelog-angular` 指向 `6.0.0`
- `loader@5` 在该仓库里执行 `loadPreset('angular')` 会抛出 `does not export a function`
- 当前 `pnpm exec conventional-changelog -p angular -r 1 -v` 无法复现成功输出

## 最终结论

本次差异的根因可以归纳为三句话：

1. `conventional-changelog-writer` 一直都会参与渲染，但只有在 preset 成功加载后，默认 `<small>` 模板才会被覆盖。
2. `eams-component-lib` 当前命中了 `angular@8.3.1`，所以 preset 成功加载，writer 被覆盖，得到 compare-link。
3. `01s-11comm` 当前命中了 `angular@6.0.0`，而 `loader@5` 只接受函数导出型 preset，因此当前命令直接失败，根本走不到 compare-link 覆盖阶段。

## 建议

- 如果要让 `01s-11comm` 的当前 changelog 脚本恢复可复现，应先消除根 `node_modules` 中 `angular@6.0.0` 对 `loader@5` 的命中影响
- 如果继续保留 `commit-and-tag-version@12.6.1` 旧链路，就需要明确隔离它与 `conventional-changelog-cli@5` 新链路的 preset 解析结果
- 如果目标是统一两仓行为，最稳妥的方向是统一到同一代 `conventional-changelog` / `preset-loader` / `angular preset` 组合
