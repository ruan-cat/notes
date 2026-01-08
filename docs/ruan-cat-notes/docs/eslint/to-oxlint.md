# 从 eslint 迁移到 oxlint

- 核心参考资料： https://www.hongkiat.com/blog/eslint-to-oxlint-migration-guide/
- 关闭 Oxlint 已支持的所有规则： https://github.com/oxc-project/eslint-plugin-oxlint
- 编辑器设置： https://oxc.rs/docs/guide/usage/linter/editors.html#vs-code

建议是先完成 eslint 的扁平化配置后，再开始考虑迁移 oxlint 。

## 批量迁移并生成 `.oxlintrc.json`

运行一次性命令 `@oxlint/migrate` 。根据具体的扁平化 eslint 配置文件来选择被迁移的配置文件。通常是 `eslint.config.mjs` 。

```bash
npx @oxlint/migrate eslint.config.mjs
```

## 安装并配置 `eslint-plugin-oxlint`

oxlint 只能代替大部分 eslint 能运行的规则，仍旧有部分 eslint 规则还不能完全替代，现阶段是共同使用 oxlint 和 eslint 的。为了提高性能，需要屏蔽掉 oxlint 已经能完成的部分 eslint 规则。故需要该 `eslint-plugin-oxlint` 插件。

- 仓库： https://github.com/oxc-project/eslint-plugin-oxlint

安装：

```bash
pnpm i -D eslint-plugin-oxlint
```

配置 eslint：

```js
import oxlint from 'eslint-plugin-oxlint';
export default [
  ..., // 其他的eslint配置
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'), // 读取已经被迁移生成的 oxlint 配置文件
];
```

## 同时使用 oxlint 和 eslint

在 package.json 内编写命令，先执行 oxlint，在执行 eslint。

```json
{
	"lint:fix": "oxlint --fix && eslint --fix"
}
```
