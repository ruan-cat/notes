# claudia，claude code 的可视化桌面应用

claudia，是面向 claude code 的可视化桌面应用。基于 tarui 技术。目前（2025-8-7）需要人为下载仓库源码，手动安装 rust 环境完成 exe 打包。

- https://claudiacode.com/
- https://github.com/getAsterisk/claudia
- https://www.aivi.fyi/aiagents/introduce-Claudia
- [`【🚀Claudia让你丢掉Cursor告别命令行！Claude Code终于有GUI了！专为Claude Code打造最强可视化界面保姆级教程！可视化项目管理】`](https://www.bilibili.com/video/BV16D34zpEGu/)

## 动机

折腾这个工具的目的，是为了拥有更好的 claude code 使用体验。直接使用 claude code 的时候，没办法管理，调度对话。不方便。

## 本地运行项目，出错

::: details 缺少 ico 文件

<<< ./error.log

:::

相关 issue：

- https://github.com/getAsterisk/claudia/issues/256

解决方案：

- https://github.com/getAsterisk/claudia/issues/188#issuecomment-3111755644

```bash
npx @tauri-apps/cli icon .\src-tauri\icons\icon.png
```
