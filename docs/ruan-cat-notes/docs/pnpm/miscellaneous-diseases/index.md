# pnpm 的疑难杂症

自从用了 pnpm 后，隔三差五都会遇到 bug。还有一些完全搞不清楚的 bug，只能绕过规避。

## 不同的 node 版本产生了不同的全局 pnpm 版本

注意到在不同的 node 环境下，pnpm 有着不同的版本。

### node16

```bash
PS C:\Windows\system32> node -v
v16.19.0
PS C:\Windows\system32> pnpm -v
8.2.0
```

![2023-06-12-14-56-32](https://gh-img-store.ruan-cat.com/img/2023-06-12-14-56-32.png)

### node14

```bash
PS C:\Windows\system32> node -v
v14.20.1
PS C:\Windows\system32> pnpm -v
7.22.0
```

![2023-06-12-14-58-19](https://gh-img-store.ruan-cat.com/img/2023-06-12-14-58-19.png)

### 猜测

不知道是为什么，pnpm 作为全局包，在不同的 node 环境下，有着不同的版本。不知道是不是 nvm 本身的 node 导致全局包的存储全部混乱了。
