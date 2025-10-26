<!--
	一次性提示词
	未完成
 -->

# 推荐适用于 window 系统的 claude code hooks 配置

我希望在使用 claude code 时，能够在完成一个任务后，收到来自 window 系统的通知栏提示。

请在 github 内，帮我类似的仓库。

1. 主要找 claude code hooks 相关的配置。找一下类似的 claude code 插件市场，使用 hooks 实现通知的。
2. 其次是使用 node 函数吊起 window10/11 通知栏提示的仓库。

## 备选方案

我想自己写 hooks，推送到自己的插件商城内。插件商城内怎么确保 hooks 写的 typescript 脚本能否正常运行呢？

- 优选 https://github.com/Roy-Tu/claude-code-task-notifier
- 这个包太老了，几年不更新了 https://github.com/mikaelbr/node-notifier

## 01 帮我找用 node+typescript 实现 claude code hooks 的 github 仓库

很好。我决定使用 https://github.com/Roy-Tu/claude-code-task-notifier 这个仓库来完成我的需求。

我打算以 claude code 插件市场的方式，在 https://github.com/ruan-cat/monorepo 仓库内制作一个 claude code 插件，提供一个 hooks，实现 window 场景下全局提示。

这个 hooks 钩子将使用 node 的 tsx 来直接运行 typescript 脚本。请你为我设计一个方案，确保我安装完 claude code 插件后，这个 hooks 能够正常运行 typescript 脚本。

请为我编写实现 window 系统内提示的 typescript 脚本。

请告知我相关的注意事项和风险项

### 使用 Roy-Tu/claude-code-task-notifier 生成的全局通知配置

在 `C:\Users\pc\.claude\settings.json` 内：

```json
{
	"hooks": {
		"Notification": [
			{
				"hooks": [
					{
						"type": "command",
						"command": "powershell -NoProfile -Command \"Add-Type -AssemblyName System.Windows.Forms; $balloon = New-Object System.Windows.Forms.NotifyIcon; $path = (Get-Process -Id $pid).Path; $balloon.Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($path); $balloon.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Warning; $balloon.BalloonTipText = 'Claude Task Completed!'; $balloon.BalloonTipTitle = 'Claude Code'; $balloon.Visible = $true; $balloon.ShowBalloonTip(5000)\""
					}
				]
			}
		],
		"Stop": [
			{
				"hooks": [
					{
						"type": "command",
						"command": "powershell -NoProfile -Command \"Add-Type -AssemblyName System.Windows.Forms; $balloon = New-Object System.Windows.Forms.NotifyIcon; $path = (Get-Process -Id $pid).Path; $balloon.Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($path); $balloon.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Warning; $balloon.BalloonTipText = 'Claude Task Stopped!'; $balloon.BalloonTipTitle = 'Claude Code'; $balloon.Visible = $true; $balloon.ShowBalloonTip(5000)\""
					}
				]
			}
		]
	}
}
```

说实话有点难绷，生成的是 ps1 脚本，而不是单纯的，纯粹的 node 包。
