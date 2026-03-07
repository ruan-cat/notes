# picgo

picgo 是一个图床上传工具。

## vs-picgo

这是 vscode 和 picgo 配合的工具，允许我们在使用 markdown 时，直接搭配 picgo 快速上传图片到图床内。

本插件允许我们在不直接使用桌面版 picgo 的前提下，直接使用 picgo 的内核完成图床上传。

## smms 图床迁移到 `S.EE` 并且从免费变成收费

- https://docs.picgo.app/zh/gui/guide/getting-started

我也不清楚这个到底支不支持免费额度，就不折腾了。打算直接用之前已经有的 github 图床。

旧的 smms 配置：

<!--
	smms token 504qTPFHo7y1r3VSehYxv3Si0GWZ6aRe
	放出来也没关系 反正平台作废了 该token已经失效了
-->

```json
{
	"picgo": {
		"path": "",
		"customUploadName": "${dateTime}${extName}",
		"picBed": {
			"current": "smms",
			"uploader": "smms",
			"smms": {
				"token": "具体申请的token",
				"backupDomain": "smms.app"
			}
		}
	}
}
```

我的决策是废弃这个东西。不考虑。

### 在个人的 vscode 配置内找到并删改

重点修改 picBed.current 和 picBed.uploader

```json
{
	"picgo": {
		"path": "",
		"customUploadName": "${dateTime}${extName}",
		"picBed": {
			"current": "github",
			"uploader": "github",
			"github": {
				"repo": "ruan-cat/img-store",
				"branch": "main",
				"token": "具体的token",
				"path": "img/",
				"customUrl": "https://gh-img-store.ruan-cat.com"
			}
		}
	}
}
```

### 修改 vscode 插件的配置

在全局电脑内，这个配置通常在 `C:\Users\pc\.picgo\config.json` 目录内。

```json
{
	"picBed": {
		"uploader": "github",
		"current": "github"
	},
	"picgoPlugins": {}
}
```

## 在 vscode 内完成图床配置
