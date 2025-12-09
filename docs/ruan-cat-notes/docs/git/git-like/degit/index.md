---
order: 2
---

<script setup>
import DynamicSplicingDegitCmd from "./dynamic-splicing-degit-cmd.vue";
</script>

# degit

degit 是一个项目克隆工具，经常用于克隆位于 github 仓库内的模板。

在使用 degit 时，出现克隆失败的情况。很普遍。

## NODE_TLS_REJECT_UNAUTHORIZED 方案

- https://github.com/solidjs/solid/issues/1050#issuecomment-2241699257

基于该方案，平时在 powershell 内要运行的命令应该为：

```bash
$env:NODE_TLS_REJECT_UNAUTHORIZED=0; degit XXX
```

效果如下：

::: details

![2025-04-22-02-26-26](https://gh-img-store.ruan-cat.com/img/2025-04-22-02-26-26.png)

:::

### 动态拼接 degit 命令

以下小工具会帮助你拼接临时使用的环境变量：

<ClientOnly>
	<DynamicSplicingDegitCmd />
</ClientOnly>

## HTTPS_PROXY 环境变量方案

- https://github.com/Rich-Harris/degit/issues/143#issuecomment-1172888955

PowerShell

```bash
$env:HTTPS_PROXY="http://127.0.0.1:10809"
```

cmd

```bash
set https_proxy=http://127.0.0.1:10809
```

## 全局的解决方案

设置 `$env:HTTPS_PROXY` 变量的方式是有效的，但是该方案仅仅只能临时地为当前 powershell 设置环境变量，不是每一个 powershell 都是有效的。

目前考虑使用设置全局环境变量的方式，解决此问题。

::: details

![2024-12-09-08-06-57](https://gh-img-store.ruan-cat.com/img/2024-12-09-08-06-57.png)

:::

### 废弃全局方案

在我尝试使用 github 仓库作为一个 npm 包时，其本地克隆会被上述的全局变量影响，故不使用全局配置环境变量的方案。
