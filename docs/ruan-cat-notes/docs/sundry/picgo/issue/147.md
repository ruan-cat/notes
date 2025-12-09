# issue2

使用快捷键上传图片，提示 You must be logged in to use 的错误。

### Describe the bug

使用快捷键上传图片，提示 You must be logged in to use 的错误。

### To Reproduce

1. 在个人全局 settings.json 中添加以下的配置：

```json
{
	"picgo": {
		// 默认为空，则表示使用VSCode的setting.json
		"path": ""
	},
	"picBed": {
		// 默认使用 SM.MS 图床
		"current": "smms",
		// 从 https://sm.ms/home/apitoken 获取的 token
		"smms": {
			"token": "mytoken",
			"backupDomain": "smms.app"
		}
	}
}
```

2. 在 markdown 文件中插入图片。
3. 报错。

### Expected behavior

上述的配置已经足够上传图床了。期望代码不会出现错误。

### Screenshots

![20231122223737](https://s2.loli.net/2023/11/22/ngl1URVouXzvjt7.png)

### System information

- OS: Windows
- Version Windows 10

### VSCode information

- `Help` -> `About` -> `Copy`

  ```txt
  版本: 1.83.1 (system setup)
  提交: f1b07bd25dfad64b0167beb15359ae573aecd2cc
  日期: 2023-10-10T23:48:05.904Z
  Electron: 25.8.4
  ElectronBuildId: 24154031
  Chromium: 114.0.5735.289
  Node.js: 18.15.0
  V8: 11.4.183.29-electron.0
  OS: Windows_NT x64 10.0.19045
  ```

- `vs-picgo` version `2.1.6`

- Settings begin with `picgo`:

  ```json
  {
  	"picgo": {
  		"path": ""
  	},
  	"picBed": {
  		"current": "smms",
  		"smms": {
  			"token": "mytoken",
  			"backupDomain": "smms.app"
  		}
  	}
  }
  ```

### Additional context

**Is this bug picBed specific, i.e. only the picBed you use is affected?** Yes.

**Is there any error in the console (`Help` -> `Toggle Developer tools`)?**: Yes.

```txt
[PicGo ERROR]: Error: You must be logged in to use.
    at Object.handle (c:\Users\pc\.vscode\extensions\spades.vs-picgo-2.1.6\node_modules\picgo\dist\src\plugins\uploader\smms.js:51:1)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at Lifecycle.doUpload (c:\Users\pc\.vscode\extensions\spades.vs-picgo-2.1.6\node_modules\picgo\dist\src\core\Lifecycle.js:80:1)
    at Lifecycle.start (c:\Users\pc\.vscode\extensions\spades.vs-picgo-2.1.6\node_modules\picgo\dist\src\core\Lifecycle.js:26:1)
    at PicGo.upload (c:\Users\pc\.vscode\extensions\spades.vs-picgo-2.1.6\node_modules\picgo\dist\src\core\PicGo.js:194:37)
    at async Promise.allSettled (index 1)
```
