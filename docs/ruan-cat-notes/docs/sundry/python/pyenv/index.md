# pyenv ，Python 版本管理工具

我不太可能高强度使用 Python，但是受到 node 版本控制的思想影响，在安装 Python 环境时，我也想着用版本控制工具来安装 Python。

这样就便于我后面安装 MCP 了。

## 在 window 内安装专门的 `pyenv-win`

- 安装教程： https://juejin.cn/post/7467931315401965631

### 克隆项目

```bash
git clone --depth=1 https://github.com/pyenv-win/pyenv-win.git "$HOME\.pyenv"
```

这里安装的位置是 C 盘。未来想升级时，可以直接考虑来这里拉取仓库。

![2025-10-13-10-56-53](https://gh-img-store.ruan-cat.com/img/2025-10-13-10-56-53.png)

### 安装 Python

```bash
pyenv install 3.11.9 --mirror https://npm.taobao.org/mirrors/python/
```

有疑惑，这个 `--mirror` 无效，只能用裸的命令安装：

```bash
pyenv install 3.11.9
```

### 全局设置

```bash
pyenv global 3.11.9
```
