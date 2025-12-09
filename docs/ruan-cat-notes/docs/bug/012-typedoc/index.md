# typedoc 无法正确使用 tsconfig.json 的排除配置

typedoc 无法正确使用 tsconfig.json 的排除配置，无法排除掉期望的 ts 文件，很多文件还是被扫描到了。

## 未能解决

目前（2025-2-28）我没有找到合适的方案，让 typedoc 有效地扫描识别 vite 项目内的 ts 文件，并生成文档
