# MODULE_NOT_FOUND when `automd@0.4.1` work with `jiti@2.4.2`

<!-- https://github.com/unjs/automd/issues/123 -->

## Environment

- node `22.14.0`
- pnpm `10.16.1`
- operating system `window 10`

## Reproduction

### github repo

- https://github.com/ruan-cat/automd-error-reproduction

### github workflow

- https://github.com/ruan-cat/monorepo/actions/runs/17734816290
- https://github.com/ruan-cat/monorepo/actions/runs/17735967204

## Describe the bug

<!-- 以下内容全部都是用翻译软件翻译的。 -->

> I am **not** a native English speaker. The following content has all been translated using translation software.

Suddenly, I received an error message from GitHub Actions, stating that `automd` couldn't find the `jiti` module.

<!-- 我目前是通过配置依赖包的版本覆盖来临时解决此问题的，希望你们可以修复这两个包之间的问题。 -->

Currently, I am temporarily resolving this issue by overriding the versions of the dependent packages. I hope you can fix the problem between these two packages.

```yaml
# pnpm-workspace.yaml
overrides:
  "automd@^0.4.1": "0.4.0"
  "jiti@^2.4.2": "2.4.1"
```

<!-- 在最小复现案例内，复现的结果如下图所示： -->

In the smallest reproducible case, the result of the reproduction is shown in the following figure .

![2025-09-15-23-07-39](https://gh-img-store.ruan-cat.com/img/2025-09-15-23-07-39.png)

<!-- 应用依赖包忽略配置后，重新安装依赖。 -->

After ignoring the configuration for the application dependency package, reinstall the dependencies.

![2025-09-15-23-10-33](https://gh-img-store.ruan-cat.com/img/2025-09-15-23-10-33.png)

<!-- 重新运行 automd 命令就正常了。 -->

Re-running the "automd" command solved the problem.

![2025-09-15-23-11-27](https://gh-img-store.ruan-cat.com/img/2025-09-15-23-11-27.png)

## Logs

```log
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/runner/work/monorepo/monorepo/node_modules/.pnpm/automd@0.4.1/node_modules/automd/node_modules/.pnpm/jiti@2.4.2/node_modules/jiti/lib/jiti.mjs' imported from /home/runner/work/monorepo/monorepo/node_modules/.pnpm/automd@0.4.1/node_modules/automd/dist/cli.mjs
```
